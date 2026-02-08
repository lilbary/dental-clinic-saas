import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000/api';

export default function ReportsPage() {
    const [dentists, setDentists] = useState([]);
    const [selectedDentist, setSelectedDentist] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDentists = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = token ? { 'Authorization': `Token ${token}` } : {};
                const res = await fetch(`${API_BASE}/dentists/`, { headers });
                const data = await res.json();
                setDentists(data.results || data || []);
            } catch (error) {
                console.error('Dentists fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDentists();
    }, []);

    const handleDentistPDF = (dentist) => {
        setSelectedDentist(dentist);
        // In production: call API to generate PDF
        alert(`PDF raporu: Dr. ${dentist.name}\n\n- Aylık hasta grafiği\n- Hastadan elde edilen kazanç\n- Randevu yoğunluğu\n- Toplam sayı dökümü\n\n(Backend entegrasyonu gerekli)`);
    };

    const handlePatientsExcel = async () => {
        // In production: call API to generate Excel
        alert('Hasta listesi Excel dosyası indirilecek.\n\n(Backend entegrasyonu gerekli)');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-xl font-bold text-gray-900">Raporlar</h1>
                <p className="text-gray-500 text-sm">Hekim ve hasta raporlarını indirin</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Hekim Raporları */}
                <div className="card p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-xl">👨‍⚕️</span>
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-900">Hekim Raporları</h2>
                            <p className="text-sm text-gray-500">PDF formatında detaylı rapor</p>
                        </div>
                    </div>

                    <div className="text-sm font-medium text-gray-700 mb-2">Hekimlerimiz:</div>

                    {dentists.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Henüz hekim eklenmemiş
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {dentists.map((dentist, index) => (
                                <button
                                    key={dentist.id}
                                    onClick={() => handleDentistPDF(dentist)}
                                    className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-400 text-sm">{index + 1}.</span>
                                        <span className="font-medium text-gray-900">Dr. {dentist.name}</span>
                                    </div>
                                    <span className="text-blue-600 text-sm font-medium">PDF ↓</span>
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                        <strong>PDF içeriği:</strong> Aylık hasta grafiği, kazanç, randevu yoğunluğu
                    </div>
                </div>

                {/* Hasta Raporları */}
                <div className="card p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-xl">👥</span>
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-900">Hasta Raporları</h2>
                            <p className="text-sm text-gray-500">Excel formatında kayıt listesi</p>
                        </div>
                    </div>

                    <div className="py-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">📋</span>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Tüm hastaların kayıt listesini Excel dosyası olarak indirin
                        </p>
                        <button
                            onClick={handlePatientsExcel}
                            className="btn-primary"
                        >
                            📊 Hasta Listesi İndir (Excel)
                        </button>
                    </div>

                    <div className="mt-4 p-3 bg-green-50 rounded-lg text-sm text-green-700">
                        <strong>Excel içeriği:</strong> Ad, telefon, e-posta, kayıt tarihi, randevu sayısı
                    </div>
                </div>
            </div>
        </div>
    );
}
