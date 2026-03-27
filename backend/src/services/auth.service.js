const bcrypt = require('bcryptjs');
const ApiError = require('../utils/api-error');
const { generateOtpCode, hashOtp } = require('../utils/otp');
const { signAccessToken } = require('../utils/token');
const { createOtpRecord, getActiveOtpByPhone, consumeOtp } = require('../models/otp.model');
const {
  createUser,
  findUserAuthByEmail,
  findUserByEmail,
  findUserByPhone,
  setUserPasswordHash,
  touchLastLogin,
} = require('../models/user.model');
const { sendWelcomeEmail } = require('./email.service');

const verifyOtpRecord = async ({ phone, otp, purpose }) => {
  const otpRecord = await getActiveOtpByPhone({ phone, purpose });
  if (!otpRecord) {
    throw new ApiError(401, 'No active OTP found');
  }

  if (new Date(otpRecord.expires_at).getTime() < Date.now()) {
    throw new ApiError(401, 'OTP expired');
  }

  if (otpRecord.otp_hash !== hashOtp(otp)) {
    throw new ApiError(401, 'Invalid OTP');
  }

  await consumeOtp(otpRecord.id);
};

const registerPatient = async ({ firstName, lastName, phone, email }) => {
  const existing = await findUserByPhone(phone);
  if (existing) {
    throw new ApiError(409, 'Phone already registered');
  }

  const user = await createUser({ firstName, lastName, phone, email, role: 'patient' });

  let emailDelivery = null;
  if (user.email) {
    emailDelivery = await sendWelcomeEmail({
      to: user.email,
      firstName: user.first_name,
    });
  }

  return {
    ...user,
    emailDelivery,
  };
};

const registerWithPassword = async ({ firstName, lastName, phone, email, password }) => {
  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  const existingPhone = await findUserByPhone(phone);
  if (existingPhone) {
    throw new ApiError(409, 'Phone already registered');
  }

  const existingEmail = await findUserByEmail(email);
  if (existingEmail) {
    throw new ApiError(409, 'Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await createUser({ firstName, lastName, phone, email, passwordHash, role: 'patient' });

  const emailDelivery = await sendWelcomeEmail({
    to: user.email,
    firstName: user.first_name,
  });

  return {
    ...user,
    emailDelivery,
  };
};

const requestOtp = async ({ phone, purpose = 'login' }) => {
  const user = await findUserByPhone(phone);
  if (!user) {
    throw new ApiError(404, 'User not found. Register first.');
  }

  const otp = generateOtpCode();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await createOtpRecord({ phone, otpHash: hashOtp(otp), purpose, expiresAt });

  return {
    message: 'OTP generated',
    otp,
    expiresAt,
  };
};

const verifyOtp = async ({ phone, otp, purpose = 'login' }) => {
  await verifyOtpRecord({ phone, otp, purpose });

  const user = await findUserByPhone(phone);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  await touchLastLogin(user.id);

  const token = signAccessToken({ sub: user.id, role: user.role, phone: user.phone });
  return { token, user };
};

const loginWithPassword = async ({ email, password }) => {
  const user = await findUserAuthByEmail(email);
  if (!user || !user.password_hash) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    throw new ApiError(401, 'Invalid email or password');
  }

  await touchLastLogin(user.id);

  const token = signAccessToken({ sub: user.id, role: user.role, phone: user.phone });
  return {
    token,
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      created_at: user.created_at,
    },
  };
};

const resetPasswordWithOtp = async ({ phone, otp, newPassword }) => {
  await verifyOtpRecord({ phone, otp, purpose: 'password_reset' });

  const user = await findUserByPhone(phone);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await setUserPasswordHash(user.id, passwordHash);
};

module.exports = {
  loginWithPassword,
  registerPatient,
  registerWithPassword,
  resetPasswordWithOtp,
  requestOtp,
  verifyOtp,
};
