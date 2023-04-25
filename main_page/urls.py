from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_nested import routers
<<<<<<< HEAD
from . import views
=======
from core.views import CustomUserViewSet
import login.views
>>>>>>> d0724f7 (moreChanges to the login, create delete,)


class APIRoot(APIView):
    def get(self, request, format=None):
<<<<<<< HEAD
        return Response({
            'core': request.build_absolute_uri('/core/'),
            'owner': request.build_absolute_uri('/owner/'),
            'search': request.build_absolute_uri('/searcher/'),
            'renter': request.build_absolute_uri('/renter/'),
            'login': request.build_absolute_uri('/login/'),
            
        })


router = routers.DefaultRouter()
router.register('login', views.LoginViewSet, basename='login')
=======
        return Response(
            {
                "core": request.build_absolute_uri("/core/"),
                "owner": request.build_absolute_uri("/owner/"),
                "search": request.build_absolute_uri("/searcher/"),
                "renter": request.build_absolute_uri("/renter/"),
                "login": request.build_absolute_uri("/login/"),
                "signup": request.build_absolute_uri("/signup/"),
            }
        )


router = routers.DefaultRouter()
router.register("login", login.views.LoginViewSet, basename="login")
router.register("signup", CustomUserViewSet, basename="signup")
>>>>>>> d0724f7 (moreChanges to the login, create delete,)

urlpatterns = [
                  # todo: ben
                  # path('', TemplateView.as_view(template_name='index.html')),
                  # path('api', APIRoot.as_view(), name='api-root')),
                  path('', APIRoot.as_view(), name='api-root'),
                  path('react/', views.react_view, name='react'),

              ] + router.urls
