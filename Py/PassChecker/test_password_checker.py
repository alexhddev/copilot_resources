import unittest
from password_checker import validate_password, validate_password_with_error_messages;

class TestValidatePassword(unittest.TestCase):
    def test_password_length(self):
        assert validate_password("short") == False
        assert validate_password("longer_string_longer_string") == False

    def test_password_uppercase(self):
        assert validate_password("no uppercase4!") == False

    def test_password_lowercase(self):
        assert validate_password("NO LOWERCASE4!") == False

    def test_password_digit(self):
        assert validate_password("no digitA") == False

    def test_password_special_character(self):
        assert validate_password("no special character3D") == False

    def test_password_valid(self):
        assert validate_password("ValidPassword1!") == True

class TestValidatePasswordWithErrorMessage(unittest.TestCase):
    def test_password_length(self):
        with self.assertRaises(ValueError) as context:
            validate_password_with_error_messages("short")
        self.assertEqual(str(context.exception), "Password length must be between 8 and 20 characters")

        with self.assertRaises(ValueError) as context:
            validate_password_with_error_messages("longer_string_longer_string")
        self.assertEqual(str(context.exception), "Password length must be between 8 and 20 characters")

    def test_password_uppercase(self):
        with self.assertRaises(ValueError) as context:
            validate_password_with_error_messages("no uppercase4!")
        self.assertEqual(str(context.exception), "Password must contain at least one uppercase letter")

    def test_password_lowercase(self):
        with self.assertRaises(ValueError) as context:
            validate_password_with_error_messages("NO LOWERCASE4!")
        self.assertEqual(str(context.exception), "Password must contain at least one lowercase letter")

    def test_password_digit(self):
        with self.assertRaises(ValueError) as context:
            validate_password_with_error_messages("no digitA")
        self.assertEqual(str(context.exception), "Password must contain at least one digit")

    def test_password_special_character(self):
        with self.assertRaises(ValueError) as context:
            validate_password_with_error_messages("no special char3D")
        self.assertEqual(str(context.exception), "Password must contain at least one special character from !@#$%^&*()_+-=[]{}|:;\"'<>,.?/`")

    def test_password_valid(self):
        # No exception should be raised for a valid password
        try:
            validate_password_with_error_messages("ValidPassword1!")
        except ValueError:
            self.fail("validate_password_with_error_messages raised ValueError unexpectedly")


if __name__ == '__main__':
    unittest.main()
