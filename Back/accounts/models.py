from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .managers import UserManager
from django.utils import timezone


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    image = models.ImageField()
    full_name = models.CharField(max_length=255, null=True, blank=True)
    summary = models.TextField(null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return f'{self.email}'

    def has_perm(self, perm, obj = ...):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin


class OtpCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='codes')
    code = models.PositiveSmallIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    code_expiry = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email}'s Code"

    def is_valid(self, code):
        if self.is_used:
            return False

        if self.code != code:
            return False

        if timezone.now() > self.code_expiry:
            self.delete()
            return False

        return True

    @classmethod
    def clean_expired_codes(cls):
        cls.objects.filter(models.Q(is_used=True) | models.Q(code_expiry__lt=timezone.now())).delete()
