from django.contrib import admin

from .models import UserInformation, Team

# Register your models here.
admin.site.register(UserInformation)
admin.site.register(Team)
