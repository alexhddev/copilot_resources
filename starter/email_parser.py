# this file will handle the parsing of the email

import email


def parse_email(file_path):
    """
    Parse an email file and print its headers and body.

    Args:
        file_path (str): The path to the email file.

    Returns:
        None
    """
    with open(file_path, 'r') as file:
        msg = email.message_from_file(file)

        # access email headers
        print("From", msg['From'])
        print("To", msg['To'])
        print("Subject", msg['Subject'])

        # access email body
        if msg.is_multipart():
            for part in msg.walk():
                # each part is a either non-multipart, or another multipart message
                # that contains further parts... Message is organized like a tree
                if part.get_content_type() == 'text/plain':
                    print(part.get_payload())
        else:
            print(msg.get_payload())

parse_email('email.eml')
