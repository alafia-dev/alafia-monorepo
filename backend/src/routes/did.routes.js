const express = require('express');

const { requireAuth } = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/rbac.middleware');
const { getMyDidWallet, connectDidWallet } = require('../controllers/did.controller');
const validateRequest = require('../middleware/validate-request.middleware');
const { validateDidConnection } = require('../validators/did.validator');

const router = express.Router();

router.get('/me', requireAuth, requireRoles('patient'), getMyDidWallet);
router.post('/connect', requireAuth, requireRoles('patient'), validateRequest({ body: validateDidConnection }), connectDidWallet);

module.exports = router;
