const asyncHandler = require('../utils/async-handler');
const adminService = require('../services/admin.service');

const getAuditLogs = asyncHandler(async (req, res) => {
  const logs = await adminService.getAuditLogFeed(req.validatedQuery.limit);
  res.status(200).json({ ok: true, logs });
});

const getEmailStatus = asyncHandler(async (req, res) => {
  const status = adminService.getEmailStatus();
  res.status(200).json({ ok: true, status });
});

const sendTestEmail = asyncHandler(async (req, res) => {
  const result = await adminService.sendEmailTest({
    to: req.validatedBody.to,
    requestedBy: req.auth.sub,
  });
  res.status(200).json({ ok: true, result });
});

module.exports = {
  getAuditLogs,
  getEmailStatus,
  sendTestEmail,
};
