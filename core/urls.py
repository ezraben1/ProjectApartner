from django.urls import path
from rest_framework_nested import routers
from . import views

app_name = "core"

custom_router = routers.DefaultRouter()
custom_router.register("me", views.CustomUserViewSet, basename="me")
<<<<<<< HEAD
custom_router.register("search", views.ApartmentViewSet, basename="search")

=======
custom_router.register("test", views.PublicRoomViewSet, basename="test")
>>>>>>> d0724f7 (moreChanges to the login, create delete,)

urlpatterns = []
urlpatterns += custom_router.urls
