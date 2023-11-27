import re
import uuid
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from .models import User, EmailChange
from random import randint
from django.utils import timezone
from .authentication import JWTAuthentication
from .sendverificationemail import send_verification_email as sve
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from PIL import Image
from django.core.files.base import ContentFile
from io import BytesIO
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


class UpdateUserNameView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        new_userName = request.data.get('new_user_name')

        if new_userName == user.name:
            return Response({"error": "new user name must not be the same as the old user name"}, status=status.HTTP_400_BAD_REQUEST)

        if new_userName is None or new_userName.strip() == "":
            return Response({"error": "user name must not be empty"}, status=status.HTTP_400_BAD_REQUEST)

        if ' ' in new_userName:
            return Response({"error": "username conatins space"}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_userName) > 20:
            return Response({"error": "user name is exceeded 20 charactors"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(name_lower=new_userName.lower()).exists():
            return Response({"error": "username has been taken"}, status=status.HTTP_400_BAD_REQUEST)

        user.name = new_userName
        user.save()

        return Response({"message": "user name updated successfully"}, status=status.HTTP_200_OK)


class ChangePasswordView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')

        if not user.check_password(old_password):
            return Response({"error": "Old password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Old Password is correct"}, status=status.HTTP_200_OK)

    def put(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if confirm_password != new_password:
            return Response({"error": "Password not match"}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(old_password):
            return Response({"error": "Old password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)

        if old_password == new_password:
            return Response({"error": "New password must not be the same as old password"}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 8:
            return Response({"error": "Password needs to have 8 characters."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)


class UpdateEmailView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @method_decorator(ratelimit(key='ip', rate='1/m', method='POST', block=True))
    def dispatch(self, *args, **kwargs):
        return super(UpdateEmailView, self).dispatch(*args, **kwargs)

    def post(self, request):
        new_email = request.data['email']
        lang = request.data['language']
        user = request.user

        existing_user = User.objects.filter(email=new_email).first()
        if existing_user:
            return Response({'error': 'User with this email already exists'}, status=400)

        EmailChange.objects.filter(user=user, new_email=new_email).delete()

        verification_code = randint(10000000, 99999999)
        expires_at = timezone.now() + timedelta(minutes=10)

        email_change = EmailChange(
            user=user,
            new_email=new_email,
            verification_code=verification_code,
            expires_at=expires_at
        )
        email_change.save()

        try:
            sve(toemail=new_email,
                verificationcode=verification_code, language=lang)
            return Response({'message': 'Email verification code sent'})
        except:
            return Response({'error': 'Please enter a valid email.'})


class VerifyUpdateEmailView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        code = request.data['code']
        user = request.user

        try:
            change_request = EmailChange.objects.get(
                user=user, verification_code=code, expires_at__gt=timezone.now())
        # except EmailChange.DoesNotExist:
        except:
            return Response({'error': 'Invalid or expired verification code'}, status=400)

        # If the new email is already taken, we return an error
        if User.objects.filter(email=change_request.new_email).exists():
            return Response({'error': 'Email is already taken'}, status=400)

        # Everything is fine, we can update the email
        user.email = change_request.new_email
        user.save()

        # Delete the change request as it's no longer needed
        change_request.delete()

        return Response({'message': 'Email updated successfully'})


class UpdateProfilePicView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        profile_pic = request.data.get('profile_pic')

        if not profile_pic:
            return Response({"error": "No profile picture provided"}, status=status.HTTP_400_BAD_REQUEST)

        img = Image.open(profile_pic)
        img.thumbnail((500, 500))
        img = img.convert("RGB")

        byte_arr = BytesIO()
        img.save(byte_arr, format='webp')
        hashed_user_id = uuid.uuid5(uuid.NAMESPACE_DNS, (str(user.id)))
        file_name = f'{hashed_user_id}={datetime.now().strftime("%Y%m%d%H%M%S")}.webp'
        file_object = ContentFile(byte_arr.getvalue(), name=file_name)
        if user.image:
            user.image.delete()
        user.image.save(file_name, file_object)
        user.save()
        image_url = user.image.url if user.image else None

        return Response({"message": "Profile picture updated successfully", "image": image_url}, status=status.HTTP_200_OK)
