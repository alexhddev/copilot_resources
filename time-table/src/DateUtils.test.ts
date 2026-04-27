import { describe, it, expect } from 'vitest'
import { startOfDay, endOfDay, addDays, isSameDay, formatDate, isValidDateFormat } from './DateUtils'

describe('startOfDay', () => {
  it('sets time to midnight UTC', () => {
    const date = new Date('2026-04-27T15:30:45.123Z')
    const result = startOfDay(date)
    expect(result.toISOString()).toBe('2026-04-27T00:00:00.000Z')
  })

  it('does not mutate the original date', () => {
    const date = new Date('2026-04-27T15:30:45.123Z')
    startOfDay(date)
    expect(date.toISOString()).toBe('2026-04-27T15:30:45.123Z')
  })

  it('returns midnight when already at midnight', () => {
    const date = new Date('2026-04-27T00:00:00.000Z')
    const result = startOfDay(date)
    expect(result.toISOString()).toBe('2026-04-27T00:00:00.000Z')
  })
})

describe('endOfDay', () => {
  it('sets time to 23:59:59.999 UTC', () => {
    const date = new Date('2026-04-27T08:00:00.000Z')
    const result = endOfDay(date)
    expect(result.toISOString()).toBe('2026-04-27T23:59:59.999Z')
  })

  it('does not mutate the original date', () => {
    const date = new Date('2026-04-27T08:00:00.000Z')
    endOfDay(date)
    expect(date.toISOString()).toBe('2026-04-27T08:00:00.000Z')
  })

  it('returns end of day when already at end of day', () => {
    const date = new Date('2026-04-27T23:59:59.999Z')
    const result = endOfDay(date)
    expect(result.toISOString()).toBe('2026-04-27T23:59:59.999Z')
  })
})

describe('addDays', () => {
  it('adds a positive number of days', () => {
    const date = new Date('2026-04-27T00:00:00.000Z')
    const result = addDays(date, 5)
    expect(result.getUTCDate()).toBe(2)
    expect(result.getUTCMonth()).toBe(4) // May
    expect(result.getUTCFullYear()).toBe(2026)
  })

  it('subtracts days when given a negative number', () => {
    const date = new Date('2026-04-27T00:00:00.000Z')
    const result = addDays(date, -7)
    expect(result.getUTCDate()).toBe(20)
    expect(result.getUTCMonth()).toBe(3) // April
    expect(result.getUTCFullYear()).toBe(2026)
  })

  it('returns the same date when adding zero days', () => {
    const date = new Date('2026-04-27T00:00:00.000Z')
    const result = addDays(date, 0)
    expect(result.toISOString()).toBe('2026-04-27T00:00:00.000Z')
  })

  it('crosses month boundaries correctly', () => {
    const date = new Date('2026-01-31T00:00:00.000Z')
    const result = addDays(date, 1)
    expect(result.getUTCMonth()).toBe(1) // February
    expect(result.getUTCDate()).toBe(1)
  })

  it('does not mutate the original date', () => {
    const date = new Date('2026-04-27T00:00:00.000Z')
    addDays(date, 3)
    expect(date.toISOString()).toBe('2026-04-27T00:00:00.000Z')
  })
})

describe('isSameDay', () => {
  it('returns true for two dates on the same UTC day', () => {
    const date1 = new Date('2026-04-27T08:00:00.000Z')
    const date2 = new Date('2026-04-27T20:00:00.000Z')
    expect(isSameDay(date1, date2)).toBe(true)
  })

  it('returns false for dates on different days', () => {
    const date1 = new Date('2026-04-27T00:00:00.000Z')
    const date2 = new Date('2026-04-28T00:00:00.000Z')
    expect(isSameDay(date1, date2)).toBe(false)
  })

  it('returns false for same day in different months', () => {
    const date1 = new Date('2026-03-15T00:00:00.000Z')
    const date2 = new Date('2026-04-15T00:00:00.000Z')
    expect(isSameDay(date1, date2)).toBe(false)
  })

  it('returns false for same day and month in different years', () => {
    const date1 = new Date('2025-04-27T00:00:00.000Z')
    const date2 = new Date('2026-04-27T00:00:00.000Z')
    expect(isSameDay(date1, date2)).toBe(false)
  })

  it('returns true when comparing a date to itself', () => {
    const date = new Date('2026-04-27T12:00:00.000Z')
    expect(isSameDay(date, date)).toBe(true)
  })
})

describe('formatDate', () => {
  it('formats a date as YYYY-MM-DD', () => {
    const date = new Date('2026-04-27T00:00:00.000Z')
    expect(formatDate(date)).toBe('2026-04-27')
  })

  it('pads single-digit month and day with zeros', () => {
    const date = new Date('2026-01-05T00:00:00.000Z')
    expect(formatDate(date)).toBe('2026-01-05')
  })

  it('formats end of year correctly', () => {
    const date = new Date('2026-12-31T00:00:00.000Z')
    expect(formatDate(date)).toBe('2026-12-31')
  })

  it('formats start of year correctly', () => {
    const date = new Date('2026-01-01T00:00:00.000Z')
    expect(formatDate(date)).toBe('2026-01-01')
  })
})

describe('isValidDateFormat', () => {
  it('returns true for a valid YYYY-MM-DD string', () => {
    expect(isValidDateFormat('2026-04-27')).toBe(true)
  })

  it('returns false for a string missing dashes', () => {
    expect(isValidDateFormat('20260427')).toBe(false)
  })

  it('returns false for a date with slashes', () => {
    expect(isValidDateFormat('2026/04/27')).toBe(false)
  })

  it('returns false for a partially formatted string', () => {
    expect(isValidDateFormat('2026-4-27')).toBe(false)
  })

  it('returns false for an empty string', () => {
    expect(isValidDateFormat('')).toBe(false)
  })

  it('returns false for a string with extra characters', () => {
    expect(isValidDateFormat('2026-04-27T00:00:00')).toBe(false)
  })

  it('returns false for non-numeric characters in the date fields', () => {
    expect(isValidDateFormat('YYYY-MM-DD')).toBe(false)
  })
})
