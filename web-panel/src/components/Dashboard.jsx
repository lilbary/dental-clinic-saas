import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000/api';

export default function Dashboard() {
    const [stats, setStats] = useState({
        dentist_count: 0,
        patient_count: 0,
        today_appointments: 0
    });
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = token ? { 'Authorization': `Token ${token}` } : {};

                // Fetch stats
                const statsRes = await fetch(`${API_BASE}/dashboard-stats/`, { headers });
                const statsData = await statsRes.json();
                setStats(statsData);

                // Fetch today's appointments
                const today = new Date().toISOString().split('T')[0];
                const apptRes = await fetch(`${API_BASE}/appointments/?date=${today}`, { headers });
                const apptData = await apptRes.json();
                setTodayAppointments(apptData.results || apptData || []);
            } catch (error) {
                console.error('Dashboard fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const formatTime = (dateStr) => {
        return new Date(dateStr).toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            scheduled: { class: 'badge-scheduled', label: 'Planlandı' },
            confirmed: { class: 'badge-confirmed', label: 'Onaylandı' },
            completed: { class: 'badge-completed', label: 'Tamamlandı' },
            cancelled: { class: 'badge-cancelled', label: 'İptal' }
        };
        return statusMap[status] || statusMap.scheduled;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Hekim Sayısı */}
                <div className="stat-card">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">👨‍⚕️</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Hekim Sayısı</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.dentist_count}</p>
                        </div>
                    </div>
                </div>

                {/* Kayıtlı Hasta */}
                <div className="stat-card">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">👥</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Kayıtlı Hasta</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.patient_count}</p>
                        </div>
                    </div>
                </div>

                {/* Bugünkü Randevular */}
                <div className="stat-card">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">📅</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Bugünkü Randevular</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.today_appointments}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bugünkü Randevu Durumu - 2/3 width */}
                <div className="lg:col-span-2">
                    <div className="card p-5">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Bugünkü Randevu Durumu
                        </h2>

                        {todayAppointments.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">📭</div>
                                <p>Bugün için randevu bulunmuyor</p>
                            </div>
                        ) : (
                            <div className="timeline">
                                {todayAppointments.map((apt) => {
                                    const statusInfo = getStatusBadge(apt.status);
                                    return (
                                        <div key={apt.id} className="timeline-item">
                                            <div className="timeline-time">
                                                {formatTime(apt.start_time)}
                                            </div>
                                            <div className="timeline-content">
                                                <div className="timeline-patient">{apt.patient_name}</div>
                                                <div className="timeline-dentist">Dr. {apt.dentist_name}</div>
                                                {apt.treatment_type && (
                                                    <div className="timeline-treatment">{apt.treatment_type}</div>
                                                )}
                                            </div>
                                            <span className={`badge ${statusInfo.class}`}>
                                                {statusInfo.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Hızlı İşlemler - 1/3 width */}
                <div className="lg:col-span-1">
                    <div className="quick-actions">
                        <h3>Hızlı İşlemler</h3>

                        <button className="quick-action-btn" onClick={handlePrint}>
                            <span>🖨️</span>
                            <span>Günlük Rapor Yazdır</span>
                        </button>

                        <button className="quick-action-btn">
                            <span>📊</span>
                            <span>Hekim Raporu (PDF)</span>
                        </button>

                        <button className="quick-action-btn">
                            <span>📋</span>
                            <span>Hasta Listesi (Excel)</span>
                        </button>

                        <button className="quick-action-btn">
                            <span>➕</span>
                            <span>Yeni Randevu</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
