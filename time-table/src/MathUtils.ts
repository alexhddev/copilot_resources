/**
 * Returns the sum of two numbers.
 * @param a - The first operand.
 * @param b - The second operand.
 * @returns The sum of `a` and `b`.
 */
export function add(a: number, b: number): number {
    return a + b;
}

/**
 * Returns the difference of two numbers.
 * @param a - The minuend.
 * @param b - The subtrahend.
 * @returns The result of `a - b`.
 */
export function subtract(a: number, b: number): number {
    return a - b;
}

/**
 * Returns the product of two numbers.
 * @param a - The first factor.
 * @param b - The second factor.
 * @returns The result of `a * b`.
 */
export function multiply(a: number, b: number): number {
    return a * b;
}

/**
 * Divides one number by another.
 * @param a - The dividend.
 * @param b - The divisor.
 * @returns The result of `a / b`.
 * @throws {Error} If `b` is zero.
 */
export function divide(a: number, b: number): number {
    if (b === 0) throw new Error("Division by zero");
    return a / b;
}

/**
 * Raises a base number to the given exponent.
 * @param base - The base value.
 * @param exponent - The exponent to raise the base to.
 * @returns The result of `base ** exponent`.
 */
export function power(base: number, exponent: number): number {
    return Math.pow(base, exponent);
}

/**
 * Returns the square root of a number.
 * @param value - The number to compute the square root of. Must be non-negative.
 * @returns The square root of `value`.
 * @throws {Error} If `value` is negative.
 */
export function sqrt(value: number): number {
    if (value < 0) throw new Error("Square root of negative number");
    return Math.sqrt(value);
}

/**
 * Returns the factorial of a non-negative integer.
 * @param n - A non-negative integer.
 * @returns The factorial of `n` (i.e. `n!`).
 * @throws {Error} If `n` is negative.
 */
export function factorial(n: number): number {
    if (n < 0) throw new Error("Factorial of negative number");
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

/**
 * Asynchronously adds two numbers with a simulated 1-second delay.
 * @param a - The first operand.
 * @param b - The second operand.
 * @returns A promise that resolves to the sum of `a` and `b`.
 */
export async function asyncAdd(a: number, b: number): Promise<number> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(a + b);
        }, 1000); // Simulate a delay of 1 second
    });
}

