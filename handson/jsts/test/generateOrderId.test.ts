import { describe, it, expect, vi, afterEach } from 'vitest';
import { generateOrderId } from '../src/api/database';

describe('generateOrderId', () => {
    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('matches the order-<timestamp>-<number> format', () => {
        expect(generateOrderId()).toMatch(/^order-\d+-\d{1,3}$/);
    });

    it('uses the current timestamp and a random suffix', () => {
        vi.useFakeTimers();
        vi.setSystemTime(1700000000000);
        vi.spyOn(Math, 'random').mockReturnValue(0.123);

        expect(generateOrderId()).toBe('order-1700000000000-123');
    });

    it('generates different IDs across time', () => {
        vi.useFakeTimers();
        vi.spyOn(Math, 'random').mockReturnValue(0.5);

        vi.setSystemTime(1000);
        const first = generateOrderId();
        vi.setSystemTime(2000);

        expect(generateOrderId()).not.toBe(first);
    });
});
