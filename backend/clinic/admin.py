from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Clinic, Dentist, Patient, Appointment, ClinicUser, ClinicSubscription


@admin.register(ClinicUser)
class ClinicUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'clinic', 'role', 'is_active']
    list_filter = ['role', 'clinic', 'is_active']
    fieldsets = UserAdmin.fieldsets + (
        ('Klinik Bilgileri', {'fields': ('clinic', 'role', 'phone')}),
    )


@admin.register(ClinicSubscription)
class ClinicSubscriptionAdmin(admin.ModelAdmin):
    list_display = ['clinic', 'plan', 'is_active', 'max_dentists', 'started_at']
    list_filter = ['plan', 'is_active']


@admin.register(Clinic)
class ClinicAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'phone', 'created_at']
    search_fields = ['name', 'address']


@admin.register(Dentist)
class DentistAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'clinic', 'specialty', 'phone', 'is_active']
    list_filter = ['clinic', 'specialty', 'is_active']
    search_fields = ['name', 'specialty']


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'clinic', 'phone', 'created_at']
    list_filter = ['clinic']
    search_fields = ['name', 'phone']


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['id', 'patient', 'dentist', 'start_time', 'status']
    list_filter = ['status', 'dentist', 'start_time']
    search_fields = ['patient__name', 'dentist__name']
    date_hierarchy = 'start_time'
