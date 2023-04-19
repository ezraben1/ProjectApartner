from django.urls import path
from rest_framework_nested import routers
from . import views

app_name = 'business'

router = routers.DefaultRouter()
router.register('rooms', views.RoomViewSet, basename='rooms')
router.register('apartments', views.ApartmentViewSet, basename='apartments')
router.register('users', views.CustomUserViewSet, basename= 'users')
router.register('bills', views.BillViewSet, basename='bills')

users_router = routers.NestedSimpleRouter(router, 'users', lookup='user')
users_router.register('', views.CustomUserViewSet, basename='user')

rooms_router = routers.NestedSimpleRouter(router, 'rooms', lookup='room')
rooms_router.register('reviews', views.ReviewViewSet,basename='room-reviews')
rooms_router.register('images', views.RoomImageViewSet, basename='room-images')

urlpatterns = [
    path('login/', views.LoginView.as_view(), name="login"),
    path('apartments/<int:apartment_id>/room/<int:room_id>/contract/<int:pk>/', views.ContractViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy', 'post': 'create'}), name='contract_detail'),
    path('apartments/<int:apartment_id>/room/<int:pk>/', views.RoomViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='room-detail'),
] + router.urls + rooms_router.urls + users_router.urls
