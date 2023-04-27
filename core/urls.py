from django.urls import path
from rest_framework_nested import routers
from . import views

app_name = "core"

custom_router = routers.DefaultRouter()
custom_router.register("me", views.CustomUserViewSet, basename="me")
<<<<<<< HEAD
<<<<<<< HEAD
custom_router.register("search", views.ApartmentViewSet, basename="search")

=======
custom_router.register("test", views.PublicRoomViewSet, basename="test")
>>>>>>> d0724f7 (moreChanges to the login, create delete,)
=======
custom_router.register("feed", views.PublicRoomViewSet, basename="feed")
>>>>>>> fd03c1a (added room and apartment delete and change, need)

urlpatterns = []
urlpatterns += custom_router.urls
