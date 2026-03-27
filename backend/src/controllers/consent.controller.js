const asyncHandler = require('../utils/async-handler');
const consentService = require('../services/consent.service');

const listMyConsents = asyncHandler(async (req, res) => {
  const consents = await consentService.listPatientConsents(req.auth.sub);
  res.status(200).json({ ok: true, consents });
});

const grantConsent = asyncHandler(async (req, res) => {
  const consent = await consentService.grantPatientConsent({
    patientUserId: req.auth.sub,
    ...req.validatedBody,
  });

  res.status(201).json({ ok: true, consent });
});

const revokeMyConsent = asyncHandler(async (req, res) => {
  const revoked = await consentService.revokePatientConsent({
    consentId: req.validatedParams.consentId,
    patientUserId: req.auth.sub,
  });

  res.status(200).json({ ok: true, consent: revoked });
});

module.exports = {
  listMyConsents,
  grantConsent,
  revokeMyConsent,
};
