const request = require('supertest');

const mockVerifyAccessToken = jest.fn();

jest.mock('../src/utils/token', () => ({
  verifyAccessToken: mockVerifyAccessToken,
}));

jest.mock('../src/controllers/hospital.controller', () => ({
  createHospitalHandler: (req, res) => res.status(201).json({ ok: true, payload: req.validatedBody }),
  inviteToHospital: (req, res) => res.status(201).json({ ok: true, payload: { ...req.validatedParams, ...req.validatedBody } }),
  acceptHospitalInvite: (req, res) => res.status(200).json({ ok: true, payload: req.validatedParams }),
  listMembers: (req, res) => res.status(200).json({ ok: true, payload: req.validatedParams }),
}));

const app = require('../src/app');

describe('hospital routes auth and validation', () => {
  beforeEach(() => {
    mockVerifyAccessToken.mockReset();
  });

  test('rejects invite creation when bearer token is missing', async () => {
    const response = await request(app)
      .post('/api/hospitals/550e8400-e29b-41d4-a716-446655440000/invites')
      .send({
        phone: '08031234567',
        email: 'doctor@example.com',
        role: 'doctor',
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/missing bearer token/i);
  });

  test('rejects invite creation when authenticated user is not admin', async () => {
    mockVerifyAccessToken.mockReturnValue({ sub: 'user-1', role: 'patient' });

    const response = await request(app)
      .post('/api/hospitals/550e8400-e29b-41d4-a716-446655440000/invites')
      .set('Authorization', 'Bearer token')
      .send({
        phone: '08031234567',
        email: 'doctor@example.com',
        role: 'doctor',
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toMatch(/forbidden/i);
  });

  test('accepts valid admin invite payload and normalizes phone', async () => {
    mockVerifyAccessToken.mockReturnValue({ sub: 'user-1', role: 'admin' });

    const response = await request(app)
      .post('/api/hospitals/550e8400-e29b-41d4-a716-446655440000/invites')
      .set('Authorization', 'Bearer token')
      .send({
        phone: '08031234567',
        email: 'doctor@example.com',
        role: 'doctor',
      });

    expect(response.status).toBe(201);
    expect(response.body.payload.hospitalId).toBe('550e8400-e29b-41d4-a716-446655440000');
    expect(response.body.payload.phone).toBe('+2348031234567');
  });
});
