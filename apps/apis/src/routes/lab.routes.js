const express = require('express');

const { requireAuth } = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/rbac.middleware');
const validateRequest = require('../middleware/validate-request.middleware');
const {
  getLabOrders,
  updateLabOrderStatus,
  submitLabResults,
} = require('../controllers/dashboard.controller');
const {
  validateLabOrderIdParams,
  validateLabOrderStatusUpdate,
  validateLabResultsSubmission,
} = require('../validators/dashboard.validator');

const router = express.Router();

router.get('/orders', requireAuth, requireRoles('nurse', 'doctor', 'admin'), getLabOrders);
router.put(
  '/orders/:id/status',
  requireAuth,
  requireRoles('nurse', 'doctor', 'admin'),
  validateRequest({ params: validateLabOrderIdParams, body: validateLabOrderStatusUpdate }),
  updateLabOrderStatus
);
router.post(
  '/orders/:id/results',
  requireAuth,
  requireRoles('nurse', 'doctor', 'admin'),
  validateRequest({ params: validateLabOrderIdParams, body: validateLabResultsSubmission }),
  submitLabResults
);

module.exports = router;
