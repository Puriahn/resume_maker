from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)


urlpatterns = [
    path('register/', views.UserRegisterView.as_view(), name="user-register"),
    path('verify/', views.UserVerifyOtp.as_view(), name="user-register"),
    path('resend-code/', views.ResendOtpView.as_view(), name='resend-ptp-code'),

    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    # path('skills/add/', views.AddSkillView.as_view(), name='add-skill'),
    # path('educations/add/', views.AddEducationView.as_view(), name='add-edu'),
    # path('experiences/add/', views.AddExperienceView.as_view(), name='add-experience'),
    # path('summary/add/', views.AddSummaryView.as_view(), name='add-summary'),

    path('list-users/', views.UserListView.as_view(), name="user-list"),
    path('jwt/login/', TokenObtainPairView.as_view(), name="jwt-create"),
    path('jwt/refresh/', TokenRefreshView.as_view(), name="jwt-refresh"),
]