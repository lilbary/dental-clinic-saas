from rest_framework import serializers
from .models import Clinic, Dentist, Patient, Appointment


class ClinicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clinic
        fields = ['id', 'name', 'address', 'phone', 'created_at', 'updated_at']


class DentistSerializer(serializers.ModelSerializer):
    clinic_name = serializers.CharField(source='clinic.name', read_only=True)

    class Meta:
        model = Dentist
        fields = ['id', 'clinic', 'clinic_name', 'name', 'phone', 'specialty', 'email', 'is_active', 'created_at', 'updated_at']


class PatientSerializer(serializers.ModelSerializer):
    clinic_name = serializers.CharField(source='clinic.name', read_only=True)

    class Meta:
        model = Patient
        fields = [
            'id', 'clinic', 'clinic_name', 'name', 'phone', 'email', 
            'date_of_birth', 'blood_type', 'allergies', 'chronic_diseases',
            'current_medications', 'emergency_contact_name', 'emergency_contact_phone',
            'notes', 'sms_consent', 'created_at', 'updated_at'
        ]


class AppointmentSerializer(serializers.ModelSerializer):
    dentist_name = serializers.CharField(source='dentist.name', read_only=True)
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'dentist', 'dentist_name', 'patient', 'patient_name',
            'start_time', 'end_time', 'status', 'status_display',
            'treatment_type', 'treatment_cost', 'notes', 'created_at', 'updated_at'
        ]


class AppointmentCreateSerializer(serializers.ModelSerializer):
    """Randevu oluşturma için özel serializer"""
    class Meta:
        model = Appointment
        fields = ['dentist', 'patient', 'start_time', 'end_time', 'status', 'treatment_type', 'treatment_cost', 'notes']

    def validate(self, data):
        # Başlangıç saati bitiş saatinden önce olmalı
        if data['start_time'] >= data['end_time']:
            raise serializers.ValidationError("Başlangıç saati bitiş saatinden önce olmalıdır.")
        
        # Çakışan randevu kontrolü
        overlapping = Appointment.objects.filter(
            dentist=data['dentist'],
            status__in=['scheduled', 'confirmed'],
            start_time__lt=data['end_time'],
            end_time__gt=data['start_time']
        )
        if self.instance:
            overlapping = overlapping.exclude(pk=self.instance.pk)
        
        if overlapping.exists():
            raise serializers.ValidationError("Bu zaman aralığında başka bir randevu mevcut.")
        
        return data
