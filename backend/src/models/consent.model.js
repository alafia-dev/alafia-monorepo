const { pool } = require('../config/db');

const createConsentGrant = async ({ patientUserId, granteeType, granteeId, scope, expiresAt, grantedBy }) => {
  const result = await pool.query(
    `INSERT INTO consent_grants (patient_user_id, grantee_type, grantee_id, scope, expires_at, granted_by)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, patient_user_id, grantee_type, grantee_id, scope, status, expires_at, granted_by, created_at`,
    [patientUserId, granteeType, granteeId, scope, expiresAt || null, grantedBy]
  );
  return result.rows[0];
};

const listConsentsByPatient = async (patientUserId) => {
  const result = await pool.query(
    `SELECT id, patient_user_id, grantee_type, grantee_id, scope, status, expires_at, granted_by, revoked_at, created_at
     FROM consent_grants
     WHERE patient_user_id = $1
     ORDER BY created_at DESC`,
    [patientUserId]
  );
  return result.rows;
};

const revokeConsent = async ({ consentId, patientUserId }) => {
  const result = await pool.query(
    `UPDATE consent_grants
     SET status = 'revoked', revoked_at = NOW(), updated_at = NOW()
     WHERE id = $1 AND patient_user_id = $2
     RETURNING id, patient_user_id, grantee_type, grantee_id, scope, status, revoked_at, updated_at`,
    [consentId, patientUserId]
  );
  return result.rows[0] || null;
};

module.exports = {
  createConsentGrant,
  listConsentsByPatient,
  revokeConsent,
};
