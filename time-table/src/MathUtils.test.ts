import { describe, it, expect } from 'vitest'
import { add, subtract, multiply, divide, power, sqrt, factorial, asyncAdd } from './MathUtils'

describe('add', () => {
  it('returns the sum of two positive numbers', () => {
    expect(add(2, 3)).toBe(5)
  })

  it('returns the sum when one operand is negative', () => {
    expect(add(-4, 7)).toBe(3)
  })

  it('returns zero when both operands are zero', () => {
    expect(add(0, 0)).toBe(0)
  })
})

describe('subtract', () => {
  it('returns the difference of two numbers', () => {
    expect(subtract(10, 4)).toBe(6)
  })

  it('returns a negative result when b > a', () => {
    expect(subtract(3, 8)).toBe(-5)
  })

  it('returns zero when both operands are equal', () => {
    expect(subtract(5, 5)).toBe(0)
  })
})

describe('multiply', () => {
  it('returns the product of two positive numbers', () => {
    expect(multiply(3, 4)).toBe(12)
  })

  it('returns zero when one operand is zero', () => {
    expect(multiply(7, 0)).toBe(0)
  })

  it('returns a positive product when both operands are negative', () => {
    expect(multiply(-3, -4)).toBe(12)
  })
})

describe('divide', () => {
  it('returns the quotient of two numbers', () => {
    expect(divide(10, 2)).toBe(5)
  })

  it('returns a fractional result', () => {
    expect(divide(1, 4)).toBe(0.25)
  })

  it('throws when dividing by zero', () => {
    expect(() => divide(5, 0)).toThrow('Division by zero')
  })
})

describe('power', () => {
  it('raises a base to a positive exponent', () => {
    expect(power(2, 10)).toBe(1024)
  })

  it('returns 1 when exponent is 0', () => {
    expect(power(5, 0)).toBe(1)
  })

  it('returns the base itself when exponent is 1', () => {
    expect(power(7, 1)).toBe(7)
  })
})

describe('sqrt', () => {
  it('returns the square root of a perfect square', () => {
    expect(sqrt(9)).toBe(3)
  })

  it('returns 0 for an input of 0', () => {
    expect(sqrt(0)).toBe(0)
  })

  it('throws for a negative input', () => {
    expect(() => sqrt(-1)).toThrow('Square root of negative number')
  })
})

describe('factorial', () => {
  it('returns 1 for 0', () => {
    expect(factorial(0)).toBe(1)
  })

  it('returns 1 for 1', () => {
    expect(factorial(1)).toBe(1)
  })

  it('returns the correct factorial for a positive integer', () => {
    expect(factorial(5)).toBe(120)
  })

  it('throws for a negative input', () => {
    expect(() => factorial(-3)).toThrow('Factorial of negative number')
  })
})

describe('asyncAdd', () => {
  it('resolves to the sum of two numbers', async () => {
    const result = await asyncAdd(3, 4)
    expect(result).toBe(7)
  })
})
