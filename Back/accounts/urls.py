from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)


urlpatterns = [
    path('register/', views.UserRegisterView.as_view(), name="user-register"),
    path('list/', views.UserListView.as_view(), name="user-list"),
    path('jwt/login/', TokenObtainPairView.as_view(), name="jwt-create"),
    path('jwt/refresh/', TokenRefreshView.as_view(), name="jwt-refresh"),
]