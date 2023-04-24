from django.urls import path
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_nested import routers
import login.views


class APIRoot(APIView):
    def get(self, request, format=None):
        return Response(
            {
                "core": request.build_absolute_uri("/core/"),
                "owner": request.build_absolute_uri("/owner/"),
                "search": request.build_absolute_uri("/searcher/"),
                "renter": request.build_absolute_uri("/renter/"),
                "login": request.build_absolute_uri("/login/"),
            }
        )


router = routers.DefaultRouter()
router.register("login", login.views.LoginViewSet, basename="login")

urlpatterns = [
    path("", APIRoot.as_view(), name="api-root"),
] + router.urls
