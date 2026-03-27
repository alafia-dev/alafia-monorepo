const express = require('express');

const { requireAuth } = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/rbac.middleware');
const validateRequest = require('../middleware/validate-request.middleware');
const {
  getDoctorPatients,
  addPatientDiagnosis,
  addPatientPrescription,
  createPatientLabOrder,
} = require('../controllers/dashboard.controller');
const {
  validatePatientIdParams,
  validateDiagnosis,
  validatePrescription,
  validatePatientLabOrder,
} = require('../validators/dashboard.validator');

const router = express.Router();

router.get('/patients', requireAuth, requireRoles('doctor', 'admin'), getDoctorPatients);
router.post(
  '/patients/:id/diagnosis',
  requireAuth,
  requireRoles('doctor', 'admin'),
  validateRequest({ params: validatePatientIdParams, body: validateDiagnosis }),
  addPatientDiagnosis
);
router.post(
  '/patients/:id/prescriptions',
  requireAuth,
  requireRoles('doctor', 'admin'),
  validateRequest({ params: validatePatientIdParams, body: validatePrescription }),
  addPatientPrescription
);
router.post(
  '/patients/:id/lab-orders',
  requireAuth,
  requireRoles('doctor', 'admin'),
  validateRequest({ params: validatePatientIdParams, body: validatePatientLabOrder }),
  createPatientLabOrder
);

module.exports = router;
