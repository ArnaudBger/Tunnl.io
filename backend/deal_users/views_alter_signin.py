from django.shortcuts import redirect
from rest_framework import status, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponseRedirect, HttpResponse

import uuid
from datetime import datetime
from django.conf import settings
from .encryption import encrypt, decrypt
from .models import User
from .sendwelcomeemail import send_welcome_email as swe
from django.middleware.csrf import get_token
from random import randint
from datetime import datetime, timedelta
import jwt

from .google_strategy import PublicApi, GoogleRawLoginFlowService


class GoogleLoginRedirectApi(PublicApi):
    def get(self, request, *args, **kwargs):

        google_login_flow = GoogleRawLoginFlowService()

        authorization_url, state = google_login_flow.get_authorization_url()

        request.session["google_oauth2_state"] = state

        return redirect(authorization_url)


class GoogleLoginApi(PublicApi):
    class InputSerializer(serializers.Serializer):
        code = serializers.CharField(required=False)
        error = serializers.CharField(required=False)
        state = serializers.CharField(required=False)

    def get(self, request, *args, **kwargs):
        input_serializer = self.InputSerializer(data=request.GET)
        input_serializer.is_valid(raise_exception=True)
        validated_data = input_serializer.validated_data

        error, code, state = validated_data.get(
            "error"), validated_data.get("code"), validated_data.get("state")
        if error or not (code and state):
            return Response({"error": error or "Code and state are required."}, status=status.HTTP_400_BAD_REQUEST)

        if request.session.get("google_oauth2_state", "") != state:
            return Response({"error": "CSRF check failed."}, status=status.HTTP_400_BAD_REQUEST)

        google_login_flow = GoogleRawLoginFlowService()
        google_tokens = google_login_flow.get_tokens(code=code)
        id_token_decoded = google_tokens.decode_id_token()
        user_info = google_login_flow.get_user_info(
            google_tokens=google_tokens)

        name = id_token_decoded['given_name']

        if len(name) > 20:
            name = name[0:20]

        name = name.replace(' ', '')

        if User.objects.filter(name_lower=name.lower()).exists():
            name = name + str(randint(1000, 99999))

        user, created = User.objects.get_or_create(email=id_token_decoded["email"], defaults={
            'name': name,
            'password': str(uuid.uuid4()),
            'session_id': str(uuid.uuid4()),
            'is_active': True
        })

        if created:
            user.image_url = user_info['picture']
            user.save()
            swe(user.email, user.name)
            self.transfer_guest_data_to_user(request, user)

        return self.create_login_response(request, user)

    @staticmethod
    def create_login_response(request, user):
        session_id = str(uuid.uuid4())
        payload = {
            'id': user.id,
            'exp': datetime.utcnow() + timedelta(minutes=20160),
            'iat': datetime.utcnow(),
            'session_id': session_id
        }
        user.session_id = session_id
        user.save()
        token = jwt.encode(payload, settings.SECRET_KEY, 'HS256')
        response = HttpResponseRedirect(settings.FRONT_URL)
        encoded_token = encrypt(token)
        max_age = 20160 * 60
        expires = datetime.strftime(
            datetime.utcnow() + timedelta(seconds=max_age), "%a, %d-%b-%Y %H:%M:%S GMT")
        get_token(request)
        response.set_cookie('deal_key', encoded_token, max_age=max_age, expires=expires, httponly=True, secure=True,
                            samesite='None')
        return response
