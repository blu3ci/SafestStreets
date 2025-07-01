from django.urls import path
from .views import (
    CreateUserView,
    RetrieveUserView,
    IncidentMarkerView,
    IncidentMarkerListCreateView,
    IncidentMarkerListView,
    IncidentMarkerDeleteView,
    IncidentMarkerLikeView,
    MarkerTagListView,
    CreateMarkerView,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path("user/", RetrieveUserView.as_view(), name="list_user"),
    path("user/register/", CreateUserView.as_view(), name="register"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path(
        "marker/create/", IncidentMarkerListCreateView.as_view(), name="create_marker"
    ),
    path("marker/tags/", MarkerTagListView.as_view(), name="tags"),
    path("marker/tag/create/", CreateMarkerView.as_view(), name="tag_create"),
    path("marker/<int:pk>/", IncidentMarkerView.as_view(), name="marker"),
    path(
        "marker/delete/<int:pk>/",
        IncidentMarkerDeleteView.as_view(),
        name="delete_marker",
    ),
    path(
        "marker/rating/<slug:rating_type>/<int:pk>/",
        IncidentMarkerLikeView.as_view(),
        name="like_marker",
    ),
    path("markers/", IncidentMarkerListView.as_view(), name="markers"),
]
