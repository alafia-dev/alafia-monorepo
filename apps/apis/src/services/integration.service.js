const ApiError = require('../utils/api-error');
const { createIntegrationRequest, listIntegrationRequestsByPatient } = require('../models/integration.model');
const { listEnabledFeaturesForUser } = require('../models/subscription.model');
const { createAuditLog } = require('../models/audit.model');

const assertFeatureEnabled = async (userId, key) => {
  const features = await listEnabledFeaturesForUser(userId);
  const enabled = features.some((feature) => feature.key === key && feature.enabled);
  if (!enabled) {
    throw new ApiError(403, `${key} is disabled for this user tier`);
  }
};

const createLabIntegrationRequest = async ({ actorUserId, hospitalId, testCode, notes, priority = 'normal' }) => {
  await assertFeatureEnabled(actorUserId, 'labs.integration');

  const integrationRequest = await createIntegrationRequest({
    patientUserId: actorUserId,
    hospitalId,
    requestType: 'lab_order',
    payload: { testCode, notes, priority },
    requestedBy: actorUserId,
  });

  await createAuditLog({
    actorUserId,
    action: 'integration.lab_order.created',
    entityType: 'integration_request',
    entityId: integrationRequest.id,
    metadata: integrationRequest.payload,
  });

  return integrationRequest;
};

const createPharmacyIntegrationRequest = async ({ actorUserId, hospitalId, prescriptionId, pharmacyCode, notes }) => {
  await assertFeatureEnabled(actorUserId, 'pharmacy.integration');

  const integrationRequest = await createIntegrationRequest({
    patientUserId: actorUserId,
    hospitalId,
    requestType: 'pharmacy_order',
    payload: { prescriptionId, pharmacyCode, notes },
    requestedBy: actorUserId,
  });

  await createAuditLog({
    actorUserId,
    action: 'integration.pharmacy_order.created',
    entityType: 'integration_request',
    entityId: integrationRequest.id,
    metadata: integrationRequest.payload,
  });

  return integrationRequest;
};

const listPatientIntegrationRequests = (patientUserId) => listIntegrationRequestsByPatient(patientUserId);

module.exports = {
  createLabIntegrationRequest,
  createPharmacyIntegrationRequest,
  listPatientIntegrationRequests,
};
