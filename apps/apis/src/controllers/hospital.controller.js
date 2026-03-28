const asyncHandler = require('../utils/async-handler');
const hospitalService = require('../services/hospital.service');

const createHospitalHandler = asyncHandler(async (req, res) => {
  const hospital = await hospitalService.createHospitalWithAdminMembership({
    ...req.validatedBody,
    actorUserId: req.auth.sub,
  });

  res.status(201).json({ ok: true, hospital });
});

const inviteToHospital = asyncHandler(async (req, res) => {
  const result = await hospitalService.inviteHospitalMember({
    hospitalId: req.validatedParams.hospitalId,
    ...req.validatedBody,
    actorUserId: req.auth.sub,
  });

  res.status(201).json({
    ok: true,
    invite: result.invite,
    onboardingUrl: result.onboardingUrl,
    emailDelivery: result.emailDelivery,
  });
});

const acceptHospitalInvite = asyncHandler(async (req, res) => {
  const result = await hospitalService.acceptHospitalInviteByToken({
    token: req.validatedParams.token,
    actorUserId: req.auth ? req.auth.sub : null,
  });

  res.status(200).json({ ok: true, ...result });
});

const listMembers = asyncHandler(async (req, res) => {
  const members = await hospitalService.getHospitalMembers(req.validatedParams.hospitalId);
  res.status(200).json({ ok: true, members });
});

module.exports = {
  createHospitalHandler,
  inviteToHospital,
  acceptHospitalInvite,
  listMembers,
};
