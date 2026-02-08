import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000/api';

export default function LandingPage({ onNavigateToLogin, onNavigateToRegister }) {
    const [clinicCount, setClinicCount] = useState(737);

    useEffect(() => {
        const fetchClinicCount = async () => {
            try {
                const res = await fetch(`${API_BASE}/auth/clinics/`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setClinicCount(data.length || 737);
                }
            } catch (error) {
                console.error('Clinic count fetch error:', error);
            }
        };
        fetchClinicCount();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
            {/* Header */}
            <header className="p-6">
                <div className="flex items-center gap-3 max-w-6xl mx-auto">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">🦷</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">DentCare</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-4xl w-full text-center">
                    {/* Hero */}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        DentCare'e Hoşgeldiniz
                    </h1>
                    <p className="text-xl text-gray-600 mb-2">
                        Kliniklerin elektronik asistanı
                    </p>
                    <p className="text-lg text-blue-600 font-medium mb-12">
                        {clinicCount} klinik ile yola devam ediyoruz 🚀
                    </p>

                    {/* Action Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        {/* Giriş Yap */}
                        <div
                            className="card p-8 cursor-pointer hover:shadow-lg transition-all group"
                            onClick={onNavigateToLogin}
                        >
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
                                <span className="text-3xl group-hover:scale-110 transition-transform">🔐</span>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Giriş Yap</h2>
                            <p className="text-gray-500 text-sm mb-4">
                                Zaten kayıtlı mısınız?
                            </p>
                            <button className="btn-primary w-full">
                                Hesabıma Giriş Yap
                            </button>
                        </div>

                        {/* Kayıt Ol */}
                        <div
                            className="card p-8 cursor-pointer hover:shadow-lg transition-all group border-2 border-dashed border-blue-200 hover:border-blue-400"
                            onClick={onNavigateToRegister}
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500 transition-colors">
                                <span className="text-3xl group-hover:scale-110 transition-transform">✨</span>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Kayıt Ol</h2>
                            <p className="text-gray-500 text-sm mb-4">
                                Yeni klinik kaydı oluşturun
                            </p>
                            <button className="btn-outline w-full">
                                Aylık Abonelik Başlat
                            </button>
                            <p className="text-xs text-gray-400 mt-3">
                                14 gün ücretsiz deneme
                            </p>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span>📅</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Randevu Yönetimi</h3>
                                <p className="text-sm text-gray-500">Kolay randevu takibi ve SMS hatırlatma</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span>👥</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Hasta Kayıtları</h3>
                                <p className="text-sm text-gray-500">Detaylı hasta bilgileri ve geçmişi</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span>📊</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Raporlama</h3>
                                <p className="text-sm text-gray-500">PDF ve Excel formatında raporlar</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="p-6 text-center text-sm text-gray-500">
                © 2026 DentCare. Tüm hakları saklıdır.
            </footer>
        </div>
    );
}
