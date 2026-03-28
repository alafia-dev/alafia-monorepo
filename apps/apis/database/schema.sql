CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_type') THEN
		CREATE TYPE role_type AS ENUM ('doctor', 'nurse', 'admin', 'patient');
	END IF;
END $$;

DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invite_status_type') THEN
		CREATE TYPE invite_status_type AS ENUM ('pending', 'accepted', 'expired', 'revoked');
	END IF;
END $$;

DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_tier_type') THEN
		CREATE TYPE subscription_tier_type AS ENUM ('free', 'basic', 'premium', 'enterprise');
	END IF;
END $$;

CREATE TABLE IF NOT EXISTS users (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	did TEXT UNIQUE,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	phone TEXT UNIQUE NOT NULL,
	email TEXT UNIQUE,
	password_hash TEXT,
	role role_type NOT NULL DEFAULT 'patient',
	is_active BOOLEAN NOT NULL DEFAULT TRUE,
	last_login_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

CREATE TABLE IF NOT EXISTS hospitals (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name TEXT NOT NULL,
	code TEXT UNIQUE NOT NULL,
	address TEXT,
	created_by UUID REFERENCES users(id),
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hospital_memberships (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
	user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	role role_type NOT NULL,
	invited_by UUID REFERENCES users(id),
	joined_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	UNIQUE (hospital_id, user_id)
);

CREATE TABLE IF NOT EXISTS hospital_invites (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
	phone TEXT NOT NULL,
	email TEXT,
	role role_type NOT NULL,
	token TEXT UNIQUE NOT NULL,
	status invite_status_type NOT NULL DEFAULT 'pending',
	expires_at TIMESTAMPTZ NOT NULL,
	accepted_by UUID REFERENCES users(id),
	created_by UUID REFERENCES users(id),
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE hospital_invites ADD COLUMN IF NOT EXISTS email TEXT;

CREATE TABLE IF NOT EXISTS otp_codes (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	phone TEXT NOT NULL,
	otp_hash TEXT NOT NULL,
	purpose TEXT NOT NULL,
	expires_at TIMESTAMPTZ NOT NULL,
	consumed_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otp_codes_phone ON otp_codes(phone);

CREATE TABLE IF NOT EXISTS patient_profiles (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	date_of_birth DATE,
	gender TEXT,
	blood_group TEXT,
	emergency_contact_name TEXT,
	emergency_contact_phone TEXT,
	allergies TEXT,
	chronic_conditions TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feature_flags (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	key TEXT UNIQUE NOT NULL,
	description TEXT,
	is_globally_enabled BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscription_tiers (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name subscription_tier_type UNIQUE NOT NULL,
	display_name TEXT NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscription_tier_features (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	tier_id UUID NOT NULL REFERENCES subscription_tiers(id) ON DELETE CASCADE,
	feature_flag_id UUID NOT NULL REFERENCES feature_flags(id) ON DELETE CASCADE,
	is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
	UNIQUE (tier_id, feature_flag_id)
);

CREATE TABLE IF NOT EXISTS user_subscriptions (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	tier_id UUID NOT NULL REFERENCES subscription_tiers(id),
	starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	ends_at TIMESTAMPTZ,
	is_active BOOLEAN NOT NULL DEFAULT TRUE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	actor_user_id UUID REFERENCES users(id),
	action TEXT NOT NULL,
	entity_type TEXT NOT NULL,
	entity_id TEXT,
	metadata JSONB,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS did_wallets (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	did TEXT UNIQUE NOT NULL,
	wallet_provider TEXT,
	is_active BOOLEAN NOT NULL DEFAULT TRUE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS consent_grants (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	patient_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	grantee_type TEXT NOT NULL,
	grantee_id TEXT NOT NULL,
	scope TEXT NOT NULL,
	status TEXT NOT NULL DEFAULT 'active',
	expires_at TIMESTAMPTZ,
	granted_by UUID NOT NULL REFERENCES users(id),
	revoked_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consent_grants_patient ON consent_grants(patient_user_id);

CREATE TABLE IF NOT EXISTS integration_requests (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	patient_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
	request_type TEXT NOT NULL,
	status TEXT NOT NULL DEFAULT 'pending',
	payload JSONB,
	requested_by UUID REFERENCES users(id),
	processed_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO subscription_tiers (name, display_name)
VALUES
	('free', 'Free'),
	('basic', 'Basic'),
	('premium', 'Premium'),
	('enterprise', 'Enterprise')
ON CONFLICT (name) DO NOTHING;

INSERT INTO feature_flags (key, description, is_globally_enabled)
VALUES
	('labs.integration', 'Integrated lab workflow', FALSE),
	('pharmacy.integration', 'Integrated pharmacy workflow', FALSE),
	('did.wallet', 'Patient DID wallet support', FALSE),
	('advanced.audit', 'Enhanced audit insights', FALSE),
	('consent.sharing', 'Patient-managed consent sharing', TRUE),
	('invite.onboarding', 'Hospital invite onboarding flow', TRUE)
ON CONFLICT (key) DO NOTHING;
