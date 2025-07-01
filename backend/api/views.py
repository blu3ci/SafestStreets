from .models import IncidentMarker, MarkerTag
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import (
    UserSerializer,
    IncidentMarkerSerializer,
    MarkerTagSerializer
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404


# Create your views here.
class RetrieveUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class IncidentMarkerView(generics.RetrieveAPIView):
    serializer_class = IncidentMarkerSerializer
    queryset = IncidentMarker.objects.all()
    permission_classes = [AllowAny]
    
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)


class IncidentMarkerListView(generics.ListAPIView):
    serializer_class = IncidentMarkerSerializer
    queryset = IncidentMarker.objects.all()
    permission_classes = [AllowAny]


class IncidentMarkerListCreateView(generics.ListCreateAPIView):
    serializer_class = IncidentMarkerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return IncidentMarker.objects.filter(reporter=self.request.user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(reporter=self.request.user)
        else:
            Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class IncidentMarkerDeleteView(generics.DestroyAPIView):
    serializer_class = IncidentMarkerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return IncidentMarker.objects.filter(reporter=user)


class IncidentMarkerLikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, rating_type, pk):
        marker = get_object_or_404(IncidentMarker, pk=pk)
        rating_type = rating_type.lower()

        if rating_type not in ["like", "dislike"]:
            return Response(
                {"detail": "invalid rating_type param"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if rating_type == "like":
            marker.update_likes(request.user)
        elif rating_type == "dislike":
            marker.update_dislikes(request.user)

        return Response(IncidentMarkerSerializer(marker).data)

class MarkerTagListView(generics.ListAPIView):
    serializer_class = MarkerTagSerializer
    queryset = MarkerTag.objects.all()
    permission_classes = [AllowAny]
    
class CreateMarkerView(generics.CreateAPIView):
    queryset = MarkerTag.objects.all()
    serializer_class = MarkerTagSerializer
    permission_classes = [AllowAny]