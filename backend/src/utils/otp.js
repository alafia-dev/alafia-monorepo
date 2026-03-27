const crypto = require('crypto');

const OTP_LENGTH = 6;

const generateOtpCode = () => {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH - 1;
  return String(Math.floor(min + Math.random() * (max - min))).padStart(OTP_LENGTH, '0');
};

const hashOtp = (otp) => crypto.createHash('sha256').update(String(otp)).digest('hex');

module.exports = {
  generateOtpCode,
  hashOtp,
};
