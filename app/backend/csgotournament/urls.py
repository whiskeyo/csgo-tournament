from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path(r'admin/', admin.site.urls),
    # path(r'api/v1/', include('djoser.urls')),
    # path(r'api/v1/', include('djoser.urls.authtoken')),
    path(r'api/v1/tournament/', include('tournament.urls')),
    path(r'api/v1/users/', include('users.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
