import { useState } from 'react';

const API_BASE = 'http://localhost:8000/api';

export default function PatientForm({ onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        // Basic Info
        name: '',
        phone: '',
        email: '',
        date_of_birth: '',
        // Health Info
        blood_type: 'unknown',
        allergies: '',
        chronic_diseases: '',
        current_medications: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        notes: '',
        sms_consent: true,
        clinic: 1  // Default clinic
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/patients/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Token ${token}` })
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || JSON.stringify(data) || 'Hasta eklenemedi');
            }

            // SMS will be sent automatically by backend
            onSuccess?.(data);
            onClose?.();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const bloodTypes = [
        { value: 'A+', label: 'A Rh+' },
        { value: 'A-', label: 'A Rh-' },
        { value: 'B+', label: 'B Rh+' },
        { value: 'B-', label: 'B Rh-' },
        { value: 'AB+', label: 'AB Rh+' },
        { value: 'AB-', label: 'AB Rh-' },
        { value: '0+', label: '0 Rh+' },
        { value: '0-', label: '0 Rh-' },
        { value: 'unknown', label: 'Bilinmiyor' },
    ];

    return (
        <div className="modal-overlay animate-fade-in">
            <div className="modal-content p-6 max-w-xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Yeni Hasta Kaydı</h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Adım {step}/2 - {step === 1 ? 'Kişisel Bilgiler' : 'Sağlık Bilgileri'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-2 mb-6">
                    <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                    <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Ad Soyad *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ahmet Yılmaz"
                                    className="input"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Telefon *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        placeholder="0532 123 4567"
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        E-posta
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="ornek@email.com"
                                        className="input"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Doğum Tarihi
                                </label>
                                <input
                                    type="date"
                                    name="date_of_birth"
                                    value={formData.date_of_birth}
                                    onChange={handleChange}
                                    className="input"
                                />
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                <input
                                    type="checkbox"
                                    id="sms_consent"
                                    name="sms_consent"
                                    checked={formData.sms_consent}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 rounded"
                                />
                                <label htmlFor="sms_consent" className="text-sm text-gray-700">
                                    Randevu hatırlatmaları için SMS gönderimine izin veriyorum
                                </label>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="w-full btn-primary py-3"
                                >
                                    Devam Et →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Health Info */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Kan Grubu
                                </label>
                                <select
                                    name="blood_type"
                                    value={formData.blood_type}
                                    onChange={handleChange}
                                    className="select"
                                >
                                    {bloodTypes.map(bt => (
                                        <option key={bt.value} value={bt.value}>{bt.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Alerjiler
                                </label>
                                <textarea
                                    name="allergies"
                                    value={formData.allergies}
                                    onChange={handleChange}
                                    rows={2}
                                    placeholder="İlaç, lateks, diğer alerjiler..."
                                    className="input resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Kronik Hastalıklar
                                </label>
                                <textarea
                                    name="chronic_diseases"
                                    value={formData.chronic_diseases}
                                    onChange={handleChange}
                                    rows={2}
                                    placeholder="Diyabet, hipertansiyon, kalp hastalığı..."
                                    className="input resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Kullanılan İlaçlar
                                </label>
                                <textarea
                                    name="current_medications"
                                    value={formData.current_medications}
                                    onChange={handleChange}
                                    rows={2}
                                    placeholder="Düzenli kullanılan ilaçlar..."
                                    className="input resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Acil Durum Kişisi
                                    </label>
                                    <input
                                        type="text"
                                        name="emergency_contact_name"
                                        value={formData.emergency_contact_name}
                                        onChange={handleChange}
                                        placeholder="İsim"
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Acil Durum Tel
                                    </label>
                                    <input
                                        type="tel"
                                        name="emergency_contact_phone"
                                        value={formData.emergency_contact_phone}
                                        onChange={handleChange}
                                        placeholder="Telefon"
                                        className="input"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Ek Notlar
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows={2}
                                    placeholder="Diğer önemli bilgiler..."
                                    className="input resize-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 btn-secondary"
                                >
                                    ← Geri
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 btn-primary disabled:opacity-50"
                                >
                                    {loading ? 'Kaydediliyor...' : 'Hastayı Kaydet'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
