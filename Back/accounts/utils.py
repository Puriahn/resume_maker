import random
from datetime import timedelta
from django.utils import timezone
from django.conf import settings
from django.core.mail import send_mail
from .models import User, OtpCode


def send_otp_via_email(email):
    subject = 'Your Resume maker verification code'
    code = random.randint(1000, 9999)
    message = f'code: {code}'
    email_from = settings.EMAIL_HOST_USER
    try:
        send_mail(subject, message, email_from, [email])
        user = User.objects.get(email=email)
        OtpCode.objects.create(
            user = user,
            code = code,
            code_expiry = timezone.now() + timedelta(minutes=2)
        )
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False
