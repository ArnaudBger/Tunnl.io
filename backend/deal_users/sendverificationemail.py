import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
load_dotenv()


def send_verification_email(toemail, verificationcode, language):
    fromemail = "noreply@deal.com"
    fromAddr = f"deal.com <{fromemail}>"
    toAddr = f"{toemail}"

    username = ''
    pswd = os.environ.get('SMTP_PASSWORD')

    msg = MIMEMultipart('alternative')

    msg['Subject'] = f"{verificationcode} is your verification code for deal.com"
    msg['From'] = fromAddr
    msg['To'] = toAddr

    # HTML version of the email
    html = ""

    # Create the plain-text version of the email
    text = f"""\
    One Time Passcode

    {verificationcode}

    Enter the passcode in the Deal app.

    Please noted that it will be expired after 10 mins.

    Cheers,

    deal.com Team
    """

    # Attach the plain-text and HTML versions to the MIME object
    msg.attach(MIMEText(text, 'plain'))
    msg.attach(MIMEText(html, 'html'))

    # SMTP login

    server = smtplib.SMTP_SSL("email-smtp.us-east-2.amazonaws.com", 465)

    server.login(username, pswd)
    server.sendmail(fromAddr, toAddr, msg.as_string())
    server.quit()
