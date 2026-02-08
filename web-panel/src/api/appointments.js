// API Base URL
const API_BASE_URL = 'http://localhost:8000/api';

// Helper function for API calls
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `API Error: ${response.status}`);
    }

    return response.json();
}

// Dashboard Stats
export async function getDashboardStats() {
    return apiRequest('/dashboard-stats/');
}

// Check Availability
export async function checkAvailability(date, dentistId = null) {
    let endpoint = `/check-availability/?date=${date}`;
    if (dentistId) {
        endpoint += `&dentist_id=${dentistId}`;
    }
    return apiRequest(endpoint);
}

// Appointments
export async function getAppointments(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = queryParams ? `/appointments/?${queryParams}` : '/appointments/';
    return apiRequest(endpoint);
}

export async function createAppointment(data) {
    return apiRequest('/appointments/', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateAppointment(id, data) {
    return apiRequest(`/appointments/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

// Dentists
export async function getDentists(clinicId = null) {
    const endpoint = clinicId ? `/dentists/?clinic=${clinicId}` : '/dentists/';
    return apiRequest(endpoint);
}

// Patients
export async function getPatients(clinicId = null) {
    const endpoint = clinicId ? `/patients/?clinic=${clinicId}` : '/patients/';
    return apiRequest(endpoint);
}

// Clinics
export async function getClinics() {
    return apiRequest('/clinics/');
}
