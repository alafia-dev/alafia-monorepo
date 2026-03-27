const express = require('express');

const { getMyPatientProfile, updateMyPatientProfile } = require('../controllers/patient.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/rbac.middleware');
const validateRequest = require('../middleware/validate-request.middleware');
const { validatePatientProfileUpdate } = require('../validators/patient.validator');

const router = express.Router();

router.get('/me/profile', requireAuth, requireRoles('patient'), getMyPatientProfile);
router.patch('/me/profile', requireAuth, requireRoles('patient'), validateRequest({ body: validatePatientProfileUpdate }), updateMyPatientProfile);

module.exports = router;
