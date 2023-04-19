from django.urls import path
from rest_framework_nested import routers
from . import views
from business.views import ContractViewSet, BillViewSet
app_name = 'owner'

router = routers.DefaultRouter()
router.register('owner-apartments', views.ApartmentViewSet, basename='apartments')
router.register('owner-rooms', views.RoomViewSet, basename='rooms')


rooms_router = routers.NestedSimpleRouter(router, 'owner-rooms', lookup='room')

urlpatterns = [
    path('owner-apartments/<int:apartment_id>/room/<int:pk>/', views.RoomViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy', 'post': 'create'}), name='room-detail'),
    path('owner-apartments/<int:apartment_id>/room/<int:room_id>/contract/<int:pk>/', ContractViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy', 'post': 'create'}), name='contract_detail'),
    path('owner-apartments/<int:apartment_id>/room/<int:room_id>/bill/<int:pk>/', BillViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy', 'post': 'create'}), name='contract_detail'),
    path('owner-rooms/<int:room_id>/contract/<int:pk>/', ContractViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy', 'post': 'create'}), name='contract_detail'),
    path('owner-rooms/<int:room_id>/bill/<int:pk>/', BillViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy', 'post': 'create'}), name='contract_detail'),
] + router.urls + rooms_router.urls 
