from datetime import datetime, timedelta
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone

from .models import Clinic, Dentist, Patient, Appointment
from .serializers import (
    ClinicSerializer, DentistSerializer, PatientSerializer,
    AppointmentSerializer, AppointmentCreateSerializer
)
from .utils import send_appointment_confirmation


class ClinicViewSet(viewsets.ModelViewSet):
    """Klinik CRUD işlemleri"""
    queryset = Clinic.objects.all()
    serializer_class = ClinicSerializer


class DentistViewSet(viewsets.ModelViewSet):
    """Diş Hekimi CRUD işlemleri"""
    queryset = Dentist.objects.filter(is_active=True)
    serializer_class = DentistSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        clinic_id = self.request.query_params.get('clinic')
        if clinic_id:
            queryset = queryset.filter(clinic_id=clinic_id)
        return queryset


class PatientViewSet(viewsets.ModelViewSet):
    """Hasta CRUD işlemleri"""
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        clinic_id = self.request.query_params.get('clinic')
        if clinic_id:
            queryset = queryset.filter(clinic_id=clinic_id)
        return queryset


class AppointmentViewSet(viewsets.ModelViewSet):
    """Randevu CRUD işlemleri"""
    queryset = Appointment.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return AppointmentCreateSerializer
        return AppointmentSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtreleme parametreleri
        dentist_id = self.request.query_params.get('dentist')
        date = self.request.query_params.get('date')
        status_filter = self.request.query_params.get('status')
        
        if dentist_id:
            queryset = queryset.filter(dentist_id=dentist_id)
        if date:
            queryset = queryset.filter(start_time__date=date)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset

    def perform_create(self, serializer):
        appointment = serializer.save()
        # Mock SMS gönder
        send_appointment_confirmation(appointment)


@api_view(['GET'])
def check_availability(request):
    """
    Belirtilen tarihteki müsait ve dolu slotları döndürür.
    
    Query Parameters:
        - date: YYYY-MM-DD formatında tarih
        - dentist_id: (opsiyonel) Belirli bir hekim için kontrol
    
    Çalışma saatleri: 09:00 - 17:00
    Slot süresi: 30 dakika
    """
    date_str = request.query_params.get('date')
    dentist_id = request.query_params.get('dentist_id')
    
    if not date_str:
        return Response(
            {'error': 'date parametresi gereklidir (YYYY-MM-DD formatında)'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return Response(
            {'error': 'Geçersiz tarih formatı. YYYY-MM-DD formatını kullanın.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Çalışma saatleri: 09:00 - 17:00
    WORK_START_HOUR = 9
    WORK_END_HOUR = 17
    SLOT_DURATION_MINUTES = 30
    
    # Tüm slotları oluştur
    all_slots = []
    current_time = datetime.combine(target_date, datetime.min.time().replace(hour=WORK_START_HOUR))
    end_time = datetime.combine(target_date, datetime.min.time().replace(hour=WORK_END_HOUR))
    
    while current_time < end_time:
        slot_end = current_time + timedelta(minutes=SLOT_DURATION_MINUTES)
        all_slots.append({
            'start_time': current_time.strftime('%H:%M'),
            'end_time': slot_end.strftime('%H:%M'),
            'start_datetime': timezone.make_aware(current_time),
            'end_datetime': timezone.make_aware(slot_end),
        })
        current_time = slot_end
    
    # Dolu randevuları getir
    appointments_query = Appointment.objects.filter(
        start_time__date=target_date,
        status__in=['scheduled', 'confirmed']
    )
    
    if dentist_id:
        appointments_query = appointments_query.filter(dentist_id=dentist_id)
    
    booked_appointments = list(appointments_query.values(
        'id', 'dentist_id', 'dentist__name', 'patient__name',
        'start_time', 'end_time', 'status', 'treatment_type'
    ))
    
    # Slotları müsait/dolu olarak işaretle
    available_slots = []
    booked_slots = []
    
    for slot in all_slots:
        is_booked = False
        booking_info = None
        
        for apt in booked_appointments:
            apt_start = apt['start_time']
            apt_end = apt['end_time']
            
            # Çakışma kontrolü
            if (slot['start_datetime'] < apt_end and slot['end_datetime'] > apt_start):
                is_booked = True
                booking_info = {
                    'appointment_id': apt['id'],
                    'dentist_id': apt['dentist_id'],
                    'dentist_name': apt['dentist__name'],
                    'patient_name': apt['patient__name'],
                    'treatment_type': apt['treatment_type'] or 'Belirtilmemiş',
                }
                break
        
        slot_data = {
            'start_time': slot['start_time'],
            'end_time': slot['end_time'],
            'is_available': not is_booked,
        }
        
        if is_booked:
            slot_data['booking'] = booking_info
            booked_slots.append(slot_data)
        else:
            available_slots.append(slot_data)
    
    return Response({
        'date': date_str,
        'working_hours': {
            'start': f"{WORK_START_HOUR:02d}:00",
            'end': f"{WORK_END_HOUR:02d}:00",
        },
        'slot_duration_minutes': SLOT_DURATION_MINUTES,
        'total_slots': len(all_slots),
        'available_count': len(available_slots),
        'booked_count': len(booked_slots),
        'available_slots': available_slots,
        'booked_slots': booked_slots,
    })


@api_view(['GET'])
def dashboard_stats(request):
    """
    Dashboard için özet istatistikler döndürür.
    """
    today = timezone.now().date()
    
    # Bugünkü randevular
    today_appointments = Appointment.objects.filter(start_time__date=today)
    
    stats = {
        'total_clinics': Clinic.objects.count(),
        'total_dentists': Dentist.objects.filter(is_active=True).count(),
        'total_patients': Patient.objects.count(),
        'today_appointments': today_appointments.count(),
        'today_completed': today_appointments.filter(status='completed').count(),
        'today_pending': today_appointments.filter(status__in=['scheduled', 'confirmed']).count(),
        'today_cancelled': today_appointments.filter(status='cancelled').count(),
    }
    
    return Response(stats)
