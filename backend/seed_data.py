"""
Örnek veri yüklemek için script
Kullanım: python manage.py shell < seed_data.py
veya: python manage.py shell sonra copy-paste
"""
from clinic.models import Clinic, Dentist, Patient, Appointment
from django.utils import timezone
from datetime import timedelta

# Klinik oluştur
clinic, _ = Clinic.objects.get_or_create(
    name="DentCare Ana Klinik",
    defaults={
        "address": "Atatürk Caddesi No:123, Kadıköy, İstanbul",
        "phone": "0216 123 45 67"
    }
)
print(f"✓ Klinik: {clinic.name}")

# Diş Hekimleri
dentists_data = [
    {"name": "Ahmet Yılmaz", "phone": "0532 111 22 33", "specialty": "Ortodonti", "email": "ahmet@dentcare.com"},
    {"name": "Ayşe Kaya", "phone": "0533 222 33 44", "specialty": "Endodonti", "email": "ayse@dentcare.com"},
    {"name": "Mehmet Demir", "phone": "0534 333 44 55", "specialty": "Pedodonti", "email": "mehmet@dentcare.com"},
]

for d in dentists_data:
    dentist, created = Dentist.objects.get_or_create(
        clinic=clinic,
        name=d["name"],
        defaults=d
    )
    if created:
        print(f"✓ Hekim eklendi: Dr. {dentist.name}")

# Hastalar
patients_data = [
    {"name": "Ali Veli", "phone": "0555 111 11 11"},
    {"name": "Fatma Şen", "phone": "0555 222 22 22"},
    {"name": "Mustafa Öz", "phone": "0555 333 33 33"},
    {"name": "Zeynep Ak", "phone": "0555 444 44 44"},
    {"name": "Emre Can", "phone": "0555 555 55 55"},
]

for p in patients_data:
    patient, created = Patient.objects.get_or_create(
        clinic=clinic,
        name=p["name"],
        defaults=p
    )
    if created:
        print(f"✓ Hasta eklendi: {patient.name}")

# Bugün için örnek randevular
today = timezone.now().replace(hour=9, minute=0, second=0, microsecond=0)
dentist1 = Dentist.objects.first()
patients = Patient.objects.all()

appointments_data = [
    {"hour": 9, "minute": 0, "patient_idx": 0, "status": "completed", "treatment": "Diş Temizliği"},
    {"hour": 10, "minute": 0, "patient_idx": 1, "status": "completed", "treatment": "Dolgu"},
    {"hour": 11, "minute": 30, "patient_idx": 2, "status": "confirmed", "treatment": "Kanal Tedavisi"},
    {"hour": 14, "minute": 0, "patient_idx": 3, "status": "scheduled", "treatment": "Kontrol"},
    {"hour": 15, "minute": 30, "patient_idx": 4, "status": "scheduled", "treatment": "Diş Çekimi"},
]

for a in appointments_data:
    start = today.replace(hour=a["hour"], minute=a["minute"])
    end = start + timedelta(minutes=30)
    
    apt, created = Appointment.objects.get_or_create(
        dentist=dentist1,
        patient=patients[a["patient_idx"]],
        start_time=start,
        defaults={
            "end_time": end,
            "status": a["status"],
            "treatment_type": a["treatment"]
        }
    )
    if created:
        print(f"✓ Randevu: {apt.patient.name} - {start.strftime('%H:%M')}")

print("\n🎉 Örnek veriler yüklendi!")
print(f"   Klinikler: {Clinic.objects.count()}")
print(f"   Hekimler: {Dentist.objects.count()}")
print(f"   Hastalar: {Patient.objects.count()}")
print(f"   Randevular: {Appointment.objects.count()}")
