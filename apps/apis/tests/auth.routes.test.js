const request = require('supertest');

jest.mock('../src/controllers/auth.controller', () => ({
  forgotPassword: (req, res) => res.status(200).json({ ok: true, payload: req.validatedBody }),
  login: (req, res) => res.status(200).json({ ok: true, payload: req.validatedBody }),
  register: (req, res) => res.status(201).json({ ok: true, payload: req.validatedBody }),
  registerPatient: (req, res) => res.status(201).json({ ok: true, payload: req.validatedBody }),
  resendOtp: (req, res) => res.status(200).json({ ok: true, payload: req.validatedBody }),
  resetPassword: (req, res) => res.status(200).json({ ok: true, payload: req.validatedBody }),
  requestOtp: (req, res) => res.status(200).json({ ok: true, payload: req.validatedBody }),
  verifyOtpCompat: (req, res) => res.status(200).json({ ok: true, payload: req.validatedBody }),
  verifyOtp: (req, res) => res.status(200).json({ ok: true, payload: req.validatedBody }),
}));

const app = require('../src/app');

describe('auth routes validation', () => {
  test('normalizes local Nigerian phone numbers on patient registration', async () => {
    const response = await request(app)
      .post('/api/auth/register/patient')
      .send({
        firstName: 'Ada',
        lastName: 'Okafor',
        phone: '0803 123 4567',
        email: 'ada@example.com',
      });

    expect(response.status).toBe(201);
    expect(response.body.payload.phone).toBe('+2348031234567');
  });

  test('rejects invalid OTP payloads before controller execution', async () => {
    const response = await request(app)
      .post('/api/auth/otp/verify')
      .send({
        phone: 'bad-phone',
        otp: 'abc',
      });

    expect(response.status).toBe(400);
    expect(response.body.ok).toBe(false);
    expect(response.body.details.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'phone' }),
        expect.objectContaining({ path: 'otp' }),
      ])
    );
  });

  test('accepts email and password payload for compatibility login endpoint', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'ada@example.com',
        password: 'strongPass123',
      });

    expect(response.status).toBe(200);
    expect(response.body.payload).toEqual(
      expect.objectContaining({
        email: 'ada@example.com',
        password: 'strongPass123',
      })
    );
  });

  test('rejects reset-password payload when newPassword is missing', async () => {
    const response = await request(app)
      .post('/api/auth/reset-password')
      .send({
        email: 'ada@example.com',
        otp: '123456',
      });

    expect(response.status).toBe(400);
    expect(response.body.ok).toBe(false);
    expect(response.body.details.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'newPassword' }),
      ])
    );
  });
});
