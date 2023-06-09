from django.contrib import admin
from django.db.models.aggregates import Count
from django.utils.html import format_html, urlencode
from django.urls import reverse
from . import models
from django.contrib.auth.admin import UserAdmin
from django.core.exceptions import PermissionDenied
from .models import Bill, BillFile

class RoomImageInline(admin.TabularInline):
    model = models.RoomImage
    readonly_fields = ['thumbnail']

    def thumbnail(self, instance):
        if instance.image.name != '':
            return format_html(f'<img src="{instance.image.url}" class="thumbnail" />')
        return ''

@admin.register(models.Room)
class RoomAdmin(admin.ModelAdmin):
    autocomplete_fields = ['apartment']
    inlines = [RoomImageInline]
    list_display = ['id','apartment_address','size', 'price_per_month',
                    'description','renter']
    list_editable = ['price_per_month']
    list_filter = ['apartment']
    list_per_page = 10
    list_select_related = ['apartment']
    search_fields = ['size','apartment_address']

    def apartment_address(self, room):
        return room.apartment.address
    
    class Media:
        css = {
            'all': ['business/styles.css']
        }

@admin.register(models.Apartment)
class ApartmentAdmin(admin.ModelAdmin):
    list_display = ['id', 'address', 'rooms_count','owner']
    search_fields = ['address']

    @admin.display(ordering='rooms_count')
    def rooms_count(self, apartment):
        url = (
            reverse('admin:business_room_changelist')
            + '?'
            + urlencode({
                'apartment__id': str(apartment.id)
            }))
        return format_html('<a href="{}">{} Rooms</a>', url, apartment.rooms_count)

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(
            rooms_count=Count('rooms')
        )

    def save_model(self, request, obj, form, change):
        if not obj.owner:
            if request.user.user_type != 'owner':
                raise PermissionDenied("Only owners can create apartments.")
            obj.owner = request.user
        obj.save()

class CustomUserAdmin(UserAdmin):
    model = models.CustomUser
    list_display = ('id','username', 'email', 'user_type', 'is_staff','first_name')
    list_filter = ('user_type',)
    list_editable = ['user_type']

    ordering = ['first_name', 'last_name']
    list_per_page = 10
    search_fields = ['first_name__istartswith', 'last_name__istartswith']

    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'user_type')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )

@admin.register(models.Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ['id', 'start_date', 'end_date']
    list_filter = ['room', 'start_date', 'end_date']
    search_fields = ['apartment__name', 'room__name', 'tenant__first_name', 'tenant__last_name']

from django.contrib import admin

class BillFileInline(admin.TabularInline):
    model = models.BillFile

class BillAdmin(admin.ModelAdmin):
    list_display = ('id', 'apartment', 'bill_type', 'created_at', 'updated_at')
    list_filter = ('bill_type', 'paid', 'created_at')
    search_fields = ('apartment__address', 'bill_type')
    inlines = [BillFileInline]

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        if request.user.is_superuser:
            return queryset
        else:
            return queryset.filter(apartment__owner=request.user)

class BillFileAdmin(admin.ModelAdmin):
    list_display = ('id', 'bill', 'file')
    search_fields = ('bill__apartment__id',)

admin.site.register(Bill, BillAdmin)
admin.site.register(BillFile, BillFileAdmin)


admin.site.register(models.CustomUser, CustomUserAdmin)
