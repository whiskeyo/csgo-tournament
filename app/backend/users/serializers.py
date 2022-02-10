from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth import password_validation, authenticate

from .models import User


class RegisterUserSerializer(serializers.Serializer):
    username = serializers.CharField(required=True,
                                     validators=[UniqueValidator(queryset=User.objects.all())])
    email = serializers.EmailField(required=True,
                                   validators=[UniqueValidator(queryset=User.objects.all())])
    password = serializers.CharField(required=True, write_only=True,
                                     validators=[password_validation.validate_password])
    password2 = serializers.CharField(required=True, write_only=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    steam_url = serializers.URLField(required=False, allow_blank=True)
    birth_date = serializers.DateField(required=False, allow_null=True)

    class Meta:
        model = User
        # fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name',
        #           'profile_image_url', 'birth_date')
        extra_kwargs = {}

    def save(self):
        user = User(username=self.validated_data['username'],
                    email=self.validated_data['email'])

        if self.validated_data['password'] != self.validated_data['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})

        user.set_password(self.validated_data['password'])
        user.save()

        return user


class LoginUserSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=30)
    password = serializers.CharField(validators=[password_validation.validate_password])

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(request=self.context.get('request'),
                                username=username, password=password)

            if not user:
                raise serializers.ValidationError({"error": "Cannot log in with given username and password."})

        else:
            raise serializers.ValidationError({"error": "Username and/or password were not provided."})

        data['user'] = user
        return data
