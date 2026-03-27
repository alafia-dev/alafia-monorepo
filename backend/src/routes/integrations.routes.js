const express = require('express');

const { requireAuth } = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/rbac.middleware');
const {
  createLabOrder,
  createPharmacyOrder,
  listMyIntegrationRequests,
} = require('../controllers/integration.controller');
const validateRequest = require('../middleware/validate-request.middleware');
const { validateLabOrder, validatePharmacyOrder } = require('../validators/integration.validator');

const router = express.Router();

router.get('/me', requireAuth, requireRoles('patient'), listMyIntegrationRequests);
router.post('/labs/order', requireAuth, requireRoles('doctor', 'nurse', 'admin', 'patient'), validateRequest({ body: validateLabOrder }), createLabOrder);
router.post('/pharmacy/order', requireAuth, requireRoles('doctor', 'nurse', 'admin', 'patient'), validateRequest({ body: validatePharmacyOrder }), createPharmacyOrder);

module.exports = router;
