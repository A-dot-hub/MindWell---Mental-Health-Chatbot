# utils.py
import random
from email.message import EmailMessage
import aiosmtplib
import os
from dotenv import load_dotenv

load_dotenv()  # Load .env variables

# OTP Generator
def generate_otp():
    return str(random.randint(100000, 999999))

# Send OTP to email
async def send_otp_email(to_email, otp):
    msg = EmailMessage()
    msg["Subject"] = "Your OTP Code"
    msg["From"] = os.getenv("EMAIL_FROM")
    msg["To"] = to_email
    msg.set_content(f"Your OTP code is: {otp}")

    await aiosmtplib.send(
        msg,
        hostname="smtp.gmail.com",
        port=587,
        start_tls=True,
        username=os.getenv("EMAIL_FROM"),
        password=os.getenv("EMAIL_PASSWORD"),
    )
