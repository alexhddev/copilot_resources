import unittest
from password_checker import validate_password, validate_password_with_error_messages;

class TestValidatePassword(unittest.TestCase):
    def test_password_length(self):
        assert validate_password("short") == False

if __name__ == '__main__':
    unittest.main()