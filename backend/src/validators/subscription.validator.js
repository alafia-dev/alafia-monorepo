const { z, uuidSchema, subscriptionTierSchema } = require('./common.validator');

const validateTierUpdate = z.object({
  userId: uuidSchema,
  tierName: subscriptionTierSchema,
}).strict();

module.exports = {
  validateTierUpdate,
};
