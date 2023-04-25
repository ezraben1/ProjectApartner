from django.urls import path
from rest_framework_nested import routers
from . import views

app_name = "core"

custom_router = routers.DefaultRouter()
custom_router.register("me", views.CustomUserViewSet, basename="me")
custom_router.register("test", views.PublicRoomViewSet, basename="test")

urlpatterns = []
urlpatterns += custom_router.urls
