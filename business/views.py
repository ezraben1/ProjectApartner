from django.db.models.aggregates import Count
from django.shortcuts import get_object_or_404, redirect, render
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
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
from django.conf import settings
import jwt
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

class TokenRefreshView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response({'error': 'Refresh token not found'}, status=400)
        try:
            payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Refresh token has expired'}, status=400)
        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid refresh token'}, status=400)

        user_id = payload.get('user_id')
        access_token = jwt.encode({'user_id': user_id}, settings.SECRET_KEY, algorithm='HS256')
        response = Response({'success': True})
        response.set_cookie(key='access_token', value=access_token, httponly=True, secure=True, samesite='Strict', max_age=settings.ACCESS_TOKEN_EXPIRATION)
        return response

def user_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            access_token = jwt.encode({'user_id': user.id}, settings.SECRET_KEY, algorithm='HS256')
            refresh_token = jwt.encode({'user_id': user.id}, settings.SECRET_KEY, algorithm='HS256')
            response = redirect('/home')
            response.set_cookie(key='access_token', value=access_token, httponly=True, secure=True, samesite='Strict', max_age=settings.ACCESS_TOKEN_EXPIRATION)
            response.set_cookie(key='refresh_token', value=refresh_token, httponly=True, secure=True, samesite='Strict', max_age=settings.REFRESH_TOKEN_EXPIRATION)
            return response
        else:
            return JsonResponse({'success': False, 'error': 'Invalid credentials'})
    
    return render(request, 'login.html')



