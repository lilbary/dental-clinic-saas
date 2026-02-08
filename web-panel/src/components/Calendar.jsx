import { useState, useEffect } from 'react';
import { checkAvailability, getAppointments } from '../api/appointments';
import AppointmentForm from './AppointmentForm';

export default function Calendar() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [availability, setAvailability] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchData();
    }, [selectedDate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [availData, apptData] = await Promise.all([
                checkAvailability(selectedDate),
                getAppointments({ date: selectedDate })
            ]);
            setAvailability(availData);
            setAppointments(apptData.results || []);
        } catch (error) {
            console.error('Data fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('tr-TR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusClass = (status) => {
        const classes = {
            'scheduled': 'badge-scheduled',
            'confirmed': 'badge-confirmed',
            'completed': 'badge-completed',
            'cancelled': 'badge-cancelled',
        };
        return classes[status] || 'badge-scheduled';
    };

    const getStatusLabel = (status) => {
        const labels = {
            'scheduled': 'Planlandı',
            'confirmed': 'Onaylandı',
            'completed': 'Tamamlandı',
            'cancelled': 'İptal',
        };
        return labels[status] || status;
    };

    const goToDate = (days) => {
        const current = new Date(selectedDate);
        current.setDate(current.getDate() + days);
        setSelectedDate(current.toISOString().split('T')[0]);
    };

    const handleAppointmentSuccess = () => {
        setShowForm(false);
        fetchData();
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Appointment Form Modal */}
            {showForm && (
                <AppointmentForm
                    onClose={() => setShowForm(false)}
                    onSuccess={handleAppointmentSuccess}
                    selectedDate={selectedDate}
                />
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Günlük Takvim</h2>
                    <p className="text-gray-500 text-sm mt-0.5">{formatDate(selectedDate)}</p>
                </div>

                {/* Date Navigation */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => goToDate(-1)}
                        className="btn-secondary p-2.5"
                    >
                        ←
                    </button>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="input w-auto"
                    />
                    <button
                        onClick={() => goToDate(1)}
                        className="btn-secondary p-2.5"
                    >
                        →
                    </button>
                    <button
                        onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                        className="btn-secondary"
                    >
                        Bugün
                    </button>
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <span>+</span>
                        <span>Randevu Ekle</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            {availability && (
                <div className="grid grid-cols-3 gap-4">
                    <div className="stat-card">
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl">
                                📅
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{availability.total_slots}</p>
                                <p className="text-sm text-gray-500">Toplam Slot</p>
                            </div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-xl">
                                ✓
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-600">{availability.available_count}</p>
                                <p className="text-sm text-gray-500">Müsait</p>
                            </div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl">
                                🦷
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-amber-600">{availability.booked_count}</p>
                                <p className="text-sm text-gray-500">Dolu</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Time Slots Grid */}
            <div className="card p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                    Zaman Slotları
                    <span className="text-sm font-normal text-gray-500 ml-2">
                        ({availability?.working_hours?.start} - {availability?.working_hours?.end})
                    </span>
                </h3>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-4 gap-3">
                        {/* Available Slots */}
                        {availability?.available_slots?.map((slot, index) => (
                            <div
                                key={`avail-${index}`}
                                className="time-slot time-slot-available"
                                onClick={() => setShowForm(true)}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-green-700">{slot.start_time}</span>
                                    <span className="text-xs text-gray-500">- {slot.end_time}</span>
                                </div>
                                <p className="text-xs text-green-600 mt-1">✓ Müsait</p>
                            </div>
                        ))}

                        {/* Booked Slots */}
                        {availability?.booked_slots?.map((slot, index) => (
                            <div
                                key={`booked-${index}`}
                                className="time-slot time-slot-booked"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-red-700">{slot.start_time}</span>
                                    <span className="text-xs text-gray-500">- {slot.end_time}</span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1 truncate">
                                    {slot.booking?.patient_name || 'Dolu'}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Today's Appointments List */}
            <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900">
                        Randevu Listesi
                        <span className="text-sm font-normal text-gray-500 ml-2">
                            ({appointments.length} randevu)
                        </span>
                    </h3>
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn-outline text-sm"
                    >
                        + Yeni Randevu
                    </button>
                </div>

                {appointments.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-state-icon">📭</p>
                        <p className="text-gray-500">Bu tarihte randevu bulunmuyor</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-4 btn-primary"
                        >
                            İlk Randevuyu Ekle
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {appointments.map((apt) => (
                            <div
                                key={apt.id}
                                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-lg">
                                        🦷
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{apt.patient_name}</p>
                                        <p className="text-sm text-gray-500">Dr. {apt.dentist_name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-mono text-blue-600 font-medium">
                                        {new Date(apt.start_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <span className={`badge ${getStatusClass(apt.status)}`}>
                                        {getStatusLabel(apt.status)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
