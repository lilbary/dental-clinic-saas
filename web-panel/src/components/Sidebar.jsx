import { useState } from 'react';

export default function Sidebar({ activeTab, setActiveTab, user, onLogout }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const menuItems = [
        { id: 'dashboard', icon: '📊', label: 'Dashboard' },
        { id: 'calendar', icon: '📅', label: 'Randevular' },
        { id: 'patients', icon: '👥', label: 'Hastalar' },
        { id: 'dentists', icon: '👨‍⚕️', label: 'Hekimler' },
        { id: 'reports', icon: '📄', label: 'Raporlar' },
    ];

    return (
        <aside
            className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="logo-icon">🦷</div>
                {isExpanded && <span className="logo-text">DentCare</span>}
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                        title={!isExpanded ? item.label : ''}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {isExpanded && <span className="nav-label">{item.label}</span>}
                    </button>
                ))}
            </nav>

            {/* User Info */}
            {isExpanded && user && (
                <div className="sidebar-user">
                    <div className="user-avatar">
                        {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                    </div>
                    <div className="user-info">
                        <span className="user-name">{user.full_name || user.username}</span>
                        <span className="user-role">{user.role_display}</span>
                    </div>
                </div>
            )}

            {/* Logout */}
            <button
                onClick={onLogout}
                className="nav-item logout-btn"
                title={!isExpanded ? 'Çıkış' : ''}
            >
                <span className="nav-icon">🚪</span>
                {isExpanded && <span className="nav-label">Çıkış</span>}
            </button>
        </aside>
    );
}
