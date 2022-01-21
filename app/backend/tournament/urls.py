from django.urls import path, include

from tournament import views

urlpatterns = [
    path('all-maps/', views.MapsList.as_view()),
]