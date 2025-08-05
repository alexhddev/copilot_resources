import { describe, it, expect } from 'vitest';
import {
    startOfDay,
    endOfDay,
    addDays,
    isSameDay,
    formatDate,
} from './DateUtils';

describe('DateUtils', () => {
    describe('startOfDay', () => {
        it('sets time to midnight for a given date', () => {
            const date = new Date('2023-05-15T14:30:45.123Z');
            const result = startOfDay(date);
            
            expect(result.getUTCHours()).toBe(0);
            expect(result.getUTCMinutes()).toBe(0);
            expect(result.getUTCSeconds()).toBe(0);
            expect(result.getUTCMilliseconds()).toBe(0);
            expect(result.getUTCDate()).toBe(date.getUTCDate());
            expect(result.getUTCMonth()).toBe(date.getUTCMonth());
            expect(result.getUTCFullYear()).toBe(date.getUTCFullYear());
        });

        it('does not modify the original date', () => {
            const originalDate = new Date('2023-05-15T14:30:45.123Z');
            const originalTime = originalDate.getTime();
            
            startOfDay(originalDate);
            
            expect(originalDate.getTime()).toBe(originalTime);
        });

        it('handles edge cases like end of month', () => {
            const date = new Date('2023-01-31T23:59:59.999Z');
            const result = startOfDay(date);
            
            expect(result.getUTCHours()).toBe(0);
            expect(result.getUTCMinutes()).toBe(0);
            expect(result.getUTCSeconds()).toBe(0);
            expect(result.getUTCMilliseconds()).toBe(0);
            expect(result.getUTCDate()).toBe(31);
            expect(result.getUTCMonth()).toBe(0); // January
        });
    });

    describe('endOfDay', () => {
        it('sets time to end of day for a given date', () => {
            const date = new Date('2023-05-15T14:30:45.123Z');
            const result = endOfDay(date);
            
            expect(result.getUTCHours()).toBe(23);
            expect(result.getUTCMinutes()).toBe(59);
            expect(result.getUTCSeconds()).toBe(59);
            expect(result.getUTCMilliseconds()).toBe(999);
            expect(result.getUTCDate()).toBe(date.getUTCDate());
            expect(result.getUTCMonth()).toBe(date.getUTCMonth());
            expect(result.getUTCFullYear()).toBe(date.getUTCFullYear());
        });

        it('does not modify the original date', () => {
            const originalDate = new Date('2023-05-15T14:30:45.123Z');
            const originalTime = originalDate.getTime();
            
            endOfDay(originalDate);
            
            expect(originalDate.getTime()).toBe(originalTime);
        });

        it('handles midnight input correctly', () => {
            const date = new Date('2023-05-15T00:00:00.000Z');
            const result = endOfDay(date);
            
            expect(result.getUTCHours()).toBe(23);
            expect(result.getUTCMinutes()).toBe(59);
            expect(result.getUTCSeconds()).toBe(59);
            expect(result.getUTCMilliseconds()).toBe(999);
            expect(result.getUTCDate()).toBe(15);
        });
    });

    describe('addDays', () => {
        it('adds positive number of days', () => {
            const date = new Date('2023-05-15T14:30:45.123Z');
            const result = addDays(date, 5);
            
            expect(result.getUTCDate()).toBe(20);
            expect(result.getUTCMonth()).toBe(4); // May (0-indexed)
            expect(result.getUTCFullYear()).toBe(2023);
            expect(result.getUTCHours()).toBe(date.getUTCHours());
            expect(result.getUTCMinutes()).toBe(date.getUTCMinutes());
        });

        it('adds negative number of days (subtracts)', () => {
            const date = new Date('2023-05-15T14:30:45.123Z');
            const result = addDays(date, -5);
            
            expect(result.getUTCDate()).toBe(10);
            expect(result.getUTCMonth()).toBe(4); // May
            expect(result.getUTCFullYear()).toBe(2023);
        });

        it('handles month boundary crossing', () => {
            const date = new Date('2023-01-30T12:00:00.000Z');
            const result = addDays(date, 5);
            
            expect(result.getUTCDate()).toBe(4);
            expect(result.getUTCMonth()).toBe(1); // February
            expect(result.getUTCFullYear()).toBe(2023);
        });

        it('handles year boundary crossing', () => {
            const date = new Date('2023-12-30T12:00:00.000Z');
            const result = addDays(date, 5);
            
            expect(result.getUTCDate()).toBe(4);
            expect(result.getUTCMonth()).toBe(0); // January
            expect(result.getUTCFullYear()).toBe(2024);
        });

        it('handles leap year correctly', () => {
            const date = new Date('2024-02-28T12:00:00.000Z');
            const result = addDays(date, 1);
            
            expect(result.getUTCDate()).toBe(29);
            expect(result.getUTCMonth()).toBe(1); // February
            expect(result.getUTCFullYear()).toBe(2024);
        });

        it('adds zero days (returns same date)', () => {
            const date = new Date('2023-05-15T14:30:45.123Z');
            const result = addDays(date, 0);
            
            expect(result.getTime()).toBe(date.getTime());
        });

        it('does not modify the original date', () => {
            const originalDate = new Date('2023-05-15T14:30:45.123Z');
            const originalTime = originalDate.getTime();
            
            addDays(originalDate, 5);
            
            expect(originalDate.getTime()).toBe(originalTime);
        });
    });

    describe('isSameDay', () => {
        it('returns true for same date and time', () => {
            const date1 = new Date('2023-05-15T14:30:45.123Z');
            const date2 = new Date('2023-05-15T14:30:45.123Z');
            
            expect(isSameDay(date1, date2)).toBe(true);
        });

        it('returns true for same date but different times', () => {
            const date1 = new Date('2023-05-15T09:15:30.000Z');
            const date2 = new Date('2023-05-15T23:45:59.999Z');
            
            expect(isSameDay(date1, date2)).toBe(true);
        });

        it('returns false for different dates', () => {
            const date1 = new Date('2023-05-15T14:30:45.123Z');
            const date2 = new Date('2023-05-16T14:30:45.123Z');
            
            expect(isSameDay(date1, date2)).toBe(false);
        });

        it('returns false for different months', () => {
            const date1 = new Date('2023-05-15T14:30:45.123Z');
            const date2 = new Date('2023-06-15T14:30:45.123Z');
            
            expect(isSameDay(date1, date2)).toBe(false);
        });

        it('returns false for different years', () => {
            const date1 = new Date('2023-05-15T14:30:45.123Z');
            const date2 = new Date('2024-05-15T14:30:45.123Z');
            
            expect(isSameDay(date1, date2)).toBe(false);
        });

        it('handles edge case of last day of month vs first day of next month', () => {
            const date1 = new Date('2023-04-30T23:59:59.999Z');
            const date2 = new Date('2023-05-01T00:00:00.000Z');
            
            expect(isSameDay(date1, date2)).toBe(false);
        });

        it('handles midnight boundary correctly', () => {
            const date1 = new Date('2023-05-15T23:59:59.999Z');
            const date2 = new Date('2023-05-15T00:00:00.000Z');
            
            expect(isSameDay(date1, date2)).toBe(true);
        });
    });

    describe('formatDate', () => {
        it('formats a standard date correctly', () => {
            const date = new Date('2023-05-15T14:30:45.123Z');
            const result = formatDate(date);
            
            expect(result).toBe('2023-05-15');
        });

        it('pads single-digit months with zero', () => {
            const date = new Date('2023-01-05T14:30:45.123Z');
            const result = formatDate(date);
            
            expect(result).toBe('2023-01-05');
        });

        it('pads single-digit days with zero', () => {
            const date = new Date('2023-12-05T14:30:45.123Z');
            const result = formatDate(date);
            
            expect(result).toBe('2023-12-05');
        });

        it('handles first day of year', () => {
            const date = new Date('2023-01-01T00:00:00.000Z');
            const result = formatDate(date);
            
            expect(result).toBe('2023-01-01');
        });

        it('handles last day of year', () => {
            const date = new Date('2023-12-31T23:59:59.999Z');
            const result = formatDate(date);
            
            expect(result).toBe('2023-12-31');
        });

        it('handles leap year date', () => {
            const date = new Date('2024-02-29T12:00:00.000Z');
            const result = formatDate(date);
            
            expect(result).toBe('2024-02-29');
        });

        it('ignores time component', () => {
            const date1 = new Date('2023-05-15T00:00:00.000Z');
            const date2 = new Date('2023-05-15T23:59:59.999Z');
            
            expect(formatDate(date1)).toBe('2023-05-15');
            expect(formatDate(date2)).toBe('2023-05-15');
        });
    });
});
