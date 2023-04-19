from django.db.models.aggregates import Count
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions, status
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .filters import RoomFilter
from .models import Apartment, Contract, CustomUser, Review, Room, RoomImage, Bill
from .permissions import IsApartmentOwner
from . import serializers
from business.pagination import DefaultPagination
from django.middleware import csrf
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.views import APIView


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

class ApartmentViewSet(ModelViewSet):
    queryset = Apartment.objects.annotate(rooms_count=Count('rooms')).all()
    serializer_class = serializers.ApartmentSerializer
    #permission_classes = [IsAdminOrReadOnly]

    def create(self, request, *args, **kwargs):
        if request.user.is_authenticated and request.user.user_type != 'owner':
            return Response({'error': 'Only owners can create apartments.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
class RoomImageViewSet(ModelViewSet):
    serializer_class = serializers.RoomImageSerializer

    def get_serializer_context(self):
        return {'room_id': self.kwargs['room_pk']}

    def get_queryset(self):
        return RoomImage.objects.filter(room_id=self.kwargs['room_pk'])

class CustomUserViewSet(ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = serializers.CustomUserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data['username']
        if CustomUser.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class ContractViewSet(ModelViewSet):
    queryset = Contract.objects.all()
    serializer_class = serializers.ContractSerializer

    def create(self, request, *args, **kwargs):
        if request.user.is_authenticated and request.user.user_type != 'owner':
            return Response({'error': 'Only owners can create Contracts.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class BillViewSet(ModelViewSet):
    serializer_class = serializers.BillSerializer
    permission_classes = [permissions.IsAuthenticated, IsApartmentOwner]

    def get_queryset(self):
        """
        Return bills for the current user's owned apartments, or bills for apartments that the current user rents.
        """
        user = self.request.user
        owned_apartments = user.apartments_owned.all()
        rented_apartments = user.rooms_rented.all()
        return Bill.objects.filter(apartment__in=list(owned_apartments) + list(rented_apartments))

    def perform_create(self, serializer):
        """
        Set the created_by field to the current user.
        """
        serializer.save(created_by=self.request.user)

class ReviewViewSet(ModelViewSet):
    serializer_class = serializers.ReviewSerializer

    def get_queryset(self):
        if 'room_pk' in self.kwargs:
            return Review.objects.filter(room_id=self.kwargs['room_pk'])
        else:
            return Review.objects.all()

    def get_serializer_context(self):
        if 'room_pk' in self.kwargs:
            return {'room_id': self.kwargs['room_pk']}
        else:
            return {}

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class LoginView(APIView):
    def post(self, request, format=None):
        data = request.data
        response = Response()        
        username = data.get('username', None)
        password = data.get('password', None)
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                data = get_tokens_for_user(user)
                response.set_cookie(
                    key = settings.SIMPLE_JWT['AUTH_COOKIE'], 
                    value = data["access"],
                    expires = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                    secure = settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    httponly = settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    samesite = settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
                )
                csrf.get_token(request)
                response.data = {"Success" : "Login successfully","data":data}
                return response
            else:
                return Response({"No active" : "This account is not active!!"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"Invalid" : "Invalid username or password!!"}, status=status.HTTP_404_NOT_FOUND)




