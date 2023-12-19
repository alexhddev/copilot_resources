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
}
