const express = require('express');

const {
  createHospitalHandler,
  inviteToHospital,
  acceptHospitalInvite,
  listMembers,
} = require('../controllers/hospital.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/rbac.middleware');
const validateRequest = require('../middleware/validate-request.middleware');
const {
  validateCreateHospital,
  validateInviteMember,
  validateHospitalParams,
  validateInviteTokenParams,
} = require('../validators/hospital.validator');

const router = express.Router();

router.post('/', requireAuth, requireRoles('admin'), validateRequest({ body: validateCreateHospital }), createHospitalHandler);
router.post('/:hospitalId/invites', requireAuth, requireRoles('admin'), validateRequest({ params: validateHospitalParams, body: validateInviteMember }), inviteToHospital);
router.post('/invites/:token/accept', validateRequest({ params: validateInviteTokenParams }), acceptHospitalInvite);
router.get('/:hospitalId/members', requireAuth, requireRoles('admin', 'doctor', 'nurse'), validateRequest({ params: validateHospitalParams }), listMembers);

module.exports = router;
