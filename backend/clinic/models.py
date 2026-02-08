"""
Models for multi-tenant dental clinic SaaS system.
"""
from django.db import models
from django.contrib.auth.models import AbstractUser


# ============================================================================
# AUTH & USER MODELS
# ============================================================================

class ClinicUser(AbstractUser):
    """
    Custom user model for clinic staff.
    Extends Django's AbstractUser with role and clinic relationship.
    """
    ROLE_CHOICES = [
        ('admin', 'Klinik Yöneticisi'),
        ('assistant', 'Asistan'),
        ('doctor', 'Doktor'),
    ]
    
    clinic = models.ForeignKey(
        'Clinic',
        on_delete=models.CASCADE,
        related_name='users',
        verbose_name="Klinik",
        null=True,
        blank=True
    )
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='assistant',
        verbose_name="Rol"
    )
    phone = models.CharField(max_length=20, blank=True, verbose_name="Telefon")
    
    class Meta:
        verbose_name = "Kullanıcı"
        verbose_name_plural = "Kullanıcılar"
    
    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.get_role_display()})"
    
    @property
    def is_admin(self):
        return self.role == 'admin'
    
    @property
    def is_assistant(self):
        return self.role == 'assistant'
    
    @property
    def is_doctor(self):
        return self.role == 'doctor'


# ============================================================================
# CLINIC MODELS
# ============================================================================

class Clinic(models.Model):
    """Diş kliniği modeli"""
    name = models.CharField(max_length=200, verbose_name="Klinik Adı")
    address = models.TextField(verbose_name="Adres")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Telefon")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Klinik"
        verbose_name_plural = "Klinikler"

    def __str__(self):
        return self.name


class ClinicSubscription(models.Model):
    """
    Subscription model for SaaS billing.
    Tracks clinic subscription status and limits.
    """
    PLAN_CHOICES = [
        ('trial', 'Deneme'),
        ('basic', 'Temel'),
        ('professional', 'Profesyonel'),
        ('enterprise', 'Kurumsal'),
    ]
    
    clinic = models.OneToOneField(
        Clinic,
        on_delete=models.CASCADE,
        related_name='subscription',
        verbose_name="Klinik"
    )
    plan = models.CharField(
        max_length=20,
        choices=PLAN_CHOICES,
        default='trial',
        verbose_name="Plan"
    )
    is_active = models.BooleanField(default=True, verbose_name="Aktif")
    max_dentists = models.IntegerField(default=3, verbose_name="Maks. Hekim Sayısı")
    max_appointments_per_month = models.IntegerField(default=100, verbose_name="Aylık Maks. Randevu")
    started_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = "Abonelik"
        verbose_name_plural = "Abonelikler"
    
    def __str__(self):
        return f"{self.clinic.name} - {self.get_plan_display()}"


# ============================================================================
# DENTIST & PATIENT MODELS
# ============================================================================

class Dentist(models.Model):
    """Diş hekimi modeli"""
    clinic = models.ForeignKey(
        Clinic, 
        on_delete=models.CASCADE, 
        related_name='dentists',
        verbose_name="Klinik"
    )
    name = models.CharField(max_length=200, verbose_name="Ad Soyad")
    phone = models.CharField(max_length=20, verbose_name="Telefon")
    specialty = models.CharField(max_length=100, verbose_name="Uzmanlık Alanı")
    email = models.EmailField(blank=True, verbose_name="E-posta")
    is_active = models.BooleanField(default=True, verbose_name="Aktif")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Diş Hekimi"
        verbose_name_plural = "Diş Hekimleri"

    def __str__(self):
        return f"Dr. {self.name} - {self.specialty}"


class Patient(models.Model):
    """Hasta modeli"""
    BLOOD_TYPE_CHOICES = [
        ('A+', 'A Rh+'),
        ('A-', 'A Rh-'),
        ('B+', 'B Rh+'),
        ('B-', 'B Rh-'),
        ('AB+', 'AB Rh+'),
        ('AB-', 'AB Rh-'),
        ('0+', '0 Rh+'),
        ('0-', '0 Rh-'),
        ('unknown', 'Bilinmiyor'),
    ]
    
    clinic = models.ForeignKey(
        Clinic, 
        on_delete=models.CASCADE, 
        related_name='patients',
        verbose_name="Klinik"
    )
    name = models.CharField(max_length=200, verbose_name="Ad Soyad")
    phone = models.CharField(max_length=20, verbose_name="Telefon")
    email = models.EmailField(blank=True, verbose_name="E-posta")
    date_of_birth = models.DateField(null=True, blank=True, verbose_name="Doğum Tarihi")
    
    # Health Information - Temel Sorular
    blood_type = models.CharField(
        max_length=10, 
        choices=BLOOD_TYPE_CHOICES, 
        default='unknown',
        verbose_name="Kan Grubu"
    )
    allergies = models.TextField(blank=True, verbose_name="Alerjiler", 
                                  help_text="Bilinen alerjiler (ilaç, lateks vb.)")
    chronic_diseases = models.TextField(blank=True, verbose_name="Kronik Hastalıklar",
                                         help_text="Diyabet, hipertansiyon, kalp hastalığı vb.")
    current_medications = models.TextField(blank=True, verbose_name="Kullanılan İlaçlar",
                                            help_text="Düzenli kullanılan ilaçlar")
    emergency_contact_name = models.CharField(max_length=200, blank=True, verbose_name="Acil Durum Kişisi")
    emergency_contact_phone = models.CharField(max_length=20, blank=True, verbose_name="Acil Durum Telefonu")
    
    notes = models.TextField(blank=True, verbose_name="Notlar")
    sms_consent = models.BooleanField(default=True, verbose_name="SMS İzni")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Hasta"
        verbose_name_plural = "Hastalar"

    def __str__(self):
        return self.name


# ============================================================================
# APPOINTMENT MODEL
# ============================================================================

class Appointment(models.Model):
    """Randevu modeli"""
    STATUS_CHOICES = [
        ('scheduled', 'Planlandı'),
        ('confirmed', 'Onaylandı'),
        ('completed', 'Tamamlandı'),
        ('cancelled', 'İptal Edildi'),
        ('no_show', 'Gelmedi'),
    ]

    dentist = models.ForeignKey(
        Dentist, 
        on_delete=models.CASCADE, 
        related_name='appointments',
        verbose_name="Diş Hekimi"
    )
    patient = models.ForeignKey(
        Patient, 
        on_delete=models.CASCADE, 
        related_name='appointments',
        verbose_name="Hasta"
    )
    start_time = models.DateTimeField(verbose_name="Başlangıç Saati")
    end_time = models.DateTimeField(verbose_name="Bitiş Saati")
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='scheduled',
        verbose_name="Durum"
    )
    treatment_type = models.CharField(max_length=100, blank=True, verbose_name="Tedavi Türü")
    treatment_cost = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True, 
        verbose_name="Tedavi Ücreti"
    )
    notes = models.TextField(blank=True, verbose_name="Notlar")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Randevu"
        verbose_name_plural = "Randevular"
        ordering = ['start_time']

    def __str__(self):
        return f"{self.patient.name} - Dr. {self.dentist.name} ({self.start_time.strftime('%d.%m.%Y %H:%M')})"
