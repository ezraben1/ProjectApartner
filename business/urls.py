from django.urls import path
from rest_framework_nested import routers
from . import views

app_name = 'business'

router = routers.DefaultRouter()
router.register('search', views.SearchView, basename='search')
router.register('users', views.CustomUserViewSet, basename= 'users')
router.register('bills', views.BillViewSet, basename='bills')

users_router = routers.NestedSimpleRouter(router, 'users', lookup='user')
users_router.register('', views.CustomUserViewSet, basename='user')

#rooms_router = routers.NestedSimpleRouter(router, 'rooms', lookup='room')
#rooms_router.register('reviews', views.ReviewViewSet,basename='room-reviews')
#rooms_router.register('images', views.RoomImageViewSet, basename='room-images')

urlpatterns = [
    path('search/<int:room_id>/contract/<int:pk>/', views.ContractViewSet.as_view({'get': 'retrieve'}), name='contract-detail'),
    path('search/<int:room_id>/review/<int:pk>/', views.ReviewViewSet.as_view({'get': 'retrieve'}), name='contract-detail'),


] + router.urls + users_router.urls #+rooms_router.urls#
