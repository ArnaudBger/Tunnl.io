from django.urls import path
from .views_general import CheckLikesForInsPost, LoginView, LoginWithCodeView, UserView, LogoutView, CheckNameIsAvailable
from .views_alter_signin import GoogleLoginRedirectApi, GoogleLoginApi
from .views_signup import RegisterEmailView, RegisterResendEmailView, CheckEmailVerificationCodeView, CompleteEmailRegistrationView
from .views_change import ChangePasswordView, UpdateEmailView, VerifyUpdateEmailView, UpdateProfilePicView, UpdateUserNameView
from .views_reset import ResetPasswordEmailView, ResetPasswordResendEmailView, CheckEmailResetPasswordVerificationCodeView, CompleteEmailResetPasswordView

urlpatterns = [
    path('register/sendemailverification/', RegisterEmailView.as_view()),
    path('register/resendemailverification/',
         RegisterResendEmailView.as_view()),
    path('register/checkemailverification/',
         CheckEmailVerificationCodeView.as_view()),
    path('register/completeemailregistration/',
         CompleteEmailRegistrationView.as_view()),

    path('checkLikesForInsPost/<str:url>/', CheckLikesForInsPost.as_view()),
    path('update/username/',
         UpdateUserNameView.as_view()),
    path('update/userpassword/',
         ChangePasswordView.as_view()),
    path('update/useremailrequest/',
         UpdateEmailView.as_view()),
    path('update/useremail/',
         VerifyUpdateEmailView.as_view()),
    path('update/userprofilepic/',
         UpdateProfilePicView.as_view()),

    path('reset/sendemailverification/', ResetPasswordEmailView.as_view()),
    path('reset/resendemailverification/',
         ResetPasswordResendEmailView.as_view()),
    path('reset/checkemailverification/',
         CheckEmailResetPasswordVerificationCodeView.as_view()),
    path('reset/completeemailreset/',
         CompleteEmailResetPasswordView.as_view()),

    path('login/', LoginView.as_view()),
    path('codelogin/', LoginWithCodeView.as_view()),
    path('user/', UserView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('checkname/', CheckNameIsAvailable.as_view()),
    path('googlelogin/', GoogleLoginRedirectApi.as_view()),
    path('google-callback/', GoogleLoginApi.as_view()),

]
