from rest_framework import serializers

from .models import Map

class MapSerializer(serializers.ModelSerializer):
    class Meta:
        model = Map
        fields = (
            "id",
            "name",
            "get_image",
            "get_thumbnail",
            "matches_played",
            "rounds_won_by_t",
            "rounds_won_by_ct"
        )