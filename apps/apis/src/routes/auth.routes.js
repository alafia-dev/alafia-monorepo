const express = require('express');

const {
	registerPatient,
	requestOtp,
	verifyOtp,
	register,
	login,
	forgotPassword,
	resetPassword,
	verifyOtpCompat,
	resendOtp,
} = require('../controllers/auth.controller');
const validateRequest = require('../middleware/validate-request.middleware');
const {
	validatePatientRegistration,
	validateOtpRequest,
	validateOtpVerification,
	validateRegister,
	validateLogin,
	validateForgotPassword,
	validateResetPassword,
	validateVerifyOtp,
	validateResendOtp,
} = require('../validators/auth.validator');

const router = express.Router();

router.post('/register/patient', validateRequest({ body: validatePatientRegistration }), registerPatient);
router.post('/otp/request', validateRequest({ body: validateOtpRequest }), requestOtp);
router.post('/otp/verify', validateRequest({ body: validateOtpVerification }), verifyOtp);

router.post('/register', validateRequest({ body: validateRegister }), register);
router.post('/login', validateRequest({ body: validateLogin }), login);
router.post('/forgot-password', validateRequest({ body: validateForgotPassword }), forgotPassword);
router.post('/reset-password', validateRequest({ body: validateResetPassword }), resetPassword);
router.post('/verify-otp', validateRequest({ body: validateVerifyOtp }), verifyOtpCompat);
router.post('/resend-otp', validateRequest({ body: validateResendOtp }), resendOtp);

module.exports = router;
