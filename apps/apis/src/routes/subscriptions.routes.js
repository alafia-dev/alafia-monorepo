const express = require('express');

const { getMySubscription, updateUserSubscriptionTier } = require('../controllers/subscription.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/rbac.middleware');
const validateRequest = require('../middleware/validate-request.middleware');
const { validateTierUpdate } = require('../validators/subscription.validator');

const router = express.Router();

router.get('/me', requireAuth, getMySubscription);
router.patch('/tier', requireAuth, requireRoles('admin'), validateRequest({ body: validateTierUpdate }), updateUserSubscriptionTier);

module.exports = router;
