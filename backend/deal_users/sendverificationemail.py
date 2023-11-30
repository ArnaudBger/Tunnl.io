import os
import requests

from dotenv import load_dotenv
load_dotenv()
url = "https://api.brevo.com/v3/smtp/email"

headers = {
    "Accept": "application/json",
    "API-Key": os.environ.get("BREVO_API_KEY"),
    "Content-Type": "application/json",
}


def send_verification_email(to_email: str, verification_code: str) -> bool:
    payload = {
        "sender": {
            "name": "Haha Labs Team",
            "email": "noreply@haha.labs",
        },
        "to": [
            {
                "email": to_email,
                "name": "New User",
            },
        ],
        "subject": f"{verification_code} is your verification code - Haha Labs",
        "htmlContent": f"<html><head><title>Verification code requested</title></head><body><p>Hello,</p><p>You are requesting a password change. Please enter the code below in our app in 10 minutes:</p><p><strong>Your Verification Code: {verification_code}</strong></p><p>If you did not request this code, you can safely ignore this email. </p><p>Best regards,</p><p>Haha.Labs</p></body></html>",
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return True
    except Exception as error:
        print(f"Failed to send the email: {error}")
        return False
