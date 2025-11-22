// Demo Credentials
const demoCredentials = {
  doctor: {
    email: 'doctor@quickhealth.com',
    password: 'doctor123'
  },
  nurse: {
    email: 'nurse@quickhealth.com',
    password: 'nurse123'
  },
  patient: {
    email: 'patient@quickhealth.com',
    password: 'patient123'
  },
  staff: {
    email: 'staff@quickhealth.com',
    password: 'staff123'
  }
};

// Application State
const appState = {
  currentRole: null,
  notificationCount: 0,
  patients: [
    {
      id: 'P1234',
      name: 'John Doe',
      age: 45,
      room: '204',
      diagnosis: 'Post-surgery recovery',
      vitals: {
        heartRate: 72,
        bloodPressure: '120/80',
        temperature: 98.6,
        oxygen: 98
      },
      medications: [
        { name: 'Aspirin', dosage: '100mg', frequency: 'Daily' },
        { name: 'Antibiotics', dosage: '500mg', frequency: 'Twice daily' }
      ],
      history: [
        'Cardiac surgery - Nov 15, 2025',
        'Hypertension diagnosed - 2020',
        'No known allergies'
      ]
    },
    {
      id: 'P1235',
      name: 'Jane Smith',
      age: 32,
      room: '305',
      diagnosis: 'Pneumonia',
      vitals: {
        heartRate: 78,
        bloodPressure: '118/75',
        temperature: 99.2,
        oxygen: 95
      },
      medications: [
        { name: 'Amoxicillin', dosage: '250mg', frequency: 'Three times daily' }
      ],
      history: [
        'Admitted - Nov 19, 2025',
        'Respiratory infection',
        'No prior hospitalizations'
      ]
    }
  ],
  nurseTasks: [
    { id: 1, task: 'Medication Round - Ward A', due: '2:00 PM', status: 'pending' },
    { id: 2, task: 'Vitals Check - ICU', due: 'Overdue: 15 mins', status: 'urgent' },
    { id: 3, task: 'Patient Discharge - Room 204', due: 'Scheduled: 4:30 PM', status: 'pending' }
  ],
  staffAlerts: [
    { id: 1, title: 'ICU Bed Request - Emergency', time: '2 minutes ago', priority: 'urgent' },
    { id: 2, title: 'Equipment Maintenance - Ward B', time: '15 minutes ago', priority: 'normal' }
  ],
  dischargePatients: [
    {
      id: 1,
      name: 'John Doe',
      room: '204',
      criteria: {
        medicalClearance: true,
        billsCleared: true,
        transportArranged: true
      },
      readySince: '2 hours ago'
    },
    {
      id: 2,
      name: 'Sarah Williams',
      room: '305',
      criteria: {
        medicalClearance: true,
        billsCleared: true,
        transportArranged: false
      },
      readySince: '45 minutes ago'
    }
  ],
  departments: ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Emergency', 'General Medicine'],
  doctors: [
    { name: 'Dr. Sarah Williams', specialty: 'Cardiology', availableSlots: ['10:00 AM', '11:30 AM', '2:00 PM', '4:00 PM'] },
    { name: 'Dr. Michael Brown', specialty: 'General Medicine', availableSlots: ['9:00 AM', '11:00 AM', '3:00 PM'] },
    { name: 'Dr. Emily Davis', specialty: 'Pediatrics', availableSlots: ['10:30 AM', '1:00 PM', '3:30 PM'] }
  ],
  appointments: [
    { id: 1, date: 'Nov 23, 2025', time: '10:00 AM', doctor: 'Dr. Sarah Williams', department: 'Cardiology', status: 'upcoming' },
    { id: 2, date: 'Nov 25, 2025', time: '2:00 PM', doctor: 'Dr. Michael Brown', department: 'General Medicine', status: 'upcoming' }
  ],
  reports: [
    { id: 1, type: 'Blood Test', date: 'Nov 18, 2025', status: 'Ready' },
    { id: 2, type: 'X-Ray Report', date: 'Nov 20, 2025', status: 'Ready' }
  ]
};

// Utility Functions
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: '✓',
    error: '✗',
    info: 'ℹ'
  };
  
  toast.innerHTML = `
    <span class="toast-icon">${icons[type]}</span>
    <span class="toast-message">${message}</span>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function showModal(content) {
  const overlay = document.getElementById('modal-overlay');
  const modalContent = document.getElementById('modal-content');
  modalContent.innerHTML = content;
  overlay.classList.add('active');
}

function hideModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('active');
}

function setLoading(button, isLoading) {
  if (isLoading) {
    button.classList.add('loading');
    button.disabled = true;
  } else {
    button.classList.remove('loading');
    button.disabled = false;
  }
}

// Navigation
document.addEventListener('DOMContentLoaded', () => {
  // Role Selection
  document.querySelectorAll('.role-card').forEach(card => {
    card.addEventListener('click', () => {
      const role = card.dataset.role;
      showLoginForm(role);
    });
  });
  
  // Book Appointment Buttons
  document.getElementById('book-appointment-hero').addEventListener('click', openBookingModal);
  const bookNewBtn = document.getElementById('book-new-appointment');
  if (bookNewBtn) {
    bookNewBtn.addEventListener('click', openBookingModal);
  }
  
  // Tab Navigation
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      const parentSection = btn.closest('.portal-section');
      
      // Update buttons
      parentSection.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update content
      parentSection.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  // Modal Close
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') {
      hideModal();
    }
  });
});

function showLoginForm(role) {
  // Hide home and login selection
  document.getElementById('home').style.display = 'none';
  document.getElementById('login').style.display = 'none';
  
  // Hide all login forms
  document.querySelectorAll('.login-form-section').forEach(section => {
    section.style.display = 'none';
  });
  
  // Show selected login form
  document.getElementById(`${role}-login`).style.display = 'flex';
}

function backToRoleSelection() {
  // Hide all login forms
  document.querySelectorAll('.login-form-section').forEach(section => {
    section.style.display = 'none';
  });
  
  // Show login selection
  document.getElementById('login').style.display = 'block';
}

function useDemoCredentials(role) {
  const credentials = demoCredentials[role];
  document.getElementById(`${role}-email`).value = credentials.email;
  document.getElementById(`${role}-password`).value = credentials.password;
  showToast('Demo credentials filled!', 'info');
}

function handleLogin(event, role) {
  event.preventDefault();
  
  const email = document.getElementById(`${role}-email`).value;
  const password = document.getElementById(`${role}-password`).value;
  const btn = event.target.querySelector('button[type="submit"]');
  
  // Validate credentials
  const validCredentials = demoCredentials[role];
  if (email === validCredentials.email && password === validCredentials.password) {
    setLoading(btn, true);
    
    setTimeout(() => {
      setLoading(btn, false);
      loginAs(role);
    }, 800);
  } else {
    showToast('Invalid credentials! Please use demo credentials.', 'error');
  }
}

function loginAs(role) {
  appState.currentRole = role;
  
  // Hide all sections
  document.getElementById('home').style.display = 'none';
  document.getElementById('login').style.display = 'none';
  document.querySelectorAll('.login-form-section').forEach(section => {
    section.style.display = 'none';
  });
  document.querySelectorAll('.portal-section').forEach(section => {
    section.style.display = 'none';
  });
  
  // Show selected portal
  document.getElementById(`${role}-portal`).style.display = 'block';
  
  // Initialize portal
  switch(role) {
    case 'doctor':
      initDoctorPortal();
      break;
    case 'nurse':
      initNursePortal();
      break;
    case 'patient':
      initPatientPortal();
      break;
    case 'staff':
      initStaffPortal();
      break;
  }
  
  showToast(`Welcome to ${role.charAt(0).toUpperCase() + role.slice(1)} Portal!`, 'success');
}

function logout() {
  appState.currentRole = null;
  
  // Hide all portals and login forms
  document.querySelectorAll('.portal-section').forEach(section => {
    section.style.display = 'none';
  });
  document.querySelectorAll('.login-form-section').forEach(section => {
    section.style.display = 'none';
  });
  
  // Clear all login forms
  ['doctor', 'nurse', 'patient', 'staff'].forEach(role => {
    const emailField = document.getElementById(`${role}-email`);
    const passwordField = document.getElementById(`${role}-password`);
    if (emailField) emailField.value = '';
    if (passwordField) passwordField.value = '';
  });
  
  // Show home and login
  document.getElementById('home').style.display = 'flex';
  document.getElementById('login').style.display = 'block';
  
  showToast('Logged out successfully', 'info');
}

// Doctor Portal
function initDoctorPortal() {
  renderDoctorPatients();
  renderDoctorAppointments();
  renderDoctorChart();
}

function renderDoctorPatients() {
  const container = document.getElementById('doctor-patients-grid');
  container.innerHTML = appState.patients.map(patient => `
    <div class="patient-card">
      <div class="patient-header">
        <div class="patient-info">
          <h3>${patient.name}</h3>
          <p>ID: ${patient.id} | Room: ${patient.room}</p>
        </div>
        <span class="status-badge stable">Stable</span>
      </div>
      <p style="color: var(--text-muted); margin-bottom: 16px;">${patient.diagnosis}</p>
      <div class="vitals-grid">
        <div class="vital-item">
          <label>Heart Rate</label>
          <span>${patient.vitals.heartRate} bpm</span>
        </div>
        <div class="vital-item">
          <label>BP</label>
          <span>${patient.vitals.bloodPressure}</span>
        </div>
      </div>
      <button class="btn btn--primary btn--sm" style="width: 100%;" onclick="viewPatientDetails('${patient.id}')">
        View Details
      </button>
    </div>
  `).join('');
}

function renderDoctorAppointments() {
  const container = document.getElementById('doctor-appointments-list');
  container.innerHTML = appState.appointments.map(apt => `
    <div class="appointment-card">
      <div>
        <h4>${apt.date} at ${apt.time}</h4>
        <p style="color: var(--text-muted);">Patient ID: ${apt.id} | ${apt.department}</p>
      </div>
      <button class="btn btn--primary" onclick="startConsultation(${apt.id})">
        Start Consultation
      </button>
    </div>
  `).join('');
}

function viewPatientDetails(patientId) {
  const patient = appState.patients.find(p => p.id === patientId);
  if (!patient) return;
  
  const content = `
    <div class="modal-header">
      <h3>Patient Details: ${patient.name}</h3>
      <button class="modal-close" onclick="hideModal()">&times;</button>
    </div>
    <div style="margin-bottom: 24px;">
      <p><strong>Patient ID:</strong> ${patient.id}</p>
      <p><strong>Age:</strong> ${patient.age}</p>
      <p><strong>Room:</strong> ${patient.room}</p>
      <p><strong>Diagnosis:</strong> ${patient.diagnosis}</p>
    </div>
    <div style="margin-bottom: 24px;">
      <h4 style="margin-bottom: 12px;">Current Vitals</h4>
      <div class="vitals-grid">
        <div class="vital-item">
          <label>Heart Rate</label>
          <span>${patient.vitals.heartRate} bpm</span>
        </div>
        <div class="vital-item">
          <label>Blood Pressure</label>
          <span>${patient.vitals.bloodPressure}</span>
        </div>
        <div class="vital-item">
          <label>Temperature</label>
          <span>${patient.vitals.temperature}°F</span>
        </div>
        <div class="vital-item">
          <label>Oxygen</label>
          <span>${patient.vitals.oxygen}%</span>
        </div>
      </div>
    </div>
    <div style="margin-bottom: 24px;">
      <h4 style="margin-bottom: 12px;">Current Medications</h4>
      ${patient.medications.map(med => `
        <div style="background: var(--bg-tertiary); padding: 12px; border-radius: 8px; margin-bottom: 8px;">
          <strong>${med.name}</strong> - ${med.dosage}, ${med.frequency}
        </div>
      `).join('')}
    </div>
    <div>
      <h4 style="margin-bottom: 12px;">Medical History</h4>
      ${patient.history.map(item => `
        <div style="padding: 8px 0; border-bottom: 1px solid var(--border);">${item}</div>
      `).join('')}
    </div>
  `;
  
  showModal(content);
}

function startConsultation(appointmentId) {
  const appointment = appState.appointments.find(a => a.id === appointmentId);
  if (!appointment) return;
  
  const content = `
    <div class="modal-header">
      <h3>Start Consultation</h3>
      <button class="modal-close" onclick="hideModal()">&times;</button>
    </div>
    <form onsubmit="submitConsultation(event, ${appointmentId})">
      <div class="form-group">
        <label>Chief Complaint</label>
        <textarea class="form-control" required></textarea>
      </div>
      <div class="form-group">
        <label>Diagnosis</label>
        <textarea class="form-control" required></textarea>
      </div>
      <div class="form-group">
        <label>Prescription</label>
        <textarea class="form-control" placeholder="Medication, dosage, frequency" required></textarea>
      </div>
      <div class="form-group">
        <label>Follow-up Date</label>
        <input type="date" class="form-control" required>
      </div>
      <div class="form-group">
        <label>Notes</label>
        <textarea class="form-control"></textarea>
      </div>
      <button type="submit" class="btn btn--primary" style="width: 100%;">Complete Consultation</button>
    </form>
  `;
  
  showModal(content);
}

function submitConsultation(event, appointmentId) {
  event.preventDefault();
  const btn = event.target.querySelector('button[type="submit"]');
  setLoading(btn, true);
  
  setTimeout(() => {
    setLoading(btn, false);
    hideModal();
    showToast('Consultation completed successfully!', 'success');
    // Update appointment status
    const apt = appState.appointments.find(a => a.id === appointmentId);
    if (apt) apt.status = 'completed';
    renderDoctorAppointments();
  }, 1000);
}

function renderDoctorChart() {
  const ctx = document.getElementById('doctor-chart');
  if (!ctx) return;
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Patients Consulted',
        data: [12, 19, 15, 17, 14, 21, 18],
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#e5e5e5' } }
      },
      scales: {
        y: { ticks: { color: '#e5e5e5' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
        x: { ticks: { color: '#e5e5e5' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
      }
    }
  });
}

// Nurse Portal
function initNursePortal() {
  renderNurseTasks();
  renderNursePatients();
  renderNurseChart();
}

function renderNurseTasks() {
  const container = document.getElementById('nurse-tasks-list');
  container.innerHTML = appState.nurseTasks.map(task => `
    <div class="task-card">
      <div class="task-info">
        <h4>${task.task}</h4>
        <p>Due: ${task.due}</p>
      </div>
      <div class="task-actions">
        <span class="status-badge ${task.status}">${task.status.toUpperCase()}</span>
        <button class="btn btn--primary btn--sm" onclick="completeTask(${task.id})">
          ${task.status === 'urgent' ? 'Complete Now' : 'Mark Complete'}
        </button>
      </div>
    </div>
  `).join('');
}

function renderNursePatients() {
  const container = document.getElementById('nurse-patients-grid');
  container.innerHTML = appState.patients.map(patient => `
    <div class="patient-card">
      <div class="patient-header">
        <div class="patient-info">
          <h3>${patient.name}</h3>
          <p>Room: ${patient.room}</p>
        </div>
      </div>
      <p style="color: var(--text-muted); margin-bottom: 16px;">${patient.diagnosis}</p>
      <button class="btn btn--primary btn--sm" style="width: 100%;" onclick="updatePatientRecord('${patient.id}')">
        Update Record
      </button>
    </div>
  `).join('');
}

function completeTask(taskId) {
  const task = appState.nurseTasks.find(t => t.id === taskId);
  if (!task) return;
  
  const taskCard = event.target.closest('.task-card');
  const btn = event.target;
  setLoading(btn, true);
  
  setTimeout(() => {
    task.status = 'completed';
    setLoading(btn, false);
    showToast(`Task "${task.task}" completed successfully!`, 'success');
    renderNurseTasks();
  }, 1000);
}

function updatePatientRecord(patientId) {
  const patient = appState.patients.find(p => p.id === patientId);
  if (!patient) return;
  
  const content = `
    <div class="modal-header">
      <h3>Update Patient Record: ${patient.name}</h3>
      <button class="modal-close" onclick="hideModal()">&times;</button>
    </div>
    <form onsubmit="submitPatientUpdate(event, '${patientId}')">
      <div class="form-group">
        <label>Heart Rate (bpm)</label>
        <input type="number" class="form-control" value="${patient.vitals.heartRate}" required>
      </div>
      <div class="form-group">
        <label>Blood Pressure</label>
        <input type="text" class="form-control" value="${patient.vitals.bloodPressure}" required>
      </div>
      <div class="form-group">
        <label>Temperature (°F)</label>
        <input type="number" step="0.1" class="form-control" value="${patient.vitals.temperature}" required>
      </div>
      <div class="form-group">
        <label>Oxygen Level (%)</label>
        <input type="number" class="form-control" value="${patient.vitals.oxygen}" required>
      </div>
      <div class="form-group">
        <label>Care Notes</label>
        <textarea class="form-control" placeholder="Additional observations or notes"></textarea>
      </div>
      <button type="submit" class="btn btn--primary" style="width: 100%;">Update Record</button>
    </form>
  `;
  
  showModal(content);
}

function submitPatientUpdate(event, patientId) {
  event.preventDefault();
  const btn = event.target.querySelector('button[type="submit"]');
  setLoading(btn, true);
  
  const formData = new FormData(event.target);
  const patient = appState.patients.find(p => p.id === patientId);
  
  setTimeout(() => {
    // Update patient vitals
    if (patient) {
      const inputs = event.target.querySelectorAll('.form-control');
      patient.vitals.heartRate = parseInt(inputs[0].value);
      patient.vitals.bloodPressure = inputs[1].value;
      patient.vitals.temperature = parseFloat(inputs[2].value);
      patient.vitals.oxygen = parseInt(inputs[3].value);
    }
    
    setLoading(btn, false);
    hideModal();
    showToast('Patient record updated successfully!', 'success');
    renderNursePatients();
  }, 1000);
}

function renderNurseChart() {
  const ctx = document.getElementById('nurse-chart');
  if (!ctx) return;
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Medication', 'Vitals', 'Care', 'Documentation'],
      datasets: [{
        label: 'Tasks Completed',
        data: [28, 35, 22, 18],
        backgroundColor: ['#00d4ff', '#00ffaa', '#7c3aed', '#f59e0b']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#e5e5e5' } }
      },
      scales: {
        y: { ticks: { color: '#e5e5e5' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
        x: { ticks: { color: '#e5e5e5' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
      }
    }
  });
}

// Patient Portal
function initPatientPortal() {
  renderPatientAppointments();
  renderPatientReports();
  appState.notificationCount = 2;
  updateNotificationBadge();
  
  // Add event listener for book new appointment
  const bookNewBtn = document.getElementById('book-new-appointment');
  if (bookNewBtn) {
    bookNewBtn.addEventListener('click', openBookingModal);
  }
}

function renderPatientAppointments() {
  const container = document.getElementById('patient-appointments-list');
  container.innerHTML = appState.appointments.map(apt => `
    <div class="appointment-card">
      <div>
        <h4>${apt.date} at ${apt.time}</h4>
        <p style="color: var(--text-muted);">${apt.doctor} - ${apt.department}</p>
      </div>
      <span class="status-badge ${apt.status}">${apt.status.toUpperCase()}</span>
    </div>
  `).join('');
}

function renderPatientReports() {
  const container = document.getElementById('patient-reports-grid');
  container.innerHTML = appState.reports.map(report => `
    <div class="report-card">
      <h4>${report.type}</h4>
      <p style="color: var(--text-muted); margin: 12px 0;">Date: ${report.date}</p>
      <span class="status-badge success">${report.status}</span>
      <div style="margin-top: 16px; display: flex; gap: 12px;">
        <button class="btn btn--primary btn--sm" onclick="downloadReport(${report.id})">
          Download Report
        </button>
        <button class="btn btn--outline btn--sm" onclick="subscribeNotifications()">
          Get Notification
        </button>
      </div>
    </div>
  `).join('');
}

function downloadReport(reportId) {
  const report = appState.reports.find(r => r.id === reportId);
  if (!report) return;
  
  const btn = event.target;
  setLoading(btn, true);
  
  setTimeout(() => {
    // Create fake PDF download
    const blob = new Blob([`Medical Report: ${report.type}\n\nDate: ${report.date}\nStatus: ${report.status}\n\nThis is a sample medical report.`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.type.replace(' ', '_')}_${report.date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    setLoading(btn, false);
    showToast('Report downloaded successfully!', 'success');
  }, 1000);
}

function subscribeNotifications() {
  const btn = event.target;
  setLoading(btn, true);
  
  setTimeout(() => {
    setLoading(btn, false);
    appState.notificationCount++;
    updateNotificationBadge();
    showToast('Successfully subscribed to notifications!', 'success');
  }, 1000);
}

function updateNotificationBadge() {
  const badge = document.getElementById('notification-badge');
  if (badge) {
    badge.textContent = appState.notificationCount;
    badge.style.display = appState.notificationCount > 0 ? 'flex' : 'none';
  }
}

// Staff Portal
function initStaffPortal() {
  renderStaffAlerts();
  renderDischargeList();
  renderStaffChart();
}

function renderStaffAlerts() {
  const container = document.getElementById('staff-alerts-list');
  container.innerHTML = appState.staffAlerts.map(alert => `
    <div class="alert-card ${alert.priority}">
      <div>
        <h4>${alert.title}</h4>
        <p style="color: var(--text-muted);">${alert.time}</p>
      </div>
      <button class="btn btn--primary" onclick="respondToAlert(${alert.id})">
        Respond
      </button>
    </div>
  `).join('');
}

function renderDischargeList() {
  const container = document.getElementById('staff-discharge-list');
  container.innerHTML = appState.dischargePatients.map(patient => `
    <div class="discharge-card">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
        <div>
          <h4>${patient.name}</h4>
          <p style="color: var(--text-muted);">Room: ${patient.room}</p>
          <p style="color: var(--text-muted); font-size: 14px;">Ready since: ${patient.readySince}</p>
        </div>
      </div>
      <div class="discharge-criteria">
        <div class="criteria-item ${patient.criteria.medicalClearance ? 'met' : 'pending'}">
          ${patient.criteria.medicalClearance ? '✓' : '○'} Medical Clearance
        </div>
        <div class="criteria-item ${patient.criteria.billsCleared ? 'met' : 'pending'}">
          ${patient.criteria.billsCleared ? '✓' : '○'} Bills Cleared
        </div>
        <div class="criteria-item ${patient.criteria.transportArranged ? 'met' : 'pending'}">
          ${patient.criteria.transportArranged ? '✓' : '○'} Transport Arranged
        </div>
      </div>
      <div style="display: flex; gap: 12px; margin-top: 16px;">
        <button class="btn btn--primary" onclick="processDischarge(${patient.id})">
          Process Discharge
        </button>
        <button class="btn btn--outline" onclick="initiateTransfer(${patient.id})">
          Initiate Transfer
        </button>
      </div>
    </div>
  `).join('');
}

function respondToAlert(alertId) {
  const alert = appState.staffAlerts.find(a => a.id === alertId);
  if (!alert) return;
  
  const content = `
    <div class="modal-header">
      <h3>Respond to Alert</h3>
      <button class="modal-close" onclick="hideModal()">&times;</button>
    </div>
    <div style="margin-bottom: 24px;">
      <h4>${alert.title}</h4>
      <p style="color: var(--text-muted);">${alert.time}</p>
    </div>
    <form onsubmit="submitAlertResponse(event, ${alertId})">
      <div class="form-group">
        <label>Response Action</label>
        <select class="form-control" required>
          <option value="">Select action...</option>
          <option value="acknowledged">Acknowledge</option>
          <option value="assigned">Assign to Team</option>
          <option value="resolved">Mark as Resolved</option>
          <option value="escalated">Escalate</option>
        </select>
      </div>
      <div class="form-group">
        <label>Notes</label>
        <textarea class="form-control" placeholder="Response details..." required></textarea>
      </div>
      <button type="submit" class="btn btn--primary" style="width: 100%;">Submit Response</button>
    </form>
  `;
  
  showModal(content);
}

function submitAlertResponse(event, alertId) {
  event.preventDefault();
  const btn = event.target.querySelector('button[type="submit"]');
  setLoading(btn, true);
  
  setTimeout(() => {
    const alertIndex = appState.staffAlerts.findIndex(a => a.id === alertId);
    if (alertIndex !== -1) {
      appState.staffAlerts.splice(alertIndex, 1);
    }
    
    setLoading(btn, false);
    hideModal();
    showToast('Alert response submitted successfully!', 'success');
    renderStaffAlerts();
  }, 1000);
}

function processDischarge(patientId) {
  const patient = appState.dischargePatients.find(p => p.id === patientId);
  if (!patient) return;
  
  const allCriteriaMet = patient.criteria.medicalClearance && 
                         patient.criteria.billsCleared && 
                         patient.criteria.transportArranged;
  
  const content = `
    <div class="modal-header">
      <h3>Process Discharge: ${patient.name}</h3>
      <button class="modal-close" onclick="hideModal()">&times;</button>
    </div>
    <div style="margin-bottom: 24px;">
      <p><strong>Room:</strong> ${patient.room}</p>
      <p><strong>Ready Since:</strong> ${patient.readySince}</p>
    </div>
    ${!allCriteriaMet ? '<div style="background: rgba(245, 158, 11, 0.1); border: 1px solid var(--warning); padding: 12px; border-radius: 8px; margin-bottom: 24px;"><strong>Warning:</strong> Not all discharge criteria are met.</div>' : ''}
    <form onsubmit="submitDischarge(event, ${patientId})">
      <div class="form-group">
        <label>Discharge Summary</label>
        <textarea class="form-control" placeholder="Final condition, medications, follow-up instructions..." required></textarea>
      </div>
      <div class="form-group">
        <label>Follow-up Appointment</label>
        <input type="date" class="form-control" required>
      </div>
      <div class="form-group">
        <label>Discharge Medications</label>
        <textarea class="form-control" placeholder="List medications and instructions..." required></textarea>
      </div>
      <button type="submit" class="btn btn--primary" style="width: 100%;">Complete Discharge</button>
    </form>
  `;
  
  showModal(content);
}

function submitDischarge(event, patientId) {
  event.preventDefault();
  const btn = event.target.querySelector('button[type="submit"]');
  setLoading(btn, true);
  
  setTimeout(() => {
    const patientIndex = appState.dischargePatients.findIndex(p => p.id === patientId);
    if (patientIndex !== -1) {
      appState.dischargePatients.splice(patientIndex, 1);
    }
    
    setLoading(btn, false);
    hideModal();
    showToast('Patient discharged successfully!', 'success');
    renderDischargeList();
  }, 1500);
}

function initiateTransfer(patientId) {
  const patient = appState.dischargePatients.find(p => p.id === patientId);
  if (!patient) return;
  
  const content = `
    <div class="modal-header">
      <h3>Initiate Transfer: ${patient.name}</h3>
      <button class="modal-close" onclick="hideModal()">&times;</button>
    </div>
    <form onsubmit="submitTransfer(event, ${patientId})">
      <div class="form-group">
        <label>Transfer Type</label>
        <select class="form-control" required>
          <option value="">Select type...</option>
          <option value="ward">Ward Transfer</option>
          <option value="icu">ICU Transfer</option>
          <option value="hospital">Hospital Transfer</option>
          <option value="facility">Long-term Facility</option>
        </select>
      </div>
      <div class="form-group">
        <label>Destination</label>
        <input type="text" class="form-control" placeholder="Ward/Hospital name" required>
      </div>
      <div class="form-group">
        <label>Reason for Transfer</label>
        <textarea class="form-control" required></textarea>
      </div>
      <div class="form-group">
        <label>Transport Method</label>
        <select class="form-control" required>
          <option value="">Select method...</option>
          <option value="ambulance">Ambulance</option>
          <option value="wheelchair">Wheelchair</option>
          <option value="bed">Hospital Bed</option>
          <option value="walking">Walking</option>
        </select>
      </div>
      <div class="form-group">
        <label>Scheduled Time</label>
        <input type="datetime-local" class="form-control" required>
      </div>
      <button type="submit" class="btn btn--primary" style="width: 100%;">Initiate Transfer</button>
    </form>
  `;
  
  showModal(content);
}

function submitTransfer(event, patientId) {
  event.preventDefault();
  const btn = event.target.querySelector('button[type="submit"]');
  setLoading(btn, true);
  
  setTimeout(() => {
    setLoading(btn, false);
    hideModal();
    showToast('Transfer initiated successfully!', 'success');
  }, 1000);
}

function renderStaffChart() {
  const ctx = document.getElementById('staff-chart');
  if (!ctx) return;
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Discharges', 'Transfers', 'Admissions', 'Pending'],
      datasets: [{
        data: [45, 28, 35, 12],
        backgroundColor: ['#00d4ff', '#00ffaa', '#7c3aed', '#f59e0b']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#e5e5e5', padding: 15 }
        }
      }
    }
  });
}

// Appointment Booking
function openBookingModal() {
  const content = `
    <div class="modal-header">
      <h3>Book Appointment</h3>
      <button class="modal-close" onclick="hideModal()">&times;</button>
    </div>
    <form onsubmit="submitAppointment(event)">
      <div class="form-group">
        <label>Department</label>
        <select class="form-control" id="appointment-department" onchange="updateDoctorsList()" required>
          <option value="">Select department...</option>
          ${appState.departments.map(dept => `<option value="${dept}">${dept}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Doctor</label>
        <select class="form-control" id="appointment-doctor" required>
          <option value="">Select doctor...</option>
        </select>
      </div>
      <div class="form-group">
        <label>Appointment Date</label>
        <input type="date" class="form-control" required min="${new Date().toISOString().split('T')[0]}">
      </div>
      <div class="form-group">
        <label>Preferred Time</label>
        <select class="form-control" id="appointment-time" required>
          <option value="">Select time...</option>
        </select>
      </div>
      <div class="form-group">
        <label>Reason for Visit</label>
        <textarea class="form-control" placeholder="Briefly describe your symptoms or reason for visit" required></textarea>
      </div>
      <button type="submit" class="btn btn--primary" style="width: 100%;">Book Appointment</button>
    </form>
  `;
  
  showModal(content);
}

function updateDoctorsList() {
  const deptSelect = document.getElementById('appointment-department');
  const doctorSelect = document.getElementById('appointment-doctor');
  const timeSelect = document.getElementById('appointment-time');
  
  const selectedDept = deptSelect.value;
  const filteredDoctors = appState.doctors.filter(d => d.specialty === selectedDept);
  
  doctorSelect.innerHTML = '<option value="">Select doctor...</option>' +
    filteredDoctors.map(doc => `<option value="${doc.name}">${doc.name}</option>`).join('');
  
  doctorSelect.addEventListener('change', () => {
    const selectedDoctor = appState.doctors.find(d => d.name === doctorSelect.value);
    if (selectedDoctor) {
      timeSelect.innerHTML = '<option value="">Select time...</option>' +
        selectedDoctor.availableSlots.map(slot => `<option value="${slot}">${slot}</option>`).join('');
    }
  });
}

function submitAppointment(event) {
  event.preventDefault();
  const btn = event.target.querySelector('button[type="submit"]');
  setLoading(btn, true);
  
  setTimeout(() => {
    const newAppointment = {
      id: appState.appointments.length + 1,
      date: event.target.querySelector('input[type="date"]').value,
      time: document.getElementById('appointment-time').value,
      doctor: document.getElementById('appointment-doctor').value,
      department: document.getElementById('appointment-department').value,
      status: 'upcoming'
    };
    
    appState.appointments.push(newAppointment);
    
    setLoading(btn, false);
    hideModal();
    showToast('Appointment booked successfully!', 'success');
    
    if (appState.currentRole === 'patient') {
      renderPatientAppointments();
    }
  }, 1000);
}