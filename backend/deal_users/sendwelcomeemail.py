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


def send_welcome_email(to_email: str, name: str, wallet_address: str, transaction_hash: str) -> bool:
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
        "subject": "Thanks for registering your account - Haha Labs",
        "htmlContent": f"<html><head></head><body><p>Hello,{name}</p><p>Thanks for registering your account at Haha Labs, we are excited to work with you for this journey!</p><p>We have automatically create your wallet address: {wallet_address} and have transfered some gas money to your wallet, you can check https://testnet.snowtrace.io/tx/{transaction_hash} </p><p>The Haha Labs Team</p></body></html>",
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return True
    except Exception as error:
        print(f"Failed to send the email: {error}")
        return False
