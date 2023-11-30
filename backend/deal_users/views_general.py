from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed
from django.db.models import Q
from django.http import HttpResponse

import uuid
from django.conf import settings
from .encryption import encrypt
from .authentication import JWTAuthentication
from .models import User,  EmailVerificationCode
from django.middleware.csrf import get_token
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from datetime import datetime, timedelta
import jwt
from .sendverificationemail import send_verification_email as sve
from random import randint
from django.utils import timezone


class LoginView(APIView):
    @method_decorator(ratelimit(key='ip', rate='10/m', method='POST', block=True))
    def dispatch(self, *args, **kwargs):
        return super(LoginView, self).dispatch(*args, **kwargs)

    def post(self, request):
        email = request.data['email']
        user = User.objects.filter(email=email).first()
        if user is not None:
            EmailVerificationCode.objects.filter(
                email=email, purpose='register').delete()

            verification_code = randint(10000000, 99999999)
            expires_at = timezone.now() + timedelta(minutes=10)
            verification_code_instance = EmailVerificationCode(
                email=email,
                code=verification_code,
                purpose='login',
                expires_at=expires_at
            )
            verification_code_instance.save()
            try:
                sve(to_email=email,
                    verification_code=verification_code)
                return Response({'message': 'Email verification code sent'})
            except Exception as e:
                return Response({'error': 'server error'}, status=400)
        else:
            return Response({'message': 'need register'}, status=400)


class LoginWithCodeView(APIView):
    @method_decorator(ratelimit(key='ip', rate='10/m', method='POST', block=True))
    def dispatch(self, *args, **kwargs):
        return super(LoginWithCodeView, self).dispatch(*args, **kwargs)

    def post(self, request):
        email = request.data['email']
        code = request.data['code']
        user = User.objects.filter(email=email).first()

        verification_code_instance = EmailVerificationCode.objects.filter(
            email=email, code=code, purpose='login'
        ).first()

        if verification_code_instance is None or timezone.now() > verification_code_instance.expires_at:
            raise AuthenticationFailed(
                'Incorrect or expired verification code!')

        token = self.generate_token(user)

        response = HttpResponse({"login": "success"})
        self.set_token_cookie(response, token)

        return response

    def generate_token(self, user):
        session_id = str(uuid.uuid4())
        payload = {
            'id': str(user.id),
            'exp': datetime.utcnow() + timedelta(minutes=20160),
            'iat': datetime.utcnow(),
            'session_id': session_id
        }
        user.session_id = session_id
        user.save()

        return jwt.encode(payload, settings.SECRET_KEY, 'HS256')

    def set_token_cookie(self, response, token):
        max_age = 20160 * 60
        expires = datetime.strftime(
            datetime.utcnow() + timedelta(seconds=max_age), "%a, %d-%b-%Y %H:%M:%S GMT")
        get_token(self.request)  # add csrf_token
        encoded_token = encrypt(token)
        response.set_cookie('deal_key', encoded_token, max_age=max_age,
                            expires=expires, httponly=True, secure=True, samesite='None')


class UserView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        response_data = {}
        response_data.update({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "wallet": user.wallet_address,
        })
        return Response(response_data)


class LogoutView(APIView):
    def post(self, request):
        response = Response()

        response.delete_cookie('deal_key', samesite='None')
        response.delete_cookie('csrftoken', samesite='None')

        response.data = {
            'message': 'success'
        }
        return response


class DeleteUser(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user

        if user is None:
            return

        user.delete()

        response = Response()
        response.data = {
            'message': 'success'
        }
        return response


class CheckNameIsAvailable(APIView):
    def post(self, request):
        name = request.data.get('name')

        if len(name) > 16:
            return Response({"error": "username is exceeded 15 charactors"}, status=status.HTTP_400_BAD_REQUEST)
        if len(name) < 3:
            return Response({"error": "username is less then 3 charactors"}, status=status.HTTP_400_BAD_REQUEST)
        if ' ' in name:
            return Response({"error": "username conatins space"}, status=status.HTTP_400_BAD_REQUEST)

        if not name:
            return Response({'error': 'username is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(name_lower=name.lower()).exists():
            return Response({'error': "username is taken"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response()
