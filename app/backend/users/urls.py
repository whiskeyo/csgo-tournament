from django.urls import path, include

from rest_framework import routers

from .views import RegisterView, LoginView

router = routers.DefaultRouter()
router.register(r'login', LoginView, basename='login')
router.register(r'register', RegisterView, basename='register')

urlpatterns = [
    path('', include(router.urls)),
    # path('login/', LoginView.as_view()),
]


# urlpatterns = [
#     path('login/', views.LoginView.as_view()),
#     path('register/', views.RegisterView.as_view()),
# ]
