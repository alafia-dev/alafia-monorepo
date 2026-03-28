const { z, phoneSchema, trimmedString } = require('./common.validator');

const validatePatientRegistration = z.object({
  firstName: trimmedString,
  lastName: trimmedString,
  phone: phoneSchema,
  email: z.string().trim().email().optional(),
}).strict();

const validateOtpRequest = z.object({
  phone: phoneSchema,
  purpose: z.string().trim().default('login'),
}).strict();

const validateOtpVerification = z.object({
  phone: phoneSchema,
  otp: z.string().trim().regex(/^\d{4,8}$/, 'OTP must be 4 to 8 digits'),
  purpose: z.string().trim().default('login'),
}).strict();

const validateRegister = z.object({
  firstName: trimmedString.optional(),
  lastName: trimmedString.optional(),
  name: trimmedString.optional(),
  phone: phoneSchema,
  email: z.string().trim().email().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
}).strict();

const validateLogin = z.union([
  z.object({
    email: z.string().trim().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }).strict(),
  z.object({
    phone: phoneSchema,
    otp: z.string().trim().regex(/^\d{4,8}$/, 'OTP must be 4 to 8 digits'),
    purpose: z.string().trim().default('login'),
  }).strict(),
]);

const validateForgotPassword = z.object({
  email: z.string().trim().email().optional(),
  phone: phoneSchema.optional(),
}).refine((data) => Boolean(data.email || data.phone), {
  message: 'Provide email or phone',
  path: ['email'],
});

const validateResetPassword = z.object({
  email: z.string().trim().email().optional(),
  phone: phoneSchema.optional(),
  otp: z.string().trim().regex(/^\d{4,8}$/, 'OTP must be 4 to 8 digits'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => Boolean(data.email || data.phone), {
  message: 'Provide email or phone',
  path: ['email'],
});

const validateVerifyOtp = z.object({
  email: z.string().trim().email().optional(),
  phone: phoneSchema.optional(),
  otp: z.string().trim().regex(/^\d{4,8}$/, 'OTP must be 4 to 8 digits'),
  purpose: z.string().trim().default('login'),
}).refine((data) => Boolean(data.email || data.phone), {
  message: 'Provide email or phone',
  path: ['email'],
});

const validateResendOtp = z.object({
  email: z.string().trim().email().optional(),
  phone: phoneSchema.optional(),
  purpose: z.string().trim().default('login'),
}).refine((data) => Boolean(data.email || data.phone), {
  message: 'Provide email or phone',
  path: ['email'],
});

module.exports = {
  validatePatientRegistration,
  validateOtpRequest,
  validateOtpVerification,
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateVerifyOtp,
  validateResendOtp,
};
