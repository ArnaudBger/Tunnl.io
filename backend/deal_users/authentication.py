from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed,  ParseError
from django.conf import settings
from .encryption import decrypt
from .models import User
import jwt


class BaseJWTAuthentication(BaseAuthentication):
    keyword = "deal_key"

    def get_user_from_payload(self, payload):
        user_id = payload['id']

        user = User.objects.filter(id=user_id).first()
        session_id = payload.get('session_id')
        if session_id != user.session_id:
            raise ParseError(
                'Multiple devices detected. Please log out from other devices and try login again!')
        return user

    def authenticate_key(self, request):
        key = request.COOKIES.get(self.keyword)
        if not key:
            return None

        try:
            key = decrypt(key)
            payload = jwt.decode(key, settings.SECRET_KEY,
                                 algorithms=['HS256'])
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')

        return payload, key


class JWTAuthentication(BaseJWTAuthentication):

    def authenticate(self, request):
        payload, key = self.authenticate_key(request)
        user = self.get_user_from_payload(payload)

        if not user:
            raise AuthenticationFailed('User not found!')

        return user, key
