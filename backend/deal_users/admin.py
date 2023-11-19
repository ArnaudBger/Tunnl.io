from django.contrib import admin
from .models import User,  EmailVerificationCode


# Register your models here.
admin.site.register(User)
admin.site.register(EmailVerificationCode)
