import { useState } from 'react';
import LandingPage from './LandingPage';

const API_BASE = 'http://localhost:8000/api';

export default function Login({ onLogin }) {
    const [showLanding, setShowLanding] = useState(true);
    const [showRegister, setShowRegister] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [registerData, setRegisterData] = useState({
        clinicName: '',
        adminEmail: '',
        adminPassword: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleNavigateToLogin = () => {
        setShowLanding(false);
        setShowRegister(false);
    };

    const handleNavigateToRegister = () => {
        setShowLanding(false);
        setShowRegister(true);
    };

    const handleBackToLanding = () => {
        setShowLanding(true);
        setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/auth/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Giriş başarısız');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            onLogin(data.user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        // In production: call registration API
        alert('Kayıt özelliği yakında aktif olacak!\n\nDemo için "demo" kullanıcı adı ve "demo123" şifresi ile giriş yapın.');
        setShowRegister(false);
    };

    // Show Landing Page
    if (showLanding) {
        return (
            <LandingPage
                onNavigateToLogin={handleNavigateToLogin}
                onNavigateToRegister={handleNavigateToRegister}
            />
        );
    }

    // Register Form
    if (showRegister) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">🦷</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Klinik Kayıt</h1>
                        <p className="text-gray-500">14 gün ücretsiz deneme</p>
                    </div>

                    <form onSubmit={handleRegister} className="card p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Klinik Adı</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Örn: Gülümseten Diş Kliniği"
                                value={registerData.clinicName}
                                onChange={(e) => setRegisterData({ ...registerData, clinicName: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                            <input
                                type="email"
                                className="input"
                                placeholder="admin@klinik.com"
                                value={registerData.adminEmail}
                                onChange={(e) => setRegisterData({ ...registerData, adminEmail: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
                            <input
                                type="password"
                                className="input"
                                placeholder="••••••••"
                                value={registerData.adminPassword}
                                onChange={(e) => setRegisterData({ ...registerData, adminPassword: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                            <input
                                type="tel"
                                className="input"
                                placeholder="0212 123 4567"
                                value={registerData.phone}
                                onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                            />
                        </div>

                        <button type="submit" className="btn-primary w-full">
                            Kayıt Ol ve Başla
                        </button>

                        <p className="text-center text-sm text-gray-500">
                            Zaten hesabınız var mı?{' '}
                            <button
                                type="button"
                                onClick={handleNavigateToLogin}
                                className="text-blue-600 hover:underline font-medium"
                            >
                                Giriş Yap
                            </button>
                        </p>

                        <button
                            type="button"
                            onClick={handleBackToLanding}
                            className="w-full text-center text-sm text-gray-400 hover:text-gray-600"
                        >
                            ← Ana Sayfaya Dön
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Login Form
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🦷</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">DentCare</h1>
                    <p className="text-gray-500">Klinik Yönetim Sistemi</p>
                </div>

                <form onSubmit={handleLogin} className="card p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-center text-gray-900">Giriş Yap</h2>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="kullanici@email.com"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
                        <input
                            type="password"
                            className="input"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary w-full"
                        disabled={loading}
                    >
                        {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                    </button>

                    <div className="text-center pt-2">
                        <p className="text-sm text-gray-500 mb-1">Demo Bilgileri:</p>
                        <p className="text-xs text-gray-400">Kullanıcı: demo | Şifre: demo123</p>
                    </div>

                    <button
                        type="button"
                        onClick={handleBackToLanding}
                        className="w-full text-center text-sm text-gray-400 hover:text-gray-600"
                    >
                        ← Ana Sayfaya Dön
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-4">
                    © 2026 DentCare. Tüm hakları saklıdır.
                </p>
            </div>
        </div>
    );
}
