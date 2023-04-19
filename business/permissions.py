from rest_framework import permissions
from .models import Apartment

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)


class FullDjangoModelPermissions(permissions.DjangoModelPermissions):
    def __init__(self) -> None:
        self.perms_map['GET'] = ['%(app_label)s.view_%(model_name)s']

class ViewCustomerHistoryPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.has_perm('business.view_history')
    
class IsAuthenticated(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated
    
class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user and request.user.user_type == 'Owner'
    
class IsApartmentOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == "owner"
    
    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        return obj.owner == request.user

from rest_framework.permissions import IsAuthenticated

class IsApartmentOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an apartment to edit or delete rooms,
    but allow any authenticated user to view the rooms.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            apartment = Apartment.objects.get(id=view.kwargs['apartment_pk'])
            return apartment.owner == request.user
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            apartment = obj.apartment
            return apartment.owner == request.user