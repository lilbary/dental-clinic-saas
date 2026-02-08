import { useState, useEffect } from 'react'
import './index.css'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Calendar from './components/Calendar'
import Login from './components/Login'
import PatientForm from './components/PatientForm'
import ReportsPage from './components/ReportsPage'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [user, setUser] = useState(null)
  const [showPatientForm, setShowPatientForm] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'calendar':
      case 'appointments':
        return <Calendar />
      case 'patients':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Hastalar</h2>
                <p className="text-gray-500 text-sm">Hasta kayıtlarını yönetin</p>
              </div>
              <button
                onClick={() => setShowPatientForm(true)}
                className="btn-primary flex items-center gap-2"
              >
                <span>+</span>
                <span>Yeni Hasta</span>
              </button>
            </div>
            <div className="card p-8 text-center">
              <p className="text-4xl mb-4">👥</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hasta Listesi</h3>
              <p className="text-gray-500 mb-4">Hasta listesi modülü yakında</p>
              <button
                onClick={() => setShowPatientForm(true)}
                className="btn-primary"
              >
                İlk Hastayı Ekle
              </button>
            </div>
          </div>
        )
      case 'dentists':
        return (
          <div className="card p-8 text-center animate-fade-in">
            <p className="text-4xl mb-4">👨‍⚕️</p>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Diş Hekimleri</h2>
            <p className="text-gray-500">Hekim yönetimi modülü yakında</p>
          </div>
        )
      case 'reports':
        return <ReportsPage />
      default:
        return <Dashboard />
    }
  }

  return (
    <>
      {showPatientForm && (
        <PatientForm
          onClose={() => setShowPatientForm(false)}
          onSuccess={() => setShowPatientForm(false)}
        />
      )}

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      <main className="main-with-sidebar p-6">
        {renderContent()}
      </main>
    </>
  )
}

export default App
