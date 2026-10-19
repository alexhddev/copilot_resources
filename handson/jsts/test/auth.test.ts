import { describe, it, expect, vi } from 'vitest';
import type { Request, Response } from 'express';
import { extractBearerToken, requireToken, HARDCODED_TOKEN } from '../src/api/server';

const fakeRequest = (authorization?: string): Request =>
    ({ headers: authorization === undefined ? {} : { authorization } }) as unknown as Request;

const fakeResponse = () => {
    const res = { status: vi.fn(), json: vi.fn() };
    res.status.mockReturnValue(res);
    return res;
};

describe('extractBearerToken', () => {
    it('returns the token from a Bearer header', () => {
        expect(extractBearerToken(fakeRequest('Bearer abc123'))).toBe('abc123');
    });

    it('returns null when the header is missing', () => {
        expect(extractBearerToken(fakeRequest())).toBeNull();
    });

    it('returns null for a non-Bearer scheme', () => {
        expect(extractBearerToken(fakeRequest('Basic abc123'))).toBeNull();
    });

    it('returns null when the scheme is lowercase', () => {
        expect(extractBearerToken(fakeRequest('bearer abc123'))).toBeNull();
    });

    it('returns an empty string for "Bearer " with no token', () => {
        expect(extractBearerToken(fakeRequest('Bearer '))).toBe('');
    });
});

describe('requireToken', () => {
    const expectUnauthorized = (authorization?: string) => {
        const res = fakeResponse();
        const next = vi.fn();

        requireToken(fakeRequest(authorization), res as unknown as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: 'Unauthorized',
            message: 'Valid token required'
        });
    };

    it('calls next for the correct token', () => {
        const res = fakeResponse();
        const next = vi.fn();

        requireToken(fakeRequest(`Bearer ${HARDCODED_TOKEN}`), res as unknown as Response, next);

        expect(next).toHaveBeenCalledOnce();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('rejects a missing header', () => expectUnauthorized());
    it('rejects a wrong scheme', () => expectUnauthorized(`Basic ${HARDCODED_TOKEN}`));
    it('rejects a wrong token', () => expectUnauthorized('Bearer wrong-token'));
    it('rejects an empty token', () => expectUnauthorized('Bearer '));
});
