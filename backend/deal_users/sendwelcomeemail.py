import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
load_dotenv()


def send_welcome_email(toemail, name):
    fromemail = "noreply@deal.com"
    fromAddr = f"deal.com <{fromemail}>"
    toAddr = f"{toemail}"

    # smtp login
    username = ''
    pswd = os.environ.get('SMTP_PASSWORD')

    msg = MIMEMultipart('alternative')

    msg['Subject'] = f"Thank you for signing up with Askdeal AI."
    msg['From'] = fromAddr
    msg['To'] = toAddr

    # HTML version of the email
    html = f"""
    """
    text = f"""\
    """

    # Attach the plain-text and HTML versions to the MIME object
    msg.attach(MIMEText(text, 'plain'))
    msg.attach(MIMEText(html, 'html'))

    # SMTP login

    server = smtplib.SMTP_SSL("email-smtp.us-east-2.amazonaws.com", 465)

    server.login(username, pswd)
    server.sendmail(fromAddr, toAddr, msg.as_string())
    server.quit()
