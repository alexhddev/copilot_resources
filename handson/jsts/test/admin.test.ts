import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { Server } from 'http';
import type { AddressInfo } from 'net';
import app from '../src/api/server';

const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64');

describe('GET /api/admin', () => {
    let server: Server;
    let baseUrl: string;

    beforeAll(async () => {
        await new Promise<void>(resolve => {
            server = app.listen(0, resolve);
        });
        baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    });

    afterAll(async () => {
        await new Promise(resolve => server.close(resolve));
    });

    const getAdmin = (authorization?: string) =>
        fetch(`${baseUrl}/api/admin`, authorization ? { headers: { Authorization: authorization } } : undefined);

    it('returns 401 when no token is provided', async () => {
        const res = await getAdmin();

        expect(res.status).toBe(401);
        expect(await res.json()).toEqual({ success: false, error: 'Unauthorized', message: 'Token required' });
    });

    it('returns 401 for a non-Bearer header', async () => {
        const res = await getAdmin(`Basic ${encode({ role: 'admin' })}`);

        expect(res.status).toBe(401);
    });

    it('returns 401 when the payload is not JSON', async () => {
        const res = await getAdmin(`Bearer ${Buffer.from('not json').toString('base64')}`);

        expect(res.status).toBe(401);
        expect(await res.json()).toEqual({ success: false, error: 'Unauthorized', message: 'Invalid token format' });
    });

    it('returns 401 when the token is not base64', async () => {
        const res = await getAdmin('Bearer !!!');

        expect(res.status).toBe(401);
    });

    it.each([
        ['null', null],
        ['a number', 42],
        ['a string', 'admin']
    ])('returns 401 when the payload is %s', async (_label, payload) => {
        const res = await getAdmin(`Bearer ${encode(payload)}`);

        expect(res.status).toBe(401);
        expect(await res.json()).toEqual({ success: false, error: 'Unauthorized', message: 'Invalid token format' });
    });

    it('returns 403 for a non-admin role', async () => {
        const res = await getAdmin(`Bearer ${encode({ role: 'user' })}`);

        expect(res.status).toBe(403);
        expect(await res.json()).toEqual({ success: false, error: 'Forbidden', message: 'Not authorised' });
    });

    it('returns 403 when the payload has no role', async () => {
        const res = await getAdmin(`Bearer ${encode({})}`);

        expect(res.status).toBe(403);
    });

    it('returns 200 for the admin role', async () => {
        const res = await getAdmin(`Bearer ${encode({ role: 'admin' })}`);

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ success: true, message: 'Welcome, admin!' });
    });
});
