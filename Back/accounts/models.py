from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .managers import UserManager
from django.utils import timezone


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=11, null=True, blank=True)
    image = models.ImageField(null=True, blank=True)
    full_name = models.CharField(max_length=255, null=True, blank=True)
    job_title = models.CharField(max_length=255, null=True, blank=True)

    skills = models.ManyToManyField('Skill', blank=True)

    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)

    section_order = models.TextField(blank=True, default='header,summary,experience,education,skills')

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


class Summary(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='summary')
    description = models.TextField(null=True, blank=True)


class Education(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='educations')
    institute_name = models.CharField(max_length=255)
    date = models.CharField(max_length=255, null=True, blank=True)


class Experience(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='experiences')
    company_name = models.CharField(max_length=255)
    info = models.TextField(null=True, blank=True)
    date = models.CharField(max_length=255, null=True, blank=True)


class Skill(models.Model):
    name = models.CharField(max_length=200, unique=True)

    def __str__(self):
        return f'{self.name}'


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
