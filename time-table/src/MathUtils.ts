/**
 * Adds two numbers and returns the result.
 *
 * @param a - The first number to add.
 * @param b - The second number to add.
 * @returns The sum of a and b.
 */
export function add(a: number, b: number): number {
    return a + b;
}

/**
 * Subtracts the second number from the first and returns the result.
 *
 * @param a - The number from which to subtract.
 * @param b - The number to subtract.
 * @returns The result of a minus b.
 */
export function subtract(a: number, b: number): number {
    return a - b;
}

/**
 * Multiplies two numbers and returns the result.
 *
 * @param a - The first number to multiply.
 * @param b - The second number to multiply.
 * @returns The product of a and b.
 */
export function multiply(a: number, b: number): number {
    return a * b;
}

/**
 * Divides two numbers and returns the result.
 *
 * @param a - The dividend.
 * @param b - The divisor. Must not be zero.
 * @returns The result of dividing `a` by `b`.
 * @throws {Error} Throws an error if `b` is zero.
 */
export function divide(a: number, b: number): number {
    if (b === 0) throw new Error("Division by zero");
    return a / b;
}

// Advanced Math Operations
/**
 * Raises a base to the power of exponent and returns the result.
 *
 * @param base - The base number.
 * @param exponent - The exponent to raise the base to.
 * @returns The result of base raised to the power of exponent.
 */
export function power(base: number, exponent: number): number {
    return Math.pow(base, exponent);
}

/**
 * Calculates the square root of a number.
 *
 * @param value - The number to calculate the square root of. Must be non-negative.
 * @returns The square root of the value.
 * @throws {Error} Throws an error if value is negative.
 */
export function sqrt(value: number): number {
    if (value < 0) throw new Error("Square root of negative number");
    return Math.sqrt(value);
}

/**
 * Calculates the factorial of a non-negative integer n.
 *
 * @param n - The non-negative integer whose factorial is to be calculated.
 * @returns The factorial of n.
 * @throws {Error} Will throw an error if n is negative.
 * @remarks For large values of `n`, this function may cause performance issues or integer overflow due to the limitations of JavaScript numbers.
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
 * Calculates the logarithm of a value with a specified base.
 *
 * @param value - The number to calculate the logarithm for. Must be positive.
 * @param base - The base of the logarithm. Defaults to Math.E (natural logarithm).
 * @returns The logarithm of value to the given base.
 * @throws {Error} Throws an error if value is not positive.
 */
export function log(value: number, base: number = Math.E): number {
    if (value <= 0) throw new Error("Logarithm of non-positive number");
    return Math.log(value) / Math.log(base);
}

/**
 * Asynchronously adds two numbers and returns the result after a delay.
 *
 * @param a - The first number to add.
 * @param b - The second number to add.
 * @returns A promise that resolves to the sum of a and b after a 1 second delay.
 */
export async function asyncAdd(a: number, b: number): Promise<number> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(a + b);
        }, 1000); // Simulate a delay of 1 second
    });
}

