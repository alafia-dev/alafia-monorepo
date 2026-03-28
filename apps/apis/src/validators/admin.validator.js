const { z } = require('./common.validator');

const validateAuditLogQuery = z.object({
  limit: z.coerce.number().int().min(1).max(500).default(100),
}).partial().transform((value) => ({
  limit: value.limit ?? 100,
}));

const validateEmailTestBody = z.object({
  to: z.string().trim().email(),
}).strict();

module.exports = {
  validateAuditLogQuery,
  validateEmailTestBody,
};
