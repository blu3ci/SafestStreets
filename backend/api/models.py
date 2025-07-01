from django.db import models
from django.contrib.auth.models import User
from django.contrib import admin


# Create your models here.
class MarkerTag(models.Model):
    name = models.CharField(max_length=50, primary_key=True)


class IncidentMarker(models.Model):
    longitude = models.FloatField()
    latitude = models.FloatField()
    created_at = models.DateField(auto_now_add=True)
    description = models.CharField(max_length=300, blank=True)
    reporter = models.ForeignKey(User, on_delete=models.CASCADE)
    likes = models.ManyToManyField(User, related_name="marker_likes", blank=True)
    dislikes = models.ManyToManyField(User, related_name="marker_dislikes", blank=True)
    tags = models.ManyToManyField(MarkerTag, related_name="marker_tags", blank=True)

    def get_likes(self):
        return self.likes.count()

    def get_dislikes(self):
        return self.dislikes.count()

    def update_likes(self, user):
        if self.dislikes.filter(id=user.id):
            self.dislikes.remove(user)

        if self.likes.filter(id=user.id):
            self.likes.remove(user)
        else:
            self.likes.add(user)

    def update_dislikes(self, user):
        if self.likes.filter(id=user.id):
            self.likes.remove(user)

        if self.dislikes.filter(id=user.id):
            self.dislikes.remove(user)
        else:
            self.dislikes.add(user)

    def __str__(self):
        return f"{self.latitude}, {self.longitude}"


admin.site.register(MarkerTag)
admin.site.register(IncidentMarker)
