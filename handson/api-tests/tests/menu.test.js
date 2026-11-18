import { describe, it, expect } from 'vitest';
import { get } from './helpers/client.js';

describe('GET /api/daily-menu', () => {
  it('returns the daily menu', async () => {
    const { status, body } = await get('/api/daily-menu');

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  it('returns entries with name, description and imageUrl', async () => {
    const { body } = await get('/api/daily-menu');

    for (const entry of body.data) {
      expect(entry).toEqual({
        name: expect.any(String),
        description: expect.any(String),
        imageUrl: expect.any(String),
      });
    }
  });

  it('includes the Margherita Pizza', async () => {
    const { body } = await get('/api/daily-menu');

    expect(body.data.map((e) => e.name)).toContain('Margherita Pizza');
  });
});
