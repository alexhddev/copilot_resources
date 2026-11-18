import { describe, it, expect, beforeAll } from 'vitest';
import { get, post, loginAsUser } from './helpers/client.js';

const toToken = (payload) => Buffer.from(JSON.stringify(payload)).toString('base64');

describe('POST /api/login', () => {
  it('returns a token for valid credentials', async () => {
    const { status, body } = await post('/api/login', { username: 'user', password: 'pass' });

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.token).toEqual(expect.any(String));
  });

  it.each([
    ['wrong password', { username: 'user', password: 'wrong' }],
    ['unknown user', { username: 'nobody', password: 'pass' }],
    ['missing credentials', {}],
  ])('rejects %s with 401', async (_label, payload) => {
    const { status, body } = await post('/api/login', payload);

    expect(status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error).toBe('Invalid credentials');
  });
});

describe('GET /api/protected', () => {
  let token;

  beforeAll(async () => {
    token = await loginAsUser();
  });

  it('grants access with a valid token', async () => {
    const { status, body } = await get('/api/protected', { token });

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.secretRecipes).toEqual(expect.any(Array));
    expect(body.data.staffDiscount).toEqual(expect.any(String));
    expect(body.data.vipCode).toEqual(expect.any(String));
    expect(body.data.deliveryNote).toEqual(expect.any(String));
  });

  it('returns 401 without a token', async () => {
    const { status, body } = await get('/api/protected');

    expect(status).toBe(401);
    expect(body.success).toBe(false);
  });

  it('returns 401 with an invalid token', async () => {
    const { status } = await get('/api/protected', { token: 'invalid-token' });

    expect(status).toBe(401);
  });

  it('returns 401 for a non-Bearer authorization scheme', async () => {
    const { status } = await get('/api/protected', { headers: { Authorization: `Basic ${token}` } });

    expect(status).toBe(401);
  });
});

describe('GET /api/admin', () => {
  it('welcomes an admin token', async () => {
    const token = await loginAsUser();
    const { status, body } = await get('/api/admin', { token });

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Welcome, admin!');
  });

  it('returns 401 without a token', async () => {
    const { status, body } = await get('/api/admin');

    expect(status).toBe(401);
    expect(body.success).toBe(false);
  });

  it('returns 401 for a token that is not valid base64 JSON', async () => {
    const { status } = await get('/api/admin', { token: 'not-json' });

    expect(status).toBe(401);
  });

  it('returns 403 for a non-admin role', async () => {
    const { status, body } = await get('/api/admin', { token: toToken({ role: 'customer' }) });

    expect(status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.error).toBe('Forbidden');
  });
});
