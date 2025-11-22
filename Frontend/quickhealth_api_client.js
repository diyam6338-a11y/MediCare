"""
JavaScript Client Library for QuickHealth Backend API
Add this to your HTML files to communicate with the backend
"""

class QuickHealthAPI {
    constructor(baseURL = 'http://127.0.0.1:5000') {
        this.baseURL = baseURL;
        this.currentUser = null;
        this.loadUserFromStorage();
    }

    // ==================== Authentication ====================

    async register(email, password, fullName, phoneNumber = '', role = 'patient') {
        """Register a new user"""
        try {
            const response = await fetch(`${this.baseURL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    full_name: fullName,
                    phone_number: phoneNumber,
                    role
                })
            });

            const data = await response.json();
            
            if (data.success) {
                console.log('✅ Registration successful');
                return { success: true, data };
            } else {
                console.error('❌ Registration failed:', data.message);
                return { success: false, error: data.message };
            }
        } catch (error) {
            console.error('❌ Registration error:', error);
            return { success: false, error: error.message };
        }
    }

    async login(email, password) {
        """Authenticate user and store session"""
        try {
            const response = await fetch(`${this.baseURL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (data.success) {
                this.currentUser = data.user;
                this.saveUserToStorage(data.user);
                console.log('✅ Login successful');
                return { success: true, user: data.user };
            } else {
                console.error('❌ Login failed:', data.message);
                return { success: false, error: data.message };
            }
        } catch (error) {
            console.error('❌ Login error:', error);
            return { success: false, error: error.message };
        }
    }

    logout() {
        """Clear user session"""
        this.currentUser = null;
        localStorage.removeItem('quickhealth_user');
        console.log('✅ Logged out');
    }

    // ==================== User Management ====================

    async getProfile(userId) {
        """Get user profile"""
        try {
            const response = await fetch(`${this.baseURL}/api/users/${userId}`);
            const data = await response.json();
            
            if (data.success) {
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.message };
            }
        } catch (error) {
            console.error('❌ Get profile error:', error);
            return { success: false, error: error.message };
        }
    }

    async updateProfile(userId, updates) {
        """Update user profile"""
        try {
            const response = await fetch(`${this.baseURL}/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates)
            });

            const data = await response.json();
            
            if (data.success) {
                if (this.currentUser) {
                    this.currentUser = { ...this.currentUser, ...updates };
                    this.saveUserToStorage(this.currentUser);
                }
                return { success: true };
            } else {
                return { success: false, error: data.message };
            }
        } catch (error) {
            console.error('❌ Update profile error:', error);
            return { success: false, error: error.message };
        }
    }

    async getAllUsers(role = null) {
        """Get all users, optionally filtered by role"""
        try {
            let url = `${this.baseURL}/api/users`;
            if (role) url += `?role=${role}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.success) {
                return { success: true, users: data.users };
            } else {
                return { success: false, error: data.message };
            }
        } catch (error) {
            console.error('❌ Get users error:', error);
            return { success: false, error: error.message };
        }
    }

    // ==================== Appointments ====================

    async createAppointment(patientId, appointmentDate, appointmentTime, doctorId = null, notes = '') {
        """Create a new appointment"""
        try {
            const response = await fetch(`${this.baseURL}/api/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    patient_id: patientId,
                    appointment_date: appointmentDate,
                    appointment_time: appointmentTime,
                    doctor_id: doctorId,
                    notes
                })
            });

            const data = await response.json();
            
            if (data.success) {
                console.log('✅ Appointment created');
                return { success: true, appointmentId: data.appointment_id };
            } else {
                return { success: false, error: data.message };
            }
        } catch (error) {
            console.error('❌ Create appointment error:', error);
            return { success: false, error: error.message };
        }
    }

    async getAppointment(appointmentId) {
        """Get appointment details"""
        try {
            const response = await fetch(`${this.baseURL}/api/appointments/${appointmentId}`);
            const data = await response.json();
            
            if (data.success) {
                return { success: true, appointment: data.appointment };
            } else {
                return { success: false, error: data.message };
            }
        } catch (error) {
            console.error('❌ Get appointment error:', error);
            return { success: false, error: error.message };
        }
    }

    async getPatientAppointments(patientId) {
        """Get all appointments for a patient"""
        try {
            const response = await fetch(`${this.baseURL}/api/patients/${patientId}/appointments`);
            const data = await response.json();
            
            if (data.success) {
                return { success: true, appointments: data.appointments };
            } else {
                return { success: false, error: data.message };
            }
        } catch (error) {
            console.error('❌ Get appointments error:', error);
            return { success: false, error: error.message };
        }
    }

    async updateAppointment(appointmentId, updates) {
        """Update appointment"""
        try {
            const response = await fetch(`${this.baseURL}/api/appointments/${appointmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates)
            });

            const data = await response.json();
            
            if (data.success) {
                return { success: true };
            } else {
                return { success: false, error: data.message };
            }
        } catch (error) {
            console.error('❌ Update appointment error:', error);
            return { success: false, error: error.message };
        }
    }

    async cancelAppointment(appointmentId) {
        """Cancel/delete appointment"""
        try {
            const response = await fetch(`${this.baseURL}/api/appointments/${appointmentId}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            
            if (data.success) {
                console.log('✅ Appointment cancelled');
                return { success: true };
            } else {
                return { success: false, error: data.message };
            }
        } catch (error) {
            console.error('❌ Cancel appointment error:', error);
            return { success: false, error: error.message };
        }
    }

    // ==================== Health Check ====================

    async checkHealth() {
        """Check API health status"""
        try {
            const response = await fetch(`${this.baseURL}/api/health`);
            const data = await response.json();
            return data.status === 'healthy';
        } catch (error) {
            console.error('❌ Health check failed:', error);
            return false;
        }
    }

    async getStatus() {
        """Get server status"""
        try {
            const response = await fetch(`${this.baseURL}/api/status`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('❌ Status check failed:', error);
            return null;
        }
    }

    // ==================== Storage Management ====================

    saveUserToStorage(user) {
        """Save user to localStorage"""
        localStorage.setItem('quickhealth_user', JSON.stringify(user));
    }

    loadUserFromStorage() {
        """Load user from localStorage"""
        const stored = localStorage.getItem('quickhealth_user');
        if (stored) {
            this.currentUser = JSON.parse(stored);
        }
    }

    isAuthenticated() {
        """Check if user is logged in"""
        return this.currentUser !== null;
    }

    getCurrentUser() {
        """Get current logged-in user"""
        return this.currentUser;
    }

    // ==================== Utility Methods ====================

    formatDate(dateString) {
        """Format date string"""
        return new Date(dateString).toLocaleDateString();
    }

    formatTime(timeString) {
        """Format time string"""
        return timeString;
    }
}

// Create global instance
const apiClient = new QuickHealthAPI();
