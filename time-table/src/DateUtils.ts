/**
 * Returns a new Date object with the time set to midnight (00:00:00).
 */
export function startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
}

/**
 * Returns a new Date object with the time set to the end of the day (23:59:59.999).
 */
export function endOfDay(date: Date): Date {
    const d = new Date(date);
    d.setUTCHours(23, 59, 59, 999);
    return d;
}

/**
 * Adds the specified number of days to the given date.
 */
export function addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setUTCDate(d.getUTCDate() + days);
    return d;
}

/**
 * Checks if two dates are on the same day (ignoring time).
 */
export function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getUTCFullYear() === date2.getUTCFullYear() &&
        date1.getUTCMonth() === date2.getUTCMonth() &&
        date1.getUTCDate() === date2.getUTCDate()
    );
}

/**
 * Formats a date as YYYY-MM-DD.
 */
export function formatDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Checks if a given string matches the 'YYYY-MM-DD' date format.
 *
 * @param dateString - The string to validate as a date.
 * @returns `true` if the string matches the 'YYYY-MM-DD' format, otherwise `false`.
 */
export function isValidDateFormat(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
}