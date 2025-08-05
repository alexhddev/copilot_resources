import { describe, it, expect } from 'vitest';
import {

add,
subtract,
multiply,
divide,
power,
sqrt,
factorial,
log,
asyncAdd,
} from './MathUtils';

describe('MathUtils', () => {
describe('add', () => {
    it('adds two positive numbers', () => {
        expect(add(2, 3)).toBe(5);
    });
    it('adds negative and positive numbers', () => {
        expect(add(-2, 3)).toBe(1);
    });
    it('adds zeros', () => {
        expect(add(0, 0)).toBe(0);
    });
});

describe('subtract', () => {
    it('subtracts two numbers', () => {
        expect(subtract(5, 3)).toBe(2);
    });
    it('subtracts resulting in negative', () => {
        expect(subtract(3, 5)).toBe(-2);
    });
});

describe('multiply', () => {
    it('multiplies two numbers', () => {
        expect(multiply(4, 5)).toBe(20);
    });
    it('multiplies by zero', () => {
        expect(multiply(7, 0)).toBe(0);
    });
    it('multiplies negative numbers', () => {
        expect(multiply(-2, 3)).toBe(-6);
    });
});

describe('divide', () => {
    it('divides two numbers', () => {
        expect(divide(10, 2)).toBe(5);
    });
    it('divides negative numbers', () => {
        expect(divide(-10, 2)).toBe(-5);
    });
    it('throws on division by zero', () => {
        expect(() => divide(5, 0)).toThrow('Division by zero');
    });
});

describe('power', () => {
    it('raises to a positive exponent', () => {
        expect(power(2, 3)).toBe(8);
    });
    it('raises to zero exponent', () => {
        expect(power(5, 0)).toBe(1);
    });
    it('raises to negative exponent', () => {
        expect(power(2, -2)).toBeCloseTo(0.25);
    });
});

describe('sqrt', () => {
    it('calculates square root of positive number', () => {
        expect(sqrt(9)).toBe(3);
    });
    it('calculates square root of zero', () => {
        expect(sqrt(0)).toBe(0);
    });
    it('throws on negative input', () => {
        expect(() => sqrt(-1)).toThrow('Square root of negative number');
    });
});

describe('factorial', () => {
    it('calculates factorial of 0', () => {
        expect(factorial(0)).toBe(1);
    });
    it('calculates factorial of 1', () => {
        expect(factorial(1)).toBe(1);
    });
    it('calculates factorial of positive integer', () => {
        expect(factorial(5)).toBe(120);
    });
    it('throws on negative input', () => {
        expect(() => factorial(-3)).toThrow('Factorial of negative number');
    });
});

describe('log', () => {
    it('calculates natural logarithm by default', () => {
        expect(log(Math.E)).toBeCloseTo(1);
    });
    it('calculates logarithm with custom base', () => {
        expect(log(8, 2)).toBeCloseTo(3);
    });
    it('throws on non-positive input', () => {
        expect(() => log(0)).toThrow('Logarithm of non-positive number');
        expect(() => log(-5)).toThrow('Logarithm of non-positive number');
    });
});

describe('asyncAdd', () => {
    it('adds two numbers asynchronously', async () => {
        const result = await asyncAdd(4, 5);
        expect(result).toBe(9);
    });
});
});