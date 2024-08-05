package com.barosanu;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class PasswordCheckerTest {

    private PasswordChecker passwordChecker;

    @BeforeEach
    public void setUp() {
        passwordChecker = new PasswordChecker();
    }

    @Test
    public void testCheckPassword_ValidPassword_ReturnsTrue() {
        assertTrue(passwordChecker.checkPassword("Abcdefg1"));
    }

    @Test
    public void testCheckPassword_TooShortPassword_ReturnsFalse() {
        assertFalse(passwordChecker.checkPassword("Abc1"));
    }

    @Test
    public void testCheckPassword_TooLongPassword_ReturnsFalse() {
        assertFalse(passwordChecker.checkPassword("Abcdefghijklmnopqrstuvwxyz1"));
    }

    @Test
    public void testCheckPassword_NoDigit_ReturnsFalse() {
        assertFalse(passwordChecker.checkPassword("Abcdefgh"));
    }

    @Test
    public void testCheckPassword_NoLowercaseLetter_ReturnsFalse() {
        assertFalse(passwordChecker.checkPassword("ABCDEFG1"));
    }

    @Test
    public void testCheckPassword_NoUppercaseLetter_ReturnsFalse() {
        assertFalse(passwordChecker.checkPassword("abcdefg1"));
    }

    @Test
    public void testValidPassword(){
        assertTrue(passwordChecker.checkPassword("Abcdefg1"));
    }
}
