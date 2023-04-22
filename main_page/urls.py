from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_nested import routers
from . import views


class APIRoot(APIView):
    def get(self, request, format=None):
        return Response({
            'core': request.build_absolute_uri('/core/'),
            'owner': request.build_absolute_uri('/owner/'),
            'search': request.build_absolute_uri('/searcher/'),
            'renter': request.build_absolute_uri('/renter/'),
            'login': request.build_absolute_uri('/login/'),
        })


router = routers.DefaultRouter()
router.register('login', views.LoginViewSet, basename='login')

urlpatterns = [
                  # todo: ben
                  # path('', TemplateView.as_view(template_name='index.html')),
                  # path('api', APIRoot.as_view(), name='api-root')),
                  path('', APIRoot.as_view(), name='api-root'),
              ] + router.urls
