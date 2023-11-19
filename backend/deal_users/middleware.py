from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from .models import User
from django.conf import settings
from .encryption import decrypt
from jwt.exceptions import InvalidTokenError
from urllib.parse import parse_qs
from rest_framework_api_key.models import APIKey
import jwt


class CustomAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = scope.get('query_string', b'').decode()
        params = parse_qs(query_string)
        api_key_valid = False

        scope['user'] = AnonymousUser()

        if 'token' in params:
            try:
                token_key = params['token'][0]
                token_key = decrypt(token_key)
                user_jwt = jwt.decode(
                    token_key, settings.SECRET_KEY, algorithms=['HS256'])
                scope['user'] = await self.get_user(user_jwt['id'])
            except InvalidTokenError:
                pass

        elif 'api-key' in params:
            try:
                api_key = params['api-key'][0]
                if not api_key:
                    scope['api_key_valid'] = False
                try:
                    api_key_valid = await self.verify_api_key(api_key)
                    scope['api_key_valid'] = api_key_valid
                except:
                    scope['api_key_valid'] = False
                    print("Exception in verifying API Key.")

            except Exception as e:
                print("error:", str(e))

        return await super().__call__(scope, receive, send)

    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return AnonymousUser()

    @database_sync_to_async
    def verify_api_key(self, api_key):
        try:
            APIKey.objects.get_from_key(api_key)
            return True
        except APIKey.DoesNotExist:
            print("API Key does not exist.")
            return False
        except Exception as e:
            print("Unexpected error in verify_api_key: ", e)
            return False
