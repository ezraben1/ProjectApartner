from django.shortcuts import get_object_or_404, render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet
from business import serializers
from business. models import Apartment, CustomUser, Room
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.filters import OrderingFilter, SearchFilter
from business.filters import RoomFilter
from business.pagination import DefaultPagination
from business.permissions import IsApartmentOwner

# Create your views here.

class ApartmentViewSet(ModelViewSet):
    serializer_class = serializers.ApartmentSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.user_type == 'owner':
            return Apartment.objects.filter(owner=self.request.user)
        else:
            raise PermissionDenied('Only owners can view their apartments.')

    def create(self, request, *args, **kwargs):
        if not request.user.is_authenticated or request.user.user_type != 'owner':
            return Response({'error': 'Only owners can create apartments.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
class RoomViewSet(ModelViewSet):
    queryset = Room.objects.prefetch_related('images').all()
    serializer_class = serializers.RoomSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = RoomFilter
    pagination_class = DefaultPagination
    search_fields = ['address', 'size']
    ordering_fields = ['price_per_month']

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def get_serializer_context(self):
        return {'request': self.request}

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated, IsApartmentOwner]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            apartment_id = serializer.validated_data.pop('apartment_id')
            apartment = get_object_or_404(Apartment, id=apartment_id)
            if apartment.owner != request.user:
                return Response({'error': 'Only owners can create rooms in this apartment.'}, status=status.HTTP_403_FORBIDDEN)
            renter_id = serializer.validated_data.pop('renter_id', None)
            if renter_id is not None:
                renter = get_object_or_404(CustomUser, id=renter_id, user_type='renter')
                serializer.validated_data['renter'] = renter
            serializer.validated_data['apartment'] = apartment
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_destroy(self, instance):
        if not instance.can_user_edit(self.request.user):
            return Response({'error': 'Only owners can delete this room.'}, status=status.HTTP_403_FORBIDDEN)
        if instance.contract:
            instance.contract.delete()
        instance.delete()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        if not instance.can_user_edit(request.user):
            return Response({'error': 'Only owners can update this room.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            apartment_id = serializer.validated_data.pop('apartment_id', None)
            if apartment_id is not None:
                apartment = get_object_or_404(Apartment, id=apartment_id)
                if apartment.owner != request.user:
                    return Response({'error': 'Only owners can update rooms in this apartment.'}, status=status.HTTP_403_FORBIDDEN)
                serializer.validated_data['apartment'] = apartment
            renter_id = serializer.validated_data.pop('renter_id', None)
            if renter_id is not None:
                renter = get_object_or_404(CustomUser, id=renter_id, user_type='renter')
                serializer.validated_data['renter'] = renter
            self.perform_update(serializer)
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)