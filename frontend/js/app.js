/**
 * Hospital Management System - Frontend Controller
 * Connects frontend (Vercel) to backend REST API (Render)
 */

(function () {
  'use strict';

  // --- Configuration ---
  const DEFAULT_LOCAL_API = 'http://localhost:5000';
  let API_BASE_URL = localStorage.getItem('HOSPITAL_API_URL');

  if (!API_BASE_URL) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      API_BASE_URL = DEFAULT_LOCAL_API;
    } else {
      // In production (Vercel), default to empty or stored URL
      API_BASE_URL = window.location.origin.includes('vercel.app')
        ? '' // Will prompt user to configure Render URL if not set
        : DEFAULT_LOCAL_API;
    }
  }

  // --- DOM Elements ---
  const connectionBanner = document.getElementById('connectionBanner');
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  const btnOpenApiSettings = document.getElementById('btnOpenApiSettings');
  const btnHeaderApiConfig = document.getElementById('btnHeaderApiConfig');

  const loginScreen = document.getElementById('loginScreen');
  const dashboardScreen = document.getElementById('dashboardScreen');
  const loginForm = document.getElementById('loginForm');
  const loginUser = document.getElementById('loginUser');
  const loginPassword = document.getElementById('loginPassword');
  const loginError = document.getElementById('loginError');
  const btnQuickDemo = document.getElementById('btnQuickDemo');
  const btnLogout = document.getElementById('btnLogout');
  const liveClock = document.getElementById('liveClock');

  // Stats
  const statPatientsCount = document.getElementById('statPatientsCount');
  const statRoomsCount = document.getElementById('statRoomsCount');
  const statStaffCount = document.getElementById('statStaffCount');
  const statAmbulanceCount = document.getElementById('statAmbulanceCount');

  // Modals
  const modals = document.querySelectorAll('.modal-backdrop');

  // --- State ---
  let currentUser = localStorage.getItem('hospital_user') || null;
  let cachedPatients = [];
  let cachedRooms = [];

  // ==========================================
  // INITIALIZATION
  // ==========================================
  function init() {
    setupEventListeners();
    startClock();
    checkBackendHealth();

    if (currentUser) {
      showDashboard();
    } else {
      showLogin();
    }
  }

  // ==========================================
  // API HELPERS & HEALTH CHECK
  // ==========================================
  async function apiRequest(endpoint, options = {}) {
    if (!API_BASE_URL) {
      openModal('modalApiSettings');
      throw new Error('Please configure your Render Backend API URL first.');
    }

    const cleanBase = API_BASE_URL.replace(/\/+$/, '');
    const url = `${cleanBase}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        ...options
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `API request failed with status ${response.status}`);
      }
      return data;
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err);
      throw err;
    }
  }

  async function checkBackendHealth() {
    if (!API_BASE_URL) {
      statusDot.className = 'status-dot offline';
      statusText.innerHTML = '⚠️ Backend URL not configured. Click to set your Render API URL.';
      return;
    }

    try {
      statusDot.className = 'status-dot';
      statusText.textContent = `Connecting to ${API_BASE_URL}...`;

      const res = await apiRequest('/api/health');
      if (res && res.status === 'ok') {
        statusDot.className = 'status-dot online';
        statusText.innerHTML = `🟢 Backend Online: <strong>${escapeHtml(API_BASE_URL)}</strong>`;
      } else {
        throw new Error();
      }
    } catch (err) {
      statusDot.className = 'status-dot offline';
      statusText.innerHTML = `🔴 Backend Unreachable: <code>${escapeHtml(API_BASE_URL)}</code> (May be waking up on Render)`;
    }
  }

  // ==========================================
  // AUTHENTICATION
  // ==========================================
  function showLogin() {
    loginScreen.classList.remove('hidden');
    loginScreen.classList.add('active');
    dashboardScreen.classList.add('hidden');
  }

  function showDashboard() {
    loginScreen.classList.add('hidden');
    dashboardScreen.classList.remove('hidden');
    loadDashboardMetrics();
  }

  async function handleLogin(e) {
    e.preventDefault();
    loginError.classList.add('hidden');

    const username = loginUser.value.trim();
    const password = loginPassword.value;

    if (!username || !password) {
      showError(loginError, 'Please enter username and password');
      return;
    }

    const submitBtn = document.getElementById('btnLogin');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Verifying...';

    try {
      const res = await apiRequest('/api/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });

      if (res.success) {
        currentUser = res.user.username;
        localStorage.setItem('hospital_user', currentUser);
        showDashboard();
      } else {
        showError(loginError, res.message || 'Invalid credentials');
      }
    } catch (err) {
      showError(
        loginError,
        `Cannot reach backend at ${API_BASE_URL || 'unspecified'}. Please check your Render URL. Details: ${err.message}`
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    }
  }

  function handleLogout() {
    currentUser = null;
    localStorage.removeItem('hospital_user');
    showLogin();
  }

  // ==========================================
  // DASHBOARD METRICS
  // ==========================================
  async function loadDashboardMetrics() {
    try {
      const [patientsRes, roomsRes, empRes, ambRes] = await Promise.all([
        apiRequest('/api/patients'),
        apiRequest('/api/rooms'),
        apiRequest('/api/employees'),
        apiRequest('/api/ambulance')
      ]);

      cachedPatients = patientsRes.data || [];
      cachedRooms = roomsRes.data || [];

      statPatientsCount.textContent = cachedPatients.length;
      const availableRooms = cachedRooms.filter(r => r.Availability.toLowerCase() === 'available');
      statRoomsCount.textContent = availableRooms.length;
      statStaffCount.textContent = (empRes.data || []).length;
      const availableAmb = (ambRes.data || []).filter(a => a.Availability.toLowerCase() === 'available');
      statAmbulanceCount.textContent = `${availableAmb.length} / ${(ambRes.data || []).length}`;
    } catch (err) {
      console.warn('Could not load dashboard metrics:', err);
    }
  }

  // ==========================================
  // MODAL LOGIC & MODULES
  // ==========================================
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('hidden');

    // Trigger specific loaders
    switch (modalId) {
      case 'modalNewPatient':
        loadNewPatientForm();
        break;
      case 'modalRoom':
        loadRoomsTable();
        break;
      case 'modalSearchRoom':
        executeSearchRoom();
        break;
      case 'modalDepartment':
        loadDepartmentsTable();
        break;
      case 'modalEmployee':
        loadEmployeesTable();
        break;
      case 'modalPatientInfo':
        loadPatientsTable();
        break;
      case 'modalUpdatePatient':
        loadUpdatePatientModal();
        break;
      case 'modalDischarge':
        loadDischargeModal();
        break;
      case 'modalAmbulance':
        loadAmbulanceTable();
        break;
      case 'modalApiSettings':
        document.getElementById('apiUrlInput').value = API_BASE_URL || '';
        document.getElementById('apiTestResult').classList.add('hidden');
        break;
    }
  }

  function closeModal(modal) {
    if (modal) modal.classList.add('hidden');
  }

  // 1. NEW PATIENT
  async function loadNewPatientForm() {
    document.getElementById('patientTime').value = new Date().toLocaleString();
    const select = document.getElementById('patientRoom');
    select.innerHTML = '<option value="">Loading available rooms...</option>';

    try {
      const res = await apiRequest('/api/rooms/search?status=Available');
      const rooms = res.data || [];
      if (rooms.length === 0) {
        select.innerHTML = '<option value="">No rooms available</option>';
      } else {
        select.innerHTML = '<option value="">Select available room...</option>' +
          rooms.map(r => `<option value="${r.room_no}">Room ${r.room_no} - ${r.Bed_Type} (Rs ${r.Price})</option>`).join('');
      }
    } catch (err) {
      select.innerHTML = `<option value="">Error loading rooms</option>`;
    }
  }

  async function handleNewPatientSubmit(e) {
    e.preventDefault();
    const form = e.target;

    const payload = {
      idType: document.getElementById('patientIdType').value,
      number: document.getElementById('patientNumber').value.trim(),
      name: document.getElementById('patientName').value.trim(),
      gender: form.querySelector('input[name="patientGender"]:checked').value,
      disease: document.getElementById('patientDisease').value.trim(),
      room: document.getElementById('patientRoom').value,
      time: document.getElementById('patientTime').value,
      deposit: document.getElementById('patientDeposit').value.trim()
    };

    if (!payload.room) {
      alert('Please select an available room');
      return;
    }

    try {
      const res = await apiRequest('/api/patients', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      alert('Patient Added Successfully!');
      form.reset();
      closeModal(document.getElementById('modalNewPatient'));
      loadDashboardMetrics();
    } catch (err) {
      alert(`Failed to add patient: ${err.message}`);
    }
  }

  // 2. ROOMS TABLE
  async function loadRoomsTable() {
    const tbody = document.querySelector('#tableRooms tbody');
    tbody.innerHTML = '<tr><td colspan="4" class="text-center">Loading rooms...</td></tr>';

    try {
      const res = await apiRequest('/api/rooms');
      const rooms = res.data || [];
      if (rooms.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No rooms registered.</td></tr>';
        return;
      }

      tbody.innerHTML = rooms.map(r => `
        <tr>
          <td><strong>${escapeHtml(r.room_no)}</strong></td>
          <td>
            <span class="badge ${r.Availability.toLowerCase() === 'available' ? 'badge-available' : 'badge-occupied'}">
              ${escapeHtml(r.Availability)}
            </span>
          </td>
          <td>Rs. ${escapeHtml(r.Price)}</td>
          <td>${escapeHtml(r.Bed_Type)}</td>
        </tr>
      `).join('');
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-center error">Failed to load rooms: ${err.message}</td></tr>`;
    }
  }

  // 3. SEARCH ROOM
  async function executeSearchRoom() {
    const status = document.getElementById('searchRoomStatus').value;
    const tbody = document.querySelector('#tableSearchRooms tbody');
    tbody.innerHTML = '<tr><td colspan="4" class="text-center">Searching...</td></tr>';

    try {
      const endpoint = status ? `/api/rooms/search?status=${encodeURIComponent(status)}` : '/api/rooms';
      const res = await apiRequest(endpoint);
      const rooms = res.data || [];

      if (rooms.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No matching rooms found.</td></tr>';
        return;
      }

      tbody.innerHTML = rooms.map(r => `
        <tr>
          <td><strong>${escapeHtml(r.room_no)}</strong></td>
          <td>
            <span class="badge ${r.Availability.toLowerCase() === 'available' ? 'badge-available' : 'badge-occupied'}">
              ${escapeHtml(r.Availability)}
            </span>
          </td>
          <td>Rs. ${escapeHtml(r.Price)}</td>
          <td>${escapeHtml(r.Bed_Type)}</td>
        </tr>
      `).join('');
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-center error">Error: ${err.message}</td></tr>`;
    }
  }

  // 4. DEPARTMENTS
  async function loadDepartmentsTable() {
    const tbody = document.querySelector('#tableDepartments tbody');
    tbody.innerHTML = '<tr><td colspan="2" class="text-center">Loading departments...</td></tr>';

    try {
      const res = await apiRequest('/api/departments');
      const depts = res.data || [];

      tbody.innerHTML = depts.map(d => `
        <tr>
          <td><strong>${escapeHtml(d.Department)}</strong></td>
          <td>${escapeHtml(d.Phone_Number)}</td>
        </tr>
      `).join('');
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="2" class="text-center error">Error: ${err.message}</td></tr>`;
    }
  }

  // 5. EMPLOYEES
  async function loadEmployeesTable() {
    const tbody = document.querySelector('#tableEmployees tbody');
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">Loading staff records...</td></tr>';

    try {
      const res = await apiRequest('/api/employees');
      const employees = res.data || [];

      tbody.innerHTML = employees.map(e => `
        <tr>
          <td><strong>${escapeHtml(e.Name)}</strong></td>
          <td>${escapeHtml(String(e.Age))}</td>
          <td>${escapeHtml(e.Phone_Number)}</td>
          <td>Rs. ${escapeHtml(e.Salary)}</td>
          <td><a href="mailto:${escapeHtml(e.Gmail)}">${escapeHtml(e.Gmail)}</a></td>
          <td>${escapeHtml(e.Aadhar_Number)}</td>
        </tr>
      `).join('');
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center error">Error: ${err.message}</td></tr>`;
    }
  }

  // 6. PATIENT INFO
  async function loadPatientsTable() {
    const tbody = document.querySelector('#tablePatients tbody');
    tbody.innerHTML = '<tr><td colspan="8" class="text-center">Loading patient records...</td></tr>';

    try {
      const res = await apiRequest('/api/patients');
      const patients = res.data || [];

      if (patients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">No patients currently admitted.</td></tr>';
        return;
      }

      tbody.innerHTML = patients.map(p => `
        <tr>
          <td>${escapeHtml(p.ID)}</td>
          <td><strong>${escapeHtml(p.Number)}</strong></td>
          <td>${escapeHtml(p.Name)}</td>
          <td>${escapeHtml(p.Gender)}</td>
          <td>${escapeHtml(p.Disease)}</td>
          <td><span class="badge badge-occupied">Room ${escapeHtml(p.Room_Number)}</span></td>
          <td>${escapeHtml(p.Time)}</td>
          <td>Rs. ${escapeHtml(p.Deposit)}</td>
        </tr>
      `).join('');
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center error">Error: ${err.message}</td></tr>`;
    }
  }

  // 7. UPDATE PATIENT DETAILS
  async function loadUpdatePatientModal() {
    const select = document.getElementById('updatePatientSelect');
    select.innerHTML = '<option value="">Loading patients...</option>';

    try {
      const res = await apiRequest('/api/patients');
      const patients = res.data || [];
      cachedPatients = patients;

      if (patients.length === 0) {
        select.innerHTML = '<option value="">No patients available</option>';
        return;
      }

      select.innerHTML = '<option value="">Choose patient...</option>' +
        patients.map(p => `<option value="${escapeHtml(p.Name)}">${escapeHtml(p.Name)} (Room ${escapeHtml(p.Room_Number)})</option>`).join('');
    } catch (err) {
      select.innerHTML = '<option value="">Error loading patients</option>';
    }
  }

  async function handleCheckPatientDetails() {
    const selectedName = document.getElementById('updatePatientSelect').value;
    if (!selectedName) {
      alert('Please select a patient first');
      return;
    }

    const patient = cachedPatients.find(p => p.Name === selectedName);
    if (!patient) return;

    try {
      const res = await apiRequest(`/api/patients/${encodeURIComponent(patient.Number)}`);
      const data = res.data;

      document.getElementById('updateRoomNo').value = data.Room_Number || '';
      document.getElementById('updateCheckInTime').value = data.Time || '';
      document.getElementById('updateAmountPaid').value = data.Deposit || '';
      document.getElementById('updatePendingAmount').value = `Rs. ${data.pendingAmount} (Room Rate: Rs. ${data.roomPrice})`;
    } catch (err) {
      alert(`Could not fetch details: ${err.message}`);
    }
  }

  async function handleUpdatePatientSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('updatePatientSelect').value;
    const room = document.getElementById('updateRoomNo').value.trim();
    const time = document.getElementById('updateCheckInTime').value.trim();
    const deposit = document.getElementById('updateAmountPaid').value.trim();

    if (!name) {
      alert('Please select a patient');
      return;
    }

    try {
      await apiRequest('/api/patients/update', {
        method: 'PUT',
        body: JSON.stringify({ name, room, time, deposit })
      });

      alert('Updated Successfully!');
      closeModal(document.getElementById('modalUpdatePatient'));
      loadDashboardMetrics();
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    }
  }

  // 8. PATIENT DISCHARGE
  async function loadDischargeModal() {
    const select = document.getElementById('dischargePatientNumber');
    select.innerHTML = '<option value="">Loading patient numbers...</option>';
    document.getElementById('dischargeRoomVal').textContent = '-';
    document.getElementById('dischargeInTimeVal').textContent = '-';
    document.getElementById('dischargeOutTimeVal').textContent = '-';
    document.getElementById('btnDischargeSubmit').disabled = true;

    try {
      const res = await apiRequest('/api/patients');
      const patients = res.data || [];
      cachedPatients = patients;

      if (patients.length === 0) {
        select.innerHTML = '<option value="">No patients to discharge</option>';
        return;
      }

      select.innerHTML = '<option value="">Select Patient ID / Number...</option>' +
        patients.map(p => `<option value="${escapeHtml(p.Number)}">${escapeHtml(p.Number)} - ${escapeHtml(p.Name)}</option>`).join('');
    } catch (err) {
      select.innerHTML = '<option value="">Error loading patients</option>';
    }
  }

  async function handleCheckDischarge() {
    const number = document.getElementById('dischargePatientNumber').value;
    if (!number) {
      alert('Please select a patient ID number');
      return;
    }

    try {
      const res = await apiRequest(`/api/patients/${encodeURIComponent(number)}`);
      const patient = res.data;

      document.getElementById('dischargeRoomVal').textContent = `Room ${patient.Room_Number}`;
      document.getElementById('dischargeInTimeVal').textContent = patient.Time;
      document.getElementById('dischargeOutTimeVal').textContent = new Date().toLocaleString();
      document.getElementById('btnDischargeSubmit').disabled = false;
    } catch (err) {
      alert(`Could not fetch details: ${err.message}`);
    }
  }

  async function handleDischargeSubmit(e) {
    e.preventDefault();
    const number = document.getElementById('dischargePatientNumber').value;
    if (!number) return;

    if (!confirm('Are you sure you want to discharge this patient and release the room?')) {
      return;
    }

    try {
      await apiRequest('/api/patients/discharge', {
        method: 'POST',
        body: JSON.stringify({ number })
      });

      alert('Patient Discharged Successfully! Room is now marked Available.');
      closeModal(document.getElementById('modalDischarge'));
      loadDashboardMetrics();
    } catch (err) {
      alert(`Discharge failed: ${err.message}`);
    }
  }

  // 9. AMBULANCE
  async function loadAmbulanceTable() {
    const tbody = document.querySelector('#tableAmbulance tbody');
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Loading fleet...</td></tr>';

    try {
      const res = await apiRequest('/api/ambulance');
      const list = res.data || [];

      tbody.innerHTML = list.map(a => `
        <tr>
          <td><strong>${escapeHtml(a.Name)}</strong></td>
          <td>${escapeHtml(a.Gender)}</td>
          <td>${escapeHtml(a.Car_Name)}</td>
          <td>
            <span class="badge ${a.Availability.toLowerCase() === 'available' ? 'badge-available' : 'badge-busy'}">
              ${escapeHtml(a.Availability)}
            </span>
          </td>
          <td>📍 ${escapeHtml(a.Location)}</td>
        </tr>
      `).join('');
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center error">Error: ${err.message}</td></tr>`;
    }
  }

  // ==========================================
  // API CONFIGURATION MODAL
  // ==========================================
  async function testApiConnection() {
    const inputVal = document.getElementById('apiUrlInput').value.trim();
    const resultBox = document.getElementById('apiTestResult');
    resultBox.classList.remove('hidden', 'error', 'success');
    resultBox.classList.add('info');
    resultBox.textContent = 'Testing connection...';

    if (!inputVal) {
      resultBox.classList.remove('info');
      resultBox.classList.add('error');
      resultBox.textContent = 'Please enter a valid URL';
      return;
    }

    try {
      const cleanUrl = inputVal.replace(/\/+$/, '');
      const response = await fetch(`${cleanUrl}/api/health`, { method: 'GET' });
      const data = await response.json();

      if (response.ok && data.status === 'ok') {
        resultBox.classList.remove('info');
        resultBox.classList.add('success');
        resultBox.innerHTML = `✅ Successfully connected to backend API! (Uptime: ${Math.round(data.uptime)}s)`;
      } else {
        throw new Error('Unexpected response');
      }
    } catch (err) {
      resultBox.classList.remove('info');
      resultBox.classList.add('error');
      resultBox.innerHTML = `❌ Connection failed: ${err.message}. If deploying to Render free tier, the service may be spinning up (takes 30-50s).`;
    }
  }

  function saveApiConfiguration() {
    const inputVal = document.getElementById('apiUrlInput').value.trim();
    if (inputVal) {
      API_BASE_URL = inputVal.replace(/\/+$/, '');
      localStorage.setItem('HOSPITAL_API_URL', API_BASE_URL);
    } else {
      API_BASE_URL = '';
      localStorage.removeItem('HOSPITAL_API_URL');
    }

    checkBackendHealth();
    closeModal(document.getElementById('modalApiSettings'));
    if (currentUser) loadDashboardMetrics();
  }

  // ==========================================
  // EVENT LISTENERS & HELPERS
  // ==========================================
  function setupEventListeners() {
    // Login & Logout
    loginForm.addEventListener('submit', handleLogin);
    btnLogout.addEventListener('click', handleLogout);

    btnQuickDemo.addEventListener('click', () => {
      loginUser.value = 'admin';
      loginPassword.value = 'admin123';
    });

    // API Config triggers
    btnOpenApiSettings.addEventListener('click', () => openModal('modalApiSettings'));
    btnHeaderApiConfig.addEventListener('click', () => openModal('modalApiSettings'));
    document.getElementById('btnTestApi').addEventListener('click', testApiConnection);
    document.getElementById('btnSaveApi').addEventListener('click', saveApiConfiguration);

    // Nav ribbon modal triggers
    document.querySelectorAll('.nav-btn[data-modal]').forEach(btn => {
      btn.addEventListener('click', () => openModal(btn.getAttribute('data-modal')));
    });

    // Close modal triggers
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-backdrop');
        closeModal(modal);
      });
    });

    // Close modal on outside backdrop click
    modals.forEach(m => {
      m.addEventListener('click', (e) => {
        if (e.target === m) closeModal(m);
      });
    });

    // Forms inside modals
    document.getElementById('formNewPatient').addEventListener('submit', handleNewPatientSubmit);
    document.getElementById('btnExecuteSearchRoom').addEventListener('click', executeSearchRoom);
    document.getElementById('searchRoomStatus').addEventListener('change', executeSearchRoom);

    document.getElementById('btnCheckPatient').addEventListener('click', handleCheckPatientDetails);
    document.getElementById('formUpdatePatient').addEventListener('submit', handleUpdatePatientSubmit);

    document.getElementById('btnCheckDischarge').addEventListener('click', handleCheckDischarge);
    document.getElementById('formDischarge').addEventListener('submit', handleDischargeSubmit);

    // Keyboard ESC to close modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        modals.forEach(m => closeModal(m));
      }
    });
  }

  function startClock() {
    function tick() {
      const now = new Date();
      liveClock.textContent = now.toLocaleTimeString();
    }
    tick();
    setInterval(tick, 1000);
  }

  function showError(el, msg) {
    el.textContent = msg;
    el.classList.remove('hidden');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Self-start
  document.addEventListener('DOMContentLoaded', init);
})();
