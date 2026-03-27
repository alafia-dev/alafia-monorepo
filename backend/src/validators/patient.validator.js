const { z, phoneSchema, optionalTrimmedString } = require('./common.validator');

const validatePatientProfileUpdate = z.object({
  dateOfBirth: z.string().date().optional(),
  gender: optionalTrimmedString,
  bloodGroup: optionalTrimmedString,
  emergencyContactName: optionalTrimmedString,
  emergencyContactPhone: phoneSchema.optional(),
  allergies: optionalTrimmedString,
  chronicConditions: optionalTrimmedString,
}).strict();

module.exports = {
  validatePatientProfileUpdate,
};
