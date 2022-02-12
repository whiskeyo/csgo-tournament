from django.contrib.auth import logout
from django.contrib.auth.models import User, update_last_login

from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, action
from rest_framework.authtoken.models import Token

from .models import UserInformation, Team
from .serializers import LoginSerializer, UserInformationSerializer, \
    RegisterSerializer, UserSerializer, TeamSerializer


@api_view(['POST'])
def user_login(request):
    """
    API request to log in the user.
    """
    if request.method == 'POST':
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            update_last_login(None, user)
            return Response({"Token": token.key}, status=status.HTTP_200_OK)

        return Response(serializer.error_messages,
                        status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def user_logout(request):
    """
    API request to log out the user.
    """
    if request.method == 'POST':
        logout(request)
        return Response(status=status.HTTP_200_OK)


@api_view(['POST'])
def user_register(request):
    """
    API request to register new user.
    """
    if request.method == 'POST':
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid(raise_exception=ValueError):
            serializer.create(validated_data=request.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.error_messages,
                        status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH', 'DELETE'])
def user_details(request, pk):
    """
    API request to either get single user details, update existing ones or delete user.
    """
    print("user_details called\ndata: {}\npk: {}".format(request.data, pk))
    try:
        user = User.objects.get(pk=pk)
        user_info = UserInformation.objects.get(user=user)
        print("user data: {}\nuser_info data: {}".format(user, user_info))
    except User.DoesNotExist or UserInformation.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        user_information_serializer = UserInformationSerializer(user_info)
        return Response(user_information_serializer.data,
                        status=status.HTTP_200_OK)

    if request.method == 'PATCH':
        # user_data = request.data.pop('user')
        user_serializer = UserSerializer(user, data=request.data, partial=True)
        if user_serializer.is_valid(raise_exception=True):
            user_serializer.save()
        else:
            return Response(user_serializer.error_messages,
                            status=status.HTTP_400_BAD_REQUEST)

        user_information_serializer = UserInformationSerializer(user_info, data=request.data, partial=True)
        if user_information_serializer.is_valid(raise_exception=True):
            user_information_serializer.save()
        else:
            return Response(user_information_serializer.error_messages,
                            status=status.HTTP_400_BAD_REQUEST)

        return Response(user_information_serializer.data, status=status.HTTP_200_OK)

    if request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def user_list(request):
    user_info = UserInformation.objects.all()
    serializer = UserInformationSerializer(user_info, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    # http_method_names = ['get', 'post', 'patch']
