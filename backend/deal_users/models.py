from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
import unicodedata


class CustomUserManager(BaseUserManager):
    def create_user(self, email=None, phone=None, password=None, **extra_fields):
        if not email and not phone:
            raise ValueError(
                'At least one of the Email or Phone fields must be set')

        if email:
            email = self.normalize_email(email)
            extra_fields['email'] = email

        if phone:
            extra_fields['phone'] = phone

        user = self.model(**extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class CaseInsensitiveFieldMixin:
    def get_prep_value(self, value):
        if value:
            normalized = unicodedata.normalize('NFKC', value).lower()
            return normalized
        return value


class LowerCharField(CaseInsensitiveFieldMixin, models.CharField):
    pass


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, editable=False)
    name = models.CharField(max_length=255, unique=True)
    name_lower = LowerCharField(
        max_length=255, unique=True, editable=False, null=True, blank=True)
    image = models.ImageField(
        upload_to='static/profile_pics', null=True, blank=True)
    image_url = models.URLField(blank=True, null=True)
    email = models.EmailField(
        max_length=255, null=True, unique=True, blank=True)
    password = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    signed_successful = models.BooleanField(default=False)
    session_id = models.CharField(max_length=36, blank=True, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def save(self, *args, **kwargs):
        self.name_lower = self.name
        super(User, self).save(*args, **kwargs)

    def __str__(self):
        if self.email:
            return self.email
        elif self.phone:
            return str(self.phone)
        else:
            return str(self.id)


class EmailVerificationCode(models.Model):
    email = models.EmailField(max_length=255)
    code = models.IntegerField()
    # 'register' or 'ResetPassword'
    purpose = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def __str__(self):
        if self.email:
            return f'{self.email} - {self.code}'
        else:
            return f'No email provided - {self.code}'


class EmailChange(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    new_email = models.CharField(max_length=255)
    verification_code = models.IntegerField()
    expires_at = models.DateTimeField()
