package com.barosanu;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;

public class PasswordCheckerTest {

    private PasswordChecker checker;

    @BeforeEach
    public void setUp() {
        checker = new PasswordChecker();
    }

    @Test
    public void testValidPassword() {
        assertTrue(checker.checkPassword("Abcdefg1!"));
    }

    @Test
    public void testShortPassword() {
        assertFalse(checker.checkPassword("Abc1!"));
    }

    @Test
    public void testLongPassword() {
        assertFalse(checker.checkPassword("Abcdefg123456789012345!"));
    }

    @Test
    public void testNoLowerCaseLetter() {
        assertFalse(checker.checkPassword("ABCDEFG1!"));
    }

    @Test
    public void testNoUpperCaseLetter() {
        assertFalse(checker.checkPassword("abcdefg1!"));
    }

    @Test
    public void testNoDigit() {
        assertFalse(checker.checkPassword("Abcdefg!"));
    }

    @Test
    public void testNoSpecialCharacter() {
        assertFalse(checker.checkPassword("Abcdefg1"));
    }

    @Test
    public void testPasswordTooShort() {
        Exception exception = assertThrows(Exception.class, () -> {
            checker.checkPasswordAndThrowReason("Abc1!");
        });
        assertEquals("Password must be at least 8 characters long", exception.getMessage());
    }

    @Test
    public void testPasswordTooLong() {
        assertThrows(Exception.class, () -> {
            checker.checkPasswordAndThrowReason("Abcdefg1234567890123456!");
        });
    }

    @Test
    public void testNoLowerCaseLetterWithReason() {
        Exception exception = assertThrows(Exception.class, () -> {
            checker.checkPasswordAndThrowReason("ABCDEFG1!");
        });
        assertEquals("Password must contain at least one lowercase letter", exception.getMessage());
    }

    @Test
    public void testNoUpperCaseLetterWithReason() {
        Exception exception = assertThrows(Exception.class, () -> {
            checker.checkPasswordAndThrowReason("abcdefg1!");
        });
        assertEquals("Password must contain at least one uppercase letter", exception.getMessage());
    }

    @Test
    public void testNoDigitWithReason() {
        Exception exception = assertThrows(Exception.class, () -> {
            checker.checkPasswordAndThrowReason("Abcdefg!");
        });
        assertEquals("Password must contain at least one digit", exception.getMessage());
    }

    @Test
    public void testNoSpecialCharacterWithReason() {
        Exception exception = assertThrows(Exception.class, () -> {
            checker.checkPasswordAndThrowReason("Abcdefg1");
        });
        assertEquals("Password must contain at least one special character", exception.getMessage());
    }

    @Test
    public void testValidPasswordWithReason() {
        assertDoesNotThrow(() -> {
            checker.checkPasswordAndThrowReason("Abcdefg1!");
        });
    }
    
}
