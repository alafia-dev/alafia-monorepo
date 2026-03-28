const ApiError = require('../utils/api-error');
const { createConsentGrant, listConsentsByPatient, revokeConsent } = require('../models/consent.model');
const { createAuditLog } = require('../models/audit.model');
const { findUserById } = require('../models/user.model');
const { sendConsentStatusEmail } = require('./email.service');

const listPatientConsents = (patientUserId) => listConsentsByPatient(patientUserId);

const grantPatientConsent = async ({ patientUserId, granteeType, granteeId, scope, expiresAt }) => {
  const consent = await createConsentGrant({
    patientUserId,
    granteeType,
    granteeId,
    scope,
    expiresAt,
    grantedBy: patientUserId,
  });

  await createAuditLog({
    actorUserId: patientUserId,
    action: 'consent.granted',
    entityType: 'consent_grant',
    entityId: consent.id,
    metadata: { granteeType, granteeId, scope, expiresAt: expiresAt || null },
  });

  const user = await findUserById(patientUserId);
  if (user && user.email) {
    await sendConsentStatusEmail({
      to: user.email,
      firstName: user.first_name,
      action: 'granted',
      scope,
      granteeType,
      granteeId,
    });
  }

  return consent;
};

const revokePatientConsent = async ({ consentId, patientUserId }) => {
  const consent = await revokeConsent({ consentId, patientUserId });
  if (!consent) {
    throw new ApiError(404, 'Consent not found for patient');
  }

  await createAuditLog({
    actorUserId: patientUserId,
    action: 'consent.revoked',
    entityType: 'consent_grant',
    entityId: consent.id,
    metadata: { status: consent.status },
  });

  const user = await findUserById(patientUserId);
  if (user && user.email) {
    await sendConsentStatusEmail({
      to: user.email,
      firstName: user.first_name,
      action: 'revoked',
      scope: consent.scope,
      granteeType: consent.grantee_type,
      granteeId: consent.grantee_id,
    });
  }

  return consent;
};

module.exports = {
  listPatientConsents,
  grantPatientConsent,
  revokePatientConsent,
};
