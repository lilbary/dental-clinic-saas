"""
Mock SMS fonksiyonları - Gerçek SMS entegrasyonu için 
daha sonra Twilio, Netgsm vb. ile değiştirilebilir.
"""
import logging

logger = logging.getLogger(__name__)


def send_sms(phone_number: str, message: str) -> dict:
    """
    Mock SMS gönderme fonksiyonu.
    
    Args:
        phone_number: Alıcı telefon numarası
        message: Gönderilecek mesaj
    
    Returns:
        dict: Gönderim sonucu
    """
    # Mock implementation - sadece log'a yaz
    logger.info(f"[MOCK SMS] To: {phone_number}")
    logger.info(f"[MOCK SMS] Message: {message}")
    
    print(f"📱 SMS Gönderildi (Mock)")
    print(f"   Alıcı: {phone_number}")
    print(f"   Mesaj: {message}")
    
    return {
        'success': True,
        'message_id': 'mock-12345',
        'phone': phone_number,
        'status': 'sent'
    }


def send_appointment_reminder(appointment) -> dict:
    """
    Randevu hatırlatma SMS'i gönderir.
    
    Args:
        appointment: Appointment model instance
    
    Returns:
        dict: Gönderim sonucu
    """
    message = (
        f"Sayın {appointment.patient.name}, "
        f"{appointment.start_time.strftime('%d.%m.%Y')} tarihinde saat "
        f"{appointment.start_time.strftime('%H:%M')}'de "
        f"Dr. {appointment.dentist.name} ile randevunuz bulunmaktadır. "
        f"Lütfen zamanında geliniz."
    )
    
    return send_sms(appointment.patient.phone, message)


def send_appointment_confirmation(appointment) -> dict:
    """
    Randevu onay SMS'i gönderir.
    
    Args:
        appointment: Appointment model instance
    
    Returns:
        dict: Gönderim sonucu
    """
    message = (
        f"Sayın {appointment.patient.name}, randevunuz oluşturulmuştur. "
        f"Tarih: {appointment.start_time.strftime('%d.%m.%Y %H:%M')} "
        f"Hekim: Dr. {appointment.dentist.name}"
    )
    
    return send_sms(appointment.patient.phone, message)


def send_appointment_cancellation(appointment) -> dict:
    """
    Randevu iptal SMS'i gönderir.
    
    Args:
        appointment: Appointment model instance
    
    Returns:
        dict: Gönderim sonucu
    """
    message = (
        f"Sayın {appointment.patient.name}, "
        f"{appointment.start_time.strftime('%d.%m.%Y %H:%M')} tarihli "
        f"randevunuz iptal edilmiştir."
    )
    
    return send_sms(appointment.patient.phone, message)
