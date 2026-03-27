const asyncHandler = require('../utils/async-handler');
const patientService = require('../services/patient.service');

const getMyPatientProfile = asyncHandler(async (req, res) => {
  const { user, profile } = await patientService.getPatientProfileBundle(req.auth.sub);
  res.status(200).json({ ok: true, user, profile });
});

const updateMyPatientProfile = asyncHandler(async (req, res) => {
  const profile = await patientService.updatePatientProfile(req.auth.sub, req.validatedBody || {});

  res.status(200).json({ ok: true, profile });
});

module.exports = {
  getMyPatientProfile,
  updateMyPatientProfile,
};
