const { z, uuidSchema, phoneSchema, roleSchema, trimmedString, optionalTrimmedString } = require('./common.validator');

const validateCreateHospital = z.object({
  name: trimmedString,
  code: trimmedString,
  address: optionalTrimmedString,
}).strict();

const validateInviteMember = z.object({
  phone: phoneSchema,
  email: z.string().trim().email().optional(),
  role: roleSchema,
}).strict();

const validateHospitalParams = z.object({
  hospitalId: uuidSchema,
}).strict();

const validateInviteTokenParams = z.object({
  token: z.string().trim().min(10),
}).strict();

module.exports = {
  validateCreateHospital,
  validateInviteMember,
  validateHospitalParams,
  validateInviteTokenParams,
};
