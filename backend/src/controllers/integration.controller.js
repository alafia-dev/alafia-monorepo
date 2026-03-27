const asyncHandler = require('../utils/async-handler');
const integrationService = require('../services/integration.service');

const createLabOrder = asyncHandler(async (req, res) => {
  const integrationRequest = await integrationService.createLabIntegrationRequest({
    actorUserId: req.auth.sub,
    ...req.validatedBody,
  });

  res.status(201).json({
    ok: true,
    message: 'Lab order request accepted for processing',
    integrationRequest,
  });
});

const createPharmacyOrder = asyncHandler(async (req, res) => {
  const integrationRequest = await integrationService.createPharmacyIntegrationRequest({
    actorUserId: req.auth.sub,
    ...req.validatedBody,
  });

  res.status(201).json({
    ok: true,
    message: 'Pharmacy request accepted for processing',
    integrationRequest,
  });
});

const listMyIntegrationRequests = asyncHandler(async (req, res) => {
  const requests = await integrationService.listPatientIntegrationRequests(req.auth.sub);
  res.status(200).json({ ok: true, requests });
});

module.exports = {
  createLabOrder,
  createPharmacyOrder,
  listMyIntegrationRequests,
};
