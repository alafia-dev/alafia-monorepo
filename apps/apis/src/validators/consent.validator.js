const { z, uuidSchema, trimmedString } = require('./common.validator');

const validateGrantConsent = z.object({
  granteeType: trimmedString,
  granteeId: trimmedString,
  scope: trimmedString,
  expiresAt: z.string().datetime().optional(),
}).strict();

const validateConsentParams = z.object({
  consentId: uuidSchema,
}).strict();

module.exports = {
  validateGrantConsent,
  validateConsentParams,
};
