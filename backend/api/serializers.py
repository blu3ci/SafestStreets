from .models import IncidentMarker, MarkerTag
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        return token

class MarkerTagSerializer(serializers.ModelSerializer):
    class Meta:
        model =  MarkerTag
        fields = ["name"]

class IncidentMarkerSerializer(serializers.ModelSerializer):
    reporter = serializers.SlugRelatedField(read_only=True, slug_field="username")
    likes = serializers.IntegerField(read_only=True, source="get_likes")
    dislikes = serializers.IntegerField(read_only=True, source="get_dislikes")
    user_rating = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = IncidentMarker
        fields = [
            "id",
            "longitude",
            "latitude",
            "created_at",
            "description",
            "likes",
            "dislikes",
            "user_rating",
            "tags",
            "reporter",
        ]

    def get_user_rating(self, obj):
        req = self.context.get("request")
        if req and obj.likes.filter(id=req.user.id):
            return "like"
        elif req and obj.dislikes.filter(id=req.user.id):
            return "dislike"
        return "neutral"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
