const express = require('express');

const { requireAuth } = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/rbac.middleware');
const { getAuditLogs, getEmailStatus, sendTestEmail } = require('../controllers/admin.controller');
const { getAdminStaff, getAdminOnboarding } = require('../controllers/dashboard.controller');
const validateRequest = require('../middleware/validate-request.middleware');
const { validateAuditLogQuery, validateEmailTestBody } = require('../validators/admin.validator');

const router = express.Router();

router.get('/audit-logs', requireAuth, requireRoles('admin'), validateRequest({ query: validateAuditLogQuery }), getAuditLogs);
router.get('/email/status', requireAuth, requireRoles('admin'), getEmailStatus);
router.post('/email/test', requireAuth, requireRoles('admin'), validateRequest({ body: validateEmailTestBody }), sendTestEmail);
router.get('/staff', requireAuth, requireRoles('admin'), getAdminStaff);
router.get('/onboarding', requireAuth, requireRoles('admin'), getAdminOnboarding);

module.exports = router;
