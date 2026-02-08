# 🦷 DentCare - Dental Clinic Management SaaS

<div align="center">

![DentCare Banner](https://img.shields.io/badge/DentCare-Dental%20Clinic%20SaaS-2563EB?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDEgMC04LTMuNTktOC04czMuNTktOCA4LTggOCAzLjU5IDggOC0zLjU5IDgtOCA4eiIvPjwvc3ZnPg==)

[![Django](https://img.shields.io/badge/Django-5.2-092E20?style=flat-square&logo=django)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Expo](https://img.shields.io/badge/Expo-54-000020?style=flat-square&logo=expo)](https://expo.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

**A comprehensive, multi-tenant SaaS platform for dental clinic management**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Screenshots](#-screenshots) • [API](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Overview

DentCare is a full-stack dental clinic management system designed as a SaaS (Software as a Service) solution. It enables dental clinics to manage appointments, patients, dentists, and subscriptions through a modern web dashboard and mobile application.

### 🎯 Key Highlights

- **Multi-Tenant Architecture**: Each clinic operates in isolation with its own data
- **Subscription-Based**: Built-in billing plans (Trial, Basic, Professional, Enterprise)
- **Mobile-First**: Native mobile app for doctors using Expo/React Native
- **Modern Stack**: Django REST Framework + React + Tailwind CSS

---

## ✨ Features

### 🏥 Clinic Management
- Multi-tenant clinic registration and management
- Role-based access control (Admin, Doctor, Assistant)
- Subscription plan management with usage limits

### 📅 Appointment System
- Calendar-based appointment scheduling
- Real-time availability checking
- Appointment status tracking (Scheduled → Confirmed → Completed)
- Treatment type and cost tracking

### 👤 Patient Records
- Comprehensive patient profiles
- Health information (blood type, allergies, chronic diseases)
- Emergency contact information
- SMS consent management

### 📱 Mobile Application
- Doctor login and authentication
- View daily appointments
- Patient intake form
- Profile management

### 🖥️ Web Dashboard
- Modern React-based admin panel
- Interactive calendar view
- Patient and appointment management
- Responsive design with Tailwind CSS

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Python 3.12+** | Core language |
| **Django 5.2** | Web framework |
| **Django REST Framework** | API development |
| **SQLite/PostgreSQL** | Database |
| **JWT Authentication** | Secure API access |

### Web Panel
| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework |
| **Vite (Rolldown)** | Build tool |
| **Tailwind CSS 4** | Styling |
| **ESLint** | Code quality |

### Mobile App
| Technology | Purpose |
|------------|---------|
| **React Native 0.81** | Cross-platform mobile |
| **Expo SDK 54** | Development platform |
| **React Navigation 7** | Navigation |
| **AsyncStorage** | Local data persistence |

---

## 🚀 Installation

### Prerequisites
- Python 3.12+
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### 1️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver 0.0.0.0:8000
```

### 2️⃣ Web Panel Setup

```bash
# Navigate to web panel directory
cd web-panel

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3️⃣ Mobile App Setup

```bash
# Navigate to mobile app directory
cd mobile-app

# Install dependencies
npm install

# Start Expo development server
npx expo start
```

---

## 📸 Screenshots

<div align="center">

### Web Dashboard
| Calendar View | Patient List |
|--------------|--------------|
| 📅 Interactive appointment calendar | 👥 Patient management interface |

### Mobile App
| Login | Appointments | Patient Entry |
|-------|-------------|---------------|
| 🔐 Secure login | 📋 Daily schedule | ➕ New patient form |

</div>

---

## 📚 API Documentation

### Authentication
```http
POST /api/token/
Content-Type: application/json

{
    "username": "doctor@clinic.com",
    "password": "password123"
}
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/appointments/` | List appointments |
| `POST` | `/api/appointments/` | Create appointment |
| `GET` | `/api/patients/` | List patients |
| `POST` | `/api/patients/` | Create patient |
| `GET` | `/api/dentists/` | List dentists |
| `GET` | `/api/availability/{date}/` | Check availability |

---

## 📁 Project Structure

```
dentist/
├── backend/                 # Django REST API
│   ├── config/             # Project settings
│   ├── clinic/             # Main application
│   │   ├── models.py       # Database models
│   │   ├── views.py        # API views
│   │   ├── serializers.py  # DRF serializers
│   │   └── urls.py         # URL routing
│   └── manage.py
│
├── web-panel/              # React Admin Dashboard
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.jsx         # Main application
│   │   └── index.css       # Tailwind styles
│   └── package.json
│
└── mobile-app/             # Expo Mobile Application
    ├── src/
    │   ├── screens/        # App screens
    │   ├── styles/         # Theme configuration
    │   └── api.js          # API client
    ├── App.js
    └── package.json
```

---

## 🔐 Data Models

### Core Entities

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Clinic    │────<│  ClinicUser │     │ Subscription│
└─────────────┘     └─────────────┘     └─────────────┘
       │                                       │
       │                                       │
       ▼                                       │
┌─────────────┐     ┌─────────────┐           │
│   Dentist   │────<│ Appointment │           │
└─────────────┘     └─────────────┘           │
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   │
┌─────────────┐     ┌─────────────┐           │
│   Patient   │<────│ (N:1 with   │<──────────┘
└─────────────┘     │   Clinic)   │
                    └─────────────┘
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Bayram**


---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ for dental clinics everywhere

</div>
