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
            "name": "Tunnl Team",
            "email": "noreply@tunnl.io",
        },
        "to": [
            {
                "email": to_email,
                "name": f"{name}",
            },
        ],
        "subject": "Welcome to Tunnl - Your Journey Begins Here!",
        "htmlContent": f"<html> <head></head> <body> <p>Hello {name},</p> <p> Thank you for signing up with Tunnl! We're thrilled to have you on board as we embark on this exciting journey together. As part of our early access community, you're experiencing Tunnl in its beta testing phase. This means you get a first-hand look at our evolving features and the unique opportunity to shape the future of our platform. </p> <p> To get you started, we've automatically created your wallet address: {wallet_address}. We understand the importance of security and privacy, so rest assured, your wallet's private keys are securely encrypted and stored with the utmost care. </p> <p> As a token of our appreciation and to help you explore Tunnl's capabilities, we've transferred some gas money to your new wallet. You can view the transaction details here:<br /> https://testnet.snowtrace.io/tx/{transaction_hash} </p> <p> As you navigate through Tunnl, we encourage you to provide us with feedback. Your insights are invaluable as we strive to improve and tailor our platform to better suit your needs. </p> <p>Welcome to the Tunnl family – let's make this journey unforgettable!</p> <p> Warm regards,<br /><br /> The Tunnl Team 🚀✨ </p> </body> </html>",
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return True
    except Exception as error:
        print(f"Failed to send the email: {error}")
        return False


send_welcome_email("wangge326@gmail.com", "asdfasdf", "asdfasdf", 'asdfasdf')
