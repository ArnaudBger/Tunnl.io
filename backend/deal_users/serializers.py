from rest_framework import serializers
from .models import (
    User,  EmailVerificationCode,
    EmailChange
)
from datetime import date


class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email',
                  'wallet_address', 'pri_key', 'session_id']

    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)
        instance.save()
        return instance
