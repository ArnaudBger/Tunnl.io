import jwt
import uuid
from datetime import timedelta
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .models import User, EmailVerificationCode
from django.conf import settings
from .encryption import encrypt
from datetime import timedelta
from random import randint
from django.utils import timezone
from datetime import datetime, timedelta
from .sendverificationemail import send_verification_email as sve
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token


class ResetPasswordEmailView(APIView):
    @method_decorator(ratelimit(key='ip', rate='1/m', method='POST', block=True))
    def dispatch(self, *args, **kwargs):
        return super(ResetPasswordEmailView, self).dispatch(*args, **kwargs)

    def post(self, request):

        email = request.data['email']
        lang = request.data['language']
        existing_user = User.objects.filter(email=email).first()

        if not existing_user:
            return Response({'message': 'User with this email not exists'}, status=400)

        EmailVerificationCode.objects.filter(
            email=email, purpose='ResetPassword').delete()

        verification_code = randint(10000000, 99999999)
        expires_at = timezone.now() + timedelta(minutes=10)
        verification_code_instance = EmailVerificationCode(
            email=email,
            code=verification_code,
            purpose='ResetPassword',
            expires_at=expires_at
        )
        verification_code_instance.save()
        try:
            sve(toemail=email,
                verificationcode=verification_code, language=lang)
            return Response({'message': 'Email verification code sent'})
        except:
            return Response({'error': 'server error'})


class ResetPasswordResendEmailView(APIView):
    @method_decorator(ratelimit(key='ip', rate='1/m', method='POST', block=True))
    def dispatch(self, *args, **kwargs):
        return super(ResetPasswordResendEmailView, self).dispatch(*args, **kwargs)

    def post(self, request):
        email = request.data['email']
        lang = request.data['language']
        existing_user = User.objects.filter(email=email).first()

        if not existing_user:
            return Response({'message': 'User with this email not exists'}, status=400)

        verification_code_instance = EmailVerificationCode.objects.filter(
            email=email, purpose='ResetPassword').first()

        if not verification_code_instance:
            return Response({'message': 'No existing verification code found'}, status=400)

        verification_code_instance.expires_at = timezone.now() + timedelta(minutes=10)
        verification_code_instance.save()

        try:
            sve(toemail=email,
                verificationcode=verification_code_instance.code, language=lang)
            return Response({'message': 'Email verification code sent'})
        except:
            return Response({'error': 'server error'})


class CheckEmailResetPasswordVerificationCodeView(APIView):
    @method_decorator(ratelimit(key='ip', rate='5/m', method='POST', block=True))
    def dispatch(self, *args, **kwargs):
        return super(CheckEmailResetPasswordVerificationCodeView, self).dispatch(*args, **kwargs)

    def post(self, request):
        email = request.data['email']
        code = request.data['code']
        try:
            verification_code_instance = EmailVerificationCode.objects.filter(
                email=email, code=code, purpose='ResetPassword'
            ).first()

            if verification_code_instance is None or timezone.now() > verification_code_instance.expires_at:
                raise AuthenticationFailed(
                    'Incorrect or expired verification code!')

            return Response({'message': 'Verification code is valid'})
        except:
            return Response({'message': 'Verification code is invalid'})


class CompleteEmailResetPasswordView(APIView):
    @method_decorator(ratelimit(key='ip', rate='5/m', method='POST', block=True))
    def dispatch(self, *args, **kwargs):
        return super(CompleteEmailResetPasswordView, self).dispatch(*args, **kwargs)

    def post(self, request):
        email = request.data['email']
        code = request.data['code']
        password = request.data['password']

        if not all([email, code, password]):
            return Response({'message': 'Required field(s) missing'}, status=400)

        verification_code_instance = EmailVerificationCode.objects.filter(
            email=email, code=code, purpose='ResetPassword'
        ).first()

        if len(password) < 8:
            return Response({'message': 'password length is invalid'}, status=400)

        if verification_code_instance is None or timezone.now() > verification_code_instance.expires_at:
            raise AuthenticationFailed(
                'Incorrect or expired verification code!')

        user = User.objects.filter(email=email).first()

        if not user:
            return Response({'message': 'User does not exist'}, status=400)

        session_id = str(uuid.uuid4())
        user.set_password(password)
        user.session_id = session_id
        user.save()

        verification_code_instance.delete()

        

        payload = {
            'id': user.id,
            'exp': datetime.utcnow() + timedelta(minutes=20160),
            'iat': datetime.utcnow(),
            'session_id': session_id
        }

        token = jwt.encode(payload, settings.SECRET_KEY, 'HS256')
        encoded_token = encrypt(token)

        response = Response({'message': 'User successfully reset password'})

        max_age = 20160 * 60  # 14 days in seconds
        expires = datetime.strftime(
            datetime.utcnow() + timedelta(seconds=max_age), "%a, %d-%b-%Y %H:%M:%S GMT")
        response.set_cookie('deal_key', encoded_token, max_age=max_age,
                            expires=expires, httponly=True, secure=True, samesite='None')

        # add csrf_token
        get_token(request)

        return response
