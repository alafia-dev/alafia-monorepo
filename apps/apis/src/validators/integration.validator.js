const { z, uuidSchema, trimmedString, optionalTrimmedString } = require('./common.validator');

const validateLabOrder = z.object({
  hospitalId: uuidSchema,
  testCode: trimmedString,
  notes: optionalTrimmedString,
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
}).strict();

const validatePharmacyOrder = z.object({
  hospitalId: uuidSchema,
  prescriptionId: trimmedString,
  pharmacyCode: trimmedString,
  notes: optionalTrimmedString,
}).strict();

module.exports = {
  validateLabOrder,
  validatePharmacyOrder,
};
