from django.urls import path, include

from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'teams', views.TeamViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path(r'login/', views.user_login),
    path(r'logout/', views.user_logout),
    path(r'register/', views.user_register),
    path(r'details/<int:pk>/', views.user_details),
    path(r'list/', views.user_list)
]
