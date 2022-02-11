from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from django.contrib.auth import password_validation, authenticate
from django.contrib.auth.models import User, BaseUserManager

from .models import UserInformation, Team


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(request=self.context.get('request'),
                                username=username,
                                password=password)

            if not user:
                raise serializers.ValidationError({"auth": "Cannot log in using provided credentials."})

        else:
            raise serializers.ValidationError({"error": ["Logging in requires providing both username and password."]})

        data['user'] = user
        return data


class RegisterSerializer(serializers.Serializer):
    """
    Serializer for User's built-in fields and related UserInformation fields.
    """
    username = serializers.CharField(required=True,
                                     validators=[UniqueValidator(queryset=User.objects.all())])
    email = serializers.EmailField(required=True,
                                   validators=[UniqueValidator(queryset=User.objects.all())])
    password1 = serializers.CharField(required=True, write_only=True,
                                      validators=[password_validation.validate_password])
    password2 = serializers.CharField(required=True, write_only=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    steam_url = serializers.URLField(required=False, allow_blank=True, allow_null=True,
                                     validators=[UniqueValidator(queryset=UserInformation.objects.all())])
    birth_date = serializers.DateField(required=False, allow_null=True)
    description = serializers.CharField(required=False, allow_blank=True)

    def create(self, validated_data):
        """
        Function to create User and UserInformation models in DB after getting correct
        register request.
        """
        user = User(username=validated_data['username'],
                    email=BaseUserManager.normalize_email(validated_data['email']),
                    first_name=validated_data['first_name'],
                    last_name=validated_data['last_name'])

        if validated_data['password1'] == validated_data['password2']:
            user.set_password(validated_data['password1'])
        else:
            raise serializers.ValidationError({"password": ["Passwords do not match"]})

        user.save()

        UserInformation.objects.filter(user=user).update(steam_url=validated_data['steam_url'],
                                                         description=validated_data['description'],
                                                         birth_date=validated_data['birth_date'])

        return validated_data


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class UserInformationSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=True)

    class Meta:
        model = UserInformation
        fields = ['user', 'description', 'birth_date', 'steam_url']

    def create(self, validated_data):
        print("UserInformationSerializer create called")
        user_data = validated_data.pop('user')
        user = UserSerializer.create(UserSerializer(), validated_data=user_data)
        user_info, created = UserInformation.objects.update_or_create(user=user,
                                                                      steam_url=validated_data['steam_url'],
                                                                      description=validated_data['description'],
                                                                      birth_date=validated_data['birth_date'])

        return user_info

    def update(self, instance, validated_data):
        print("UserInformationSerializer update called")
        print("instance: {}\nvalidated_data: {}".format(instance, validated_data))

        def get_field_or_none(name: str, validated_data):
            return validated_data.get(name) if validated_data.get(name) else None

        first_name = get_field_or_none('first_name', validated_data)
        last_name = get_field_or_none('last_name', validated_data)

        if first_name:
            self.user.first_name = first_name
        if last_name:
            self.user.last_name = last_name

        if self.user.is_valid(raise_exception=True):
            user = self.user.update()
            validated_data['user'] = user

        # if validated_data.get('user'):
        #     user_data = validated_data.get('user')
        #     user_serializer = UserSerializer(data=user_data)

        #     if user_serializer.is_valid():
        #         user = user_serializer.update(instance=instance.user,
        #                                       validated_data=user_serializer.validated_data)
        #         validated_data['user'] = user
        # user_serializer = self.fields['user']
        # user_instance = instance.user
        # user_data = validated_data.pop('user')

        # user_serializer.update(user_instance, user_data)
        # user = User.objects.update(instance=user_instance, data=user_data)
        # user_info, updated = UserInformation.objects.update(**validated_data)
        # # user = User.objects.update(user_instance, **user_data)
        # return user_info
        return super().update(instance, validated_data)


    # def save(self, validated_data):
    #     user_data = validated_data.pop('user')
    #     user = UserSerializer(self.user, validated_data=user_data)
    #     user_info = UserInformation.objects.filter(user=user)

    #     user_info.steam_url = validated_data['steam_url']
    #     user_info.description = validated_data['description']
    #     user_info.birth_date = validated_data['birth_date']
    #     print("user_info: ", user_info)
    #     user_info.save()

    #     return user_info


class TeamSerializer(serializers.HyperlinkedModelSerializer):
    pass
