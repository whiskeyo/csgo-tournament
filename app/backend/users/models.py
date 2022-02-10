from django.db import models
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.utils import timezone


class UserManager(BaseUserManager):
    def _create_user(self, username, email, password, is_staff, is_superuser, **extra_fields):
        current_time = timezone.now()

        if not username:
            raise ValueError('Field \'username\' must be set.')

        if not password:
            raise ValueError('Field \'password\' must be set.')

        if not email:
            raise ValueError('Field \'email\' must be set.')

        user = self.model(username=username, email=self.normalize_email(email), is_staff=is_staff,
                          is_superuser=is_superuser, last_login=current_time, date_joined=current_time,
                          **extra_fields)

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, email=None, password=None, **extra_fields):
        return self._create_user(username, email, password, False, False, **extra_fields)

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        return self._create_user(username, email, password, True, True, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=30, unique=True)
    email = models.EmailField(max_length=250, unique=True)
    first_name = models.CharField(max_length=40, blank=True, null=True)
    last_name = models.CharField(max_length=40, blank=True, null=True)
    steam_url = models.URLField(max_length=250, blank=True, null=True)
    profile_image_url = models.ImageField(upload_to="uploads/", blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)

    date_joined = models.DateField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.email + ' (' + self.username + ')'
