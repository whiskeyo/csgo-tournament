from django.contrib.auth.models import update_last_login

from rest_framework import generics, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token

from .models import User
from .serializers import LoginUserSerializer, RegisterUserSerializer


# class RegisterView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     permission_classes = (AllowAny, )
#     serializer_class = RegisterUserSerializer

# class UserView(viewsets.ModelViewSet):
#     queryset = User.objects.all()


class RegisterView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = (AllowAny, )
    serializer_class = RegisterUserSerializer
    # http_method_names = ['post']


class LoginView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = (AllowAny, )
    serializer_class = LoginUserSerializer
    # http_method_names = ['post']

    def create(self, request):
        serializer = LoginUserSerializer(data=request.data,
                                         context={'request': request})

        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        update_last_login(None, user)

        return Response({
            "status": status.HTTP_200_OK,
            "Token": token.key
        })

# class LoginView(APIView):
#     def post(self, request, *args, **kwargs):
#         serializer = LoginUserSerializer(data=request.data,
#                                          context={'request': request})

#         serializer.is_valid(raise_exception=True)
#         user = serializer.validated_data['user']
#         token, created = Token.objects.get_or_create(user=user)
#         update_last_login(None, user)

#         return Response({
#             "status": status.HTTP_200_OK,
#             "Token": token.key
#         })


class EditView(generics.CreateAPIView):
    pass
