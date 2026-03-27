const { z } = require('zod');
const { normalizePhone } = require('../utils/normalize-phone');

const phoneSchema = z.preprocess(
  (value) => normalizePhone(typeof value === 'string' ? value.trim() : value),
  z.string().regex(/^\+[1-9]\d{9,14}$/, 'Phone must be in international format')
);
const uuidSchema = z.string().uuid('Must be a valid UUID');
const roleSchema = z.enum(['doctor', 'nurse', 'admin', 'patient']);
const subscriptionTierSchema = z.enum(['free', 'basic', 'premium', 'enterprise']);
const trimmedString = z.string().trim().min(1, 'Field cannot be empty');
const optionalTrimmedString = z.string().trim().min(1).optional();

module.exports = {
  z,
  phoneSchema,
  uuidSchema,
  roleSchema,
  subscriptionTierSchema,
  trimmedString,
  optionalTrimmedString,
};
