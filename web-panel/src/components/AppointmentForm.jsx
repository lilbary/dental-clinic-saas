import { useState, useEffect } from 'react';
import { getDentists, getPatients, createAppointment } from '../api/appointments';

export default function AppointmentForm({ onClose, onSuccess, selectedDate }) {
    const [dentists, setDentists] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        dentist: '',
        patient: '',
        date: selectedDate || new Date().toISOString().split('T')[0],
        start_time: '09:00',
        duration: '30',
        treatment_type: '',
        notes: ''
    });

    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        setDataLoading(true);
        Promise.all([getDentists(), getPatients()])
            .then(([dentistsData, patientsData]) => {
                const dentistsList = dentistsData.results || dentistsData || [];
                const patientsList = patientsData.results || patientsData || [];
                setDentists(dentistsList);
                setPatients(patientsList);
            })
            .catch(err => console.error('Data fetch error:', err))
            .finally(() => setDataLoading(false));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const startDateTime = new Date(`${formData.date}T${formData.start_time}:00`);
            const endDateTime = new Date(startDateTime.getTime() + parseInt(formData.duration) * 60000);

            const appointmentData = {
                dentist: parseInt(formData.dentist),
                patient: parseInt(formData.patient),
                start_time: startDateTime.toISOString(),
                end_time: endDateTime.toISOString(),
                status: 'scheduled',
                treatment_type: formData.treatment_type,
                notes: formData.notes
            };

            await createAppointment(appointmentData);
            onSuccess?.();
            onClose?.();
        } catch (err) {
            setError(err.message || 'Randevu oluşturulamadı');
        } finally {
            setLoading(false);
        }
    };

    const timeSlots = [];
    for (let h = 9; h < 17; h++) {
        for (let m = 0; m < 60; m += 30) {
            timeSlots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        }
    }

    return (
        <div className="modal-overlay animate-fade-in">
            <div className="modal-content p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Yeni Randevu</h2>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Dentist */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Diş Hekimi *
                        </label>
                        <select
                            name="dentist"
                            value={formData.dentist}
                            onChange={handleChange}
                            required
                            className="select"
                        >
                            <option value="">Hekim seçin...</option>
                            {dentists.map(d => (
                                <option key={d.id} value={d.id}>Dr. {d.name} - {d.specialty}</option>
                            ))}
                        </select>
                    </div>

                    {/* Patient */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Hasta *
                        </label>
                        <select
                            name="patient"
                            value={formData.patient}
                            onChange={handleChange}
                            required
                            className="select"
                        >
                            <option value="">Hasta seçin...</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Date & Time Row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Tarih *
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Saat *
                            </label>
                            <select
                                name="start_time"
                                value={formData.start_time}
                                onChange={handleChange}
                                required
                                className="select"
                            >
                                {timeSlots.map(time => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Duration & Treatment */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Süre (dk)
                            </label>
                            <select
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                className="select"
                            >
                                <option value="30">30 dakika</option>
                                <option value="60">1 saat</option>
                                <option value="90">1.5 saat</option>
                                <option value="120">2 saat</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Tedavi Türü
                            </label>
                            <input
                                type="text"
                                name="treatment_type"
                                value={formData.treatment_type}
                                onChange={handleChange}
                                placeholder="Örn: Diş Temizliği"
                                className="input"
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Notlar
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={2}
                            placeholder="Ek bilgi..."
                            className="input resize-none"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 btn-secondary"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Kaydediliyor...' : 'Randevu Oluştur'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
