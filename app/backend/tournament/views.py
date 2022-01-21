from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Map
from .serializers import MapSerializer

class MapsList(APIView):
    def get(self, request, format=None):
        maps = Map.objects.all()
        serializer = MapSerializer(maps, many=True)
        return Response(serializer.data)