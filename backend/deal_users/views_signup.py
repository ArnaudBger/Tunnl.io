import jwt
import uuid
from datetime import timedelta
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from .models import User,  EmailVerificationCode
from django.conf import settings
from .encryption import encrypt, encrypt_private_key
from datetime import timedelta
from random import randint
from django.utils import timezone
from datetime import datetime, timedelta
from .sendverificationemail import send_verification_email as sve
from .sendwelcomeemail import send_welcome_email as swe
from .serializers import UserCreateSerializer
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token
from .createWallet import create_wallet
from .transferFunds import transferFundForRegisteredUser


class RegisterEmailView(APIView):
    @method_decorator(ratelimit(key='ip', rate='2/m', method='POST', block=True))
    def dispatch(self, *args, **kwargs):
        return super(RegisterEmailView, self).dispatch(*args, **kwargs)

    def post(self, request):

        email = request.data['email']
        existing_user = User.objects.filter(email=email).first()
        if existing_user:
            return Response({'message': 'User with this email already exists'}, status=400)

        EmailVerificationCode.objects.filter(
            email=email, purpose='register').delete()

        verification_code = randint(10000000, 99999999)
        expires_at = timezone.now() + timedelta(minutes=10)
        verification_code_instance = EmailVerificationCode(
            email=email,
            code=verification_code,
            purpose='register',
            expires_at=expires_at
        )
        verification_code_instance.save()
        try:
            sve(to_email=email,
                verification_code=verification_code)
            return Response({'message': 'Email verification code sent'})
        except Exception as e:
            print(e)
            print(1)
            return Response({'error': 'server error'})


class RegisterResendEmailView(APIView):
    @method_decorator(ratelimit(key='ip', rate='2/m', method='POST', block=True))
    def dispatch(self, *args, **kwargs):
        return super(RegisterResendEmailView, self).dispatch(*args, **kwargs)

    def post(self, request):
        email = request.data['email']
        existing_user = User.objects.filter(email=email).first()

        if existing_user:
            return Response({'message': 'User with this email already exists'}, status=400)

        verification_code_instance = EmailVerificationCode.objects.filter(
            email=email, purpose='register').first()

        if not verification_code_instance:
            return Response({'message': 'No existing verification code found'}, status=400)

        verification_code_instance.expires_at = timezone.now() + timedelta(minutes=10)
        verification_code_instance.save()

        try:
            sve(toemail=email,
                verificationcode=verification_code_instance.code)
            return Response({'message': 'Email verification code sent'})
        except:
            return Response({'error': 'server error'})


class CheckEmailVerificationCodeView(APIView):
    @method_decorator(ratelimit(key='ip', rate='2/m', method='POST', block=True))
    def dispatch(self, *args, **kwargs):
        return super(CheckEmailVerificationCodeView, self).dispatch(*args, **kwargs)

    def post(self, request):
        email = request.data['email']
        code = request.data['code']
        try:
            verification_code_instance = EmailVerificationCode.objects.filter(
                email=email, code=code, purpose='register'
            ).first()

            if verification_code_instance is None or timezone.now() > verification_code_instance.expires_at:
                raise AuthenticationFailed(
                    'Incorrect or expired verification code!')

            return Response({'message': 'Verification code is valid'})
        except:
            return Response({'message': 'Verification code is invalid'})


class CompleteEmailRegistrationView(APIView):
    @method_decorator(ratelimit(key='ip', rate='10/m', method='POST', block=True))
    def dispatch(self, *args, **kwargs):
        return super(CompleteEmailRegistrationView, self).dispatch(*args, **kwargs)

    def post(self, request):
        email = request.data['email']
        code = request.data['code']
        name = request.data['name']

        if len(name) > 20 or len(name) == 0:
            return Response({"error": "username is exceeded 20 charactors"}, status=status.HTTP_400_BAD_REQUEST)

        if ' ' in name:
            return Response({"error": "username conatins space"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(name_lower=name.lower()).exists():
            name = name + str(randint(1000, 99999))

        verification_code_instance = EmailVerificationCode.objects.filter(
            email=email, code=code, purpose='register'
        ).first()

        if verification_code_instance is None or timezone.now() > verification_code_instance.expires_at:
            raise AuthenticationFailed(
                'Incorrect or expired verification code!')

        session_id = str(uuid.uuid4())
        wallet_address, privaty_key = create_wallet()
        data = {
            'email': email,
            'name': name,
            'wallet_address': wallet_address,
            'pri_key': encrypt_private_key(privaty_key),
            'is_active': True,
            'session_id': session_id,
        }
        print(data)
        serializer = UserCreateSerializer(data=data)

        if serializer.is_valid():
            try:
                user = serializer.save()
                user.save()
            except Exception as e:
                print(e)
        else:
            return Response("Registration Failed", status=400)

        transaction_hash = transferFundForRegisteredUser(wallet_address)
        verification_code_instance.delete()
        swe(email, name, wallet_address, transaction_hash)

        payload = {
            'id': str(user.id),
            'exp': datetime.utcnow() + timedelta(minutes=20160),
            'iat': datetime.utcnow(),
            'session_id': session_id
        }

        response = Response({"registration": "success"})

        token = jwt.encode(payload, settings.SECRET_KEY, 'HS256')
        encoded_token = encrypt(token)

        max_age = 20160 * 60  # 14 days in seconds
        expires = datetime.strftime(
            datetime.utcnow() + timedelta(seconds=max_age), "%a, %d-%b-%Y %H:%M:%S GMT")
        response.set_cookie('deal_key', encoded_token, max_age=max_age,
                            expires=expires, httponly=True, secure=True, samesite='None')

        # add csrf_token
        get_token(request)

        return response
