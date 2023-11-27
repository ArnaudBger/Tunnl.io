from rest_framework import serializers
from .models import (
    User,  EmailVerificationCode, 
    EmailChange
)
from datetime import date


class UserCreateSerializer(serializers.ModelSerializer):
    birthdayMonth = serializers.IntegerField(
        required=False, min_value=1, max_value=12, allow_null=True)
    birthdayYear = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'phone', 'password',
                  'birthdayMonth', 'birthdayYear', 'session_id']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        birthday_month = validated_data.pop('birthdayMonth', None)
        birthday_year = validated_data.pop('birthdayYear', None)
        if birthday_month and birthday_year:
            validated_data['birthday'] = date(birthday_year, birthday_month, 1)
        else:
            validated_data['birthday'] = None
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        birthday_month = validated_data.pop('birthdayMonth', None)
        birthday_year = validated_data.pop('birthdayYear', None)

        if birthday_month and birthday_year:
            validated_data['birthday'] = date(birthday_year, birthday_month, 1)
        else:
            validated_data['birthday'] = None

        instance = super().update(instance, validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
