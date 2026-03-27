const asyncHandler = require('../utils/async-handler');
const ApiError = require('../utils/api-error');
const authService = require('../services/auth.service');
const { findUserByEmail, findUserByPhone } = require('../models/user.model');

const registerPatient = asyncHandler(async (req, res) => {
  const user = await authService.registerPatient(req.validatedBody);
  res.status(201).json({ ok: true, user });
});

const requestOtp = asyncHandler(async (req, res) => {
  const result = await authService.requestOtp(req.validatedBody);
  res.status(200).json({ ok: true, ...result });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { token, user } = await authService.verifyOtp(req.validatedBody);
  res.status(200).json({ ok: true, token, user });
});

const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, name, phone, email, password } = req.validatedBody;

  const [derivedFirstName = '', ...rest] = (name || '').trim().split(/\s+/).filter(Boolean);
  const derivedLastName = rest.join(' ').trim();

  const payload = {
    firstName: firstName || derivedFirstName || 'New',
    lastName: lastName || derivedLastName || 'User',
    phone,
    email,
  };

  const user = password
    ? await authService.registerWithPassword({ ...payload, password })
    : await authService.registerPatient(payload);

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: user.id,
      email: user.email,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validatedBody;
  const { token, user } = email && password
    ? await authService.loginWithPassword({ email, password })
    : await authService.verifyOtp(req.validatedBody);

  res.status(200).json({
    token,
    user: {
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      role: user.role,
    },
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email, phone } = req.validatedBody;
  let user = null;

  if (email) {
    user = await findUserByEmail(email);
  } else if (phone) {
    user = await findUserByPhone(phone);
  }

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  await authService.requestOtp({ phone: user.phone, purpose: 'password_reset' });
  res.status(200).json({ message: 'Reset code sent successfully' });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, phone, otp, newPassword } = req.validatedBody;
  let user = null;

  if (email) {
    user = await findUserByEmail(email);
  } else if (phone) {
    user = await findUserByPhone(phone);
  }

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  await authService.resetPasswordWithOtp({ phone: user.phone, otp, newPassword });
  res.status(200).json({ message: 'Password reset successfully' });
});

const verifyOtpCompat = asyncHandler(async (req, res) => {
  const { email, phone, otp, purpose } = req.validatedBody;
  let user = null;

  if (email) {
    user = await findUserByEmail(email);
  } else if (phone) {
    user = await findUserByPhone(phone);
  }

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  await authService.verifyOtp({ phone: user.phone, otp, purpose });
  res.status(200).json({ message: 'OTP verified successfully' });
});

const resendOtp = asyncHandler(async (req, res) => {
  const { email, phone, purpose } = req.validatedBody;
  let user = null;

  if (email) {
    user = await findUserByEmail(email);
  } else if (phone) {
    user = await findUserByPhone(phone);
  }

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  await authService.requestOtp({ phone: user.phone, purpose });
  res.status(200).json({ message: 'OTP resent successfully' });
});

module.exports = {
  forgotPassword,
  login,
  register,
  registerPatient,
  resendOtp,
  resetPassword,
  requestOtp,
  verifyOtpCompat,
  verifyOtp,
};
