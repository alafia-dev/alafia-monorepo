const { listAuditLogs } = require('../models/audit.model');
const { getEmailProviderStatus, sendAdminTestEmail } = require('./email.service');

const getAuditLogFeed = (limit) => listAuditLogs(limit);

const getEmailStatus = () => getEmailProviderStatus();

const sendEmailTest = async ({ to, requestedBy }) => {
  const delivery = await sendAdminTestEmail({ to, requestedBy });
  return {
    ...delivery,
    to,
  };
};

module.exports = {
  getAuditLogFeed,
  getEmailStatus,
  sendEmailTest,
};
