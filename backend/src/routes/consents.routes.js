const express = require('express');

const { requireAuth } = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/rbac.middleware');
const { listMyConsents, grantConsent, revokeMyConsent } = require('../controllers/consent.controller');
const validateRequest = require('../middleware/validate-request.middleware');
const { validateGrantConsent, validateConsentParams } = require('../validators/consent.validator');

const router = express.Router();

router.get('/me', requireAuth, requireRoles('patient'), listMyConsents);
router.post('/grant', requireAuth, requireRoles('patient'), validateRequest({ body: validateGrantConsent }), grantConsent);
router.patch('/:consentId/revoke', requireAuth, requireRoles('patient'), validateRequest({ params: validateConsentParams }), revokeMyConsent);

module.exports = router;
