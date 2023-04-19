from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions, status
from rest_framework.filters import  SearchFilter
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .models import Contract, CustomUser, Review, Room, RoomImage, Bill
from .permissions import IsApartmentOwner
from . import serializers
from rest_framework.permissions import AllowAny
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import RoomSerializer
from django.core.mail import send_mail

class SearchView(ModelViewSet):
    queryset = Room.objects.filter(renter=None)
    serializer_class = RoomSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['price_per_month', 'size']
    search_fields = ['description']
    allowed_methods = ['GET']

    @action(detail=True, methods=['post'])
    def send_email(self, request, pk=None):
        room = self.get_object()
        owner_email = room.apartment.owner.email
        subject = 'Regarding Room %d' % room.id
        message = 'I am interested in the room. Please contact me at this email address: %s' % request.user.email
        send_mail(subject, message, 'from@example.com', [owner_email], fail_silently=False)
        return Response({'message': 'Email sent'})
    
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






