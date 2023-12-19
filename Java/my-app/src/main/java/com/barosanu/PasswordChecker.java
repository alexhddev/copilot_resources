package com.barosanu;

public class PasswordChecker {
    
    /**
     * Checks if a password meets the specified criteria.
     * 
     * @param password the password to be checked
     * @return true if the password meets the criteria, false otherwise
     */
    public boolean checkPassword(String password) {
        if (password.length() < 8) {
            return false;
        }
        if (password.length() > 20) {
            return false;
        }
        if (!password.matches(".*[a-z].*")) {
            return false;
        }
        if (!password.matches(".*[A-Z].*")) {
            return false;
        }
        if (!password.matches(".*[0-9].*")) {
            return false;
        }
        if (!password.matches(".*[!@#$%^&*()_+=-].*")) {
            return false;
        }
        return true;
    }

    /**
     * Checks the validity of a password and throws an exception with the reason if it fails any of the criteria.
     *
     * @param password the password to be checked
     * @throws Exception if the password fails any of the criteria:
     *                   - Password must be at least 8 characters long
     *                   - Password must be less than or equal to 20 characters long
     *                   - Password must contain at least one lowercase letter
     *                   - Password must contain at least one uppercase letter
     *                   - Password must contain at least one digit
     *                   - Password must contain at least one special character
     */
    public void checkPasswordAndThrowReason(String password) throws Exception {
        if (password.length() < 8) {
            throw new Exception("Password must be at least 8 characters long");
        }
        if (password.length() > 20) {
            throw new Exception("Password must be less than or equal to 20 characters long");
        }
        if (!password.matches(".*[a-z].*")) {
            throw new Exception("Password must contain at least one lowercase letter");
        }
        if (!password.matches(".*[A-Z].*")) {
            throw new Exception("Password must contain at least one uppercase letter");
        }
        if (!password.matches(".*[0-9].*")) {
            throw new Exception("Password must contain at least one digit");
        }
        if (!password.matches(".*[!@#$%^&*()_+=-].*")) {
            throw new Exception("Password must contain at least one special character");
        }
    }
}
