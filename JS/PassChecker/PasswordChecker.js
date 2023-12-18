/**
 * Checks if a password meets the specified criteria.
 * @param {string} password - The password to be checked.
 * @throws {Error} If the password does not meet the criteria.
 */
export function checkPassword(password) {
    if (typeof password !== 'string') {
        throw new Error('password must be a string');
    }
    if (password.length < 8) {
        throw new Error('password must be at least 8 characters');
    }
    if (password.length > 20) {
        throw new Error('password must be less than 20 characters');
    }
    if (!password.match(/[a-z]/)) {
        throw new Error('password must contain a lowercase letter');
    }
    if (!password.match(/[A-Z]/)) {
        throw new Error('password must contain an uppercase letter');
    }
    if (!password.match(/[0-9]/)) {
        throw new Error('password must contain a number');
    }    
    if (!password.match(/[^a-zA-Z0-9!]/)) {
        throw new Error('password must contain a special character');
    }
}

/**
 * Checks if a password meets the specified criteria without using regular expressions.
 * 
 * @param {string} password - The password to be checked.
 * @throws {Error} If the password is not a string, is less than 8 characters, is more than 20 characters,
 *                 does not contain a lowercase letter, an uppercase letter, a number, or a special character.
 */
export function checkPasswordWithoutRegEx(password) {
    if (typeof password !== 'string') {
        throw new Error('password must be a string');
    }
    if (password.length < 8) {
        throw new Error('password must be at least 8 characters');
    }
    if (password.length > 20) {
        throw new Error('password must be less than 20 characters');
    }
    let hasLowercase = false;
    let hasUppercase = false;
    let hasNumber = false;
    let hasSpecialChar = false;
    const specialChars = "!@#$%^&*()_+-=[]{}|;':,.<>?";

    for (let i = 0; i < password.length; i++) {
        const char = password[i];
        if (char >= 'a' && char <= 'z') {
            hasLowercase = true;
        } else if (char >= 'A' && char <= 'Z') {
            hasUppercase = true;
        } else if (char >= '0' && char <= '9') {
            hasNumber = true;
        } else if (specialChars.includes(char)) {
            hasSpecialChar = true;
        }
    }

    if (!hasLowercase) {
        throw new Error('password must contain a lowercase letter');
    }
    if (!hasUppercase) {
        throw new Error('password must contain an uppercase letter');
    }
    if (!hasNumber) {
        throw new Error('password must contain a number');
    }
    if (!hasSpecialChar) {
        throw new Error('password must contain a special character');
    }
}


