from django.urls import path, include

from rest_framework import routers

from .views import MapViewSet

router = routers.DefaultRouter()
router.register(r'maps', MapViewSet)

urlpatterns = [
    path('tournament/', include(router.urls)),
]
