import re

def validate_password(password):
    """
    Validates a password based on the following criteria:
    - Length must be between 8 and 20 characters
    - Must contain at least one digit
    - Must contain at least one uppercase letter
    - Must contain at least one lowercase letter
    - Must contain at least one special character from '!@#$%^&*()_+-=[]{}|:;"\'<>,.?/~`'
    
    Args:
        password (str): The password to be validated.
    
    Returns:
        bool: True if the password is valid, False otherwise.
    """
    if len(password) < 8 or len(password) > 20:
        return False
    
    if not any(char.isdigit() for char in password):
        return False
    
    if not any(char.isupper() for char in password):
        return False
    
    if not any(char.islower() for char in password):
        return False
    
    if not any(char in '!@#$%^&*()_+-=[]{}|:;"\'<>,.?/~`' for char in password):
        return False
    
    return True


def validate_password_with_error_messages(password):
    """
    Validates a password based on the following criteria:
    - Length must be between 8 and 20 characters
    - Must contain at least one digit
    - Must contain at least one uppercase letter
    - Must contain at least one lowercase letter
    - Must contain at least one special character from '!@#$%^&*()_+-=[]{}|:;"\'<>,.?/`'
    
    Args:
        password (str): The password to be validated.
    
    Raises:
        ValueError: If the password does not meet any of the above criteria.
    """
    if len(password) < 8 or len(password) > 20:
        raise ValueError("Password length must be between 8 and 20 characters")
    
    if not any(char.isdigit() for char in password):
        raise ValueError("Password must contain at least one digit")
    
    if not any(char.isupper() for char in password):
        raise ValueError("Password must contain at least one uppercase letter")
    
    if not any(char.islower() for char in password):
        raise ValueError("Password must contain at least one lowercase letter")
    
    special_chars = '!@#$%^&*()_+-=[]{}|:;"\'<>,.?/`'
    if not any(char in special_chars for char in password):
        raise ValueError(f"Password must contain at least one special character from {special_chars}")
    
def validate_password_with_error_messages_regex(password):
    """
    Validates a password using regular expressions and raises ValueError with specific error messages for each validation rule.

    Args:
        password (str): The password to be validated.

    Raises:
        ValueError: If any of the validation rules fail.

    """
    if not re.search(r".{8,20}", password):
        raise ValueError("Password length must be between 8 and 20 characters")
    
    if not re.search(r"\d", password):
        raise ValueError("Password must contain at least one digit")
    
    if not re.search(r"[A-Z]", password):
        raise ValueError("Password must contain at least one uppercase letter")
    
    if not re.search(r"[a-z]", password):
        raise ValueError("Password must contain at least one lowercase letter")
    
    special_chars = r"!@#$%^&*()_+-=[]{}|:;\"'<>,.?/~`"
    if not re.search(f"[{re.escape(special_chars)}]", password):
        raise ValueError(f"Password must contain at least one special character from {special_chars}")
    
    
