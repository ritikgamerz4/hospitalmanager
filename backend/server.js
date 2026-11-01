const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// In-Memory / File Persistent Database Store
// (Works out of the box with zero external DB dependencies,
// perfectly suited for Render free tier!)
// ==========================================
const DB_FILE = path.join(__dirname, 'hospital_data.json');

const INITIAL_DATA = {
  Login: [
    { ID: 'admin', PW: 'admin123' },
    { ID: 'doctor', PW: 'doctor123' },
    { ID: 'reception', PW: 'reception123' }
  ],
  room: [
    { room_no: '101', Availability: 'Available', Price: '500', Bed_Type: 'Single Bed' },
    { room_no: '102', Availability: 'Occupied', Price: '500', Bed_Type: 'Single Bed' },
    { room_no: '103', Availability: 'Available', Price: '1000', Bed_Type: 'Double Bed' },
    { room_no: '104', Availability: 'Available', Price: '1000', Bed_Type: 'Double Bed' },
    { room_no: '201', Availability: 'Available', Price: '1500', Bed_Type: 'Single Bed (AC)' },
    { room_no: '202', Availability: 'Occupied', Price: '2000', Bed_Type: 'Double Bed (AC)' },
    { room_no: '301', Availability: 'Available', Price: '3000', Bed_Type: 'ICU Bed' },
    { room_no: '302', Availability: 'Available', Price: '3000', Bed_Type: 'ICU Bed' }
  ],
  department: [
    { Department: 'Emergency & Trauma', Phone_Number: '011-26594444' },
    { Department: 'Cardiology', Phone_Number: '011-26594401' },
    { Department: 'Neurology', Phone_Number: '011-26594402' },
    { Department: 'Orthopedics', Phone_Number: '011-26594403' },
    { Department: 'Pediatrics', Phone_Number: '011-26594404' },
    { Department: 'General Surgery', Phone_Number: '011-26594405' },
    { Department: 'Radiology & Imaging', Phone_Number: '011-26594406' },
    { Department: 'Pharmacy', Phone_Number: '011-26594407' }
  ],
  EMP_INFO: [
    { Name: 'Dr. Ramesh Sharma', Age: 45, Phone_Number: '9811002233', Salary: '150000', Gmail: 'dr.ramesh@hospital.com', Aadhar_Number: '2345-6789-0123' },
    { Name: 'Dr. Priya Verma', Age: 38, Phone_Number: '9822113344', Salary: '135000', Gmail: 'dr.priya@hospital.com', Aadhar_Number: '3456-7890-1234' },
    { Name: 'Dr. Anil Mehta', Age: 50, Phone_Number: '9833224455', Salary: '160000', Gmail: 'dr.anil@hospital.com', Aadhar_Number: '4567-8901-2345' },
    { Name: 'Sister Sunita Devi', Age: 32, Phone_Number: '9844335566', Salary: '45000', Gmail: 'sunita.devi@hospital.com', Aadhar_Number: '5678-9012-3456' },
    { Name: 'Brother Rajesh Paul', Age: 29, Phone_Number: '9855446677', Salary: '42000', Gmail: 'rajesh.paul@hospital.com', Aadhar_Number: '6789-0123-4567' }
  ],
  Ambulance: [
    { Name: 'Manoj Yadav', Gender: 'Male', Car_Name: 'Force Traveler (ICU-1)', Availability: 'Available', Location: 'Emergency Gate 1' },
    { Name: 'Vikas Kumar', Gender: 'Male', Car_Name: 'Tata Winger (Basic-2)', Availability: 'Busy', Location: 'Sector 15 City Pick-up' },
    { Name: 'Deepak Singh', Gender: 'Male', Car_Name: 'Mahindra Bolero (Adv-3)', Availability: 'Available', Location: 'Trauma Centre Standby' },
    { Name: 'Sunil Sharma', Gender: 'Male', Car_Name: 'Force Traveler (ICU-4)', Availability: 'Available', Location: 'Ambulance Bay B' }
  ],
  Patient_Info: [
    {
      ID: 'Aadhar Card',
      Number: 'ADR-9021',
      Name: 'Rohan Gupta',
      Gender: 'Male',
      Disease: 'Viral Fever',
      Room_Number: '102',
      Time: 'Sun Nov 01 10:30:00 IST 2026',
      Deposit: '500'
    },
    {
      ID: 'Driving License',
      Number: 'DL-4482',
      Name: 'Anjali Rao',
      Gender: 'Female',
      Disease: 'Fracture',
      Room_Number: '202',
      Time: 'Sun Nov 01 14:15:00 IST 2026',
      Deposit: '1200'
    }
  ]
};

// Load or initialize data
let db = {};
function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(content);
      // Ensure all tables exist
      for (const key of Object.keys(INITIAL_DATA)) {
        if (!db[key]) db[key] = INITIAL_DATA[key];
      }
    } else {
      db = JSON.parse(JSON.stringify(INITIAL_DATA));
      saveDb();
    }
  } catch (err) {
    console.error('Error loading database, resetting to initial data:', err);
    db = JSON.parse(JSON.stringify(INITIAL_DATA));
    saveDb();
  }
}

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

loadDb();

// ==========================================
// REST API ROUTES
// ==========================================

// Health check / root
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Hospital Management System API is running successfully!',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/login',
      '/api/rooms',
      '/api/rooms/search',
      '/api/departments',
      '/api/employees',
      '/api/patients',
      '/api/patients/:number',
      '/api/patients/update',
      '/api/patients/discharge',
      '/api/ambulance',
      '/api/health'
    ]
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Authentication
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  const user = db.Login.find(u => u.ID === username && u.PW === password);
  if (user) {
    res.json({
      success: true,
      message: 'Login successful',
      user: { username: user.ID }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid username or password'
    });
  }
});

// Rooms
app.get('/api/rooms', (req, res) => {
  res.json({ success: true, data: db.room });
});

app.get('/api/rooms/search', (req, res) => {
  const { status } = req.query;
  if (!status) {
    return res.json({ success: true, data: db.room });
  }
  const filtered = db.room.filter(
    r => r.Availability.toLowerCase() === status.toLowerCase()
  );
  res.json({ success: true, data: filtered });
});

// Departments
app.get('/api/departments', (req, res) => {
  res.json({ success: true, data: db.department });
});

// Employees
app.get('/api/employees', (req, res) => {
  res.json({ success: true, data: db.EMP_INFO });
});

// Ambulances
app.get('/api/ambulance', (req, res) => {
  res.json({ success: true, data: db.Ambulance });
});

// Patients
app.get('/api/patients', (req, res) => {
  res.json({ success: true, data: db.Patient_Info });
});

app.get('/api/patients/:number', (req, res) => {
  const { number } = req.params;
  const patient = db.Patient_Info.find(p => p.Number === number);
  if (!patient) {
    return res.status(404).json({ success: false, message: 'Patient not found' });
  }

  // Find room price to compute pending amount
  const room = db.room.find(r => r.room_no === patient.Room_Number);
  const roomPrice = room ? parseInt(room.Price, 10) || 0 : 0;
  const deposit = parseInt(patient.Deposit, 10) || 0;
  const pendingAmount = Math.max(0, roomPrice - deposit);

  res.json({
    success: true,
    data: {
      ...patient,
      roomPrice,
      pendingAmount
    }
  });
});

// Add New Patient
app.post('/api/patients', (req, res) => {
  const { idType, number, name, gender, disease, room, time, deposit } = req.body;

  if (!idType || !number || !name || !gender || !disease || !room) {
    return res.status(400).json({ success: false, message: 'All required fields must be filled' });
  }

  const existing = db.Patient_Info.find(p => p.Number === number);
  if (existing) {
    return res.status(400).json({ success: false, message: 'Patient with this ID number already exists' });
  }

  const newPatient = {
    ID: idType,
    Number: number,
    Name: name,
    Gender: gender,
    Disease: disease,
    Room_Number: room,
    Time: time || new Date().toString(),
    Deposit: deposit || '0'
  };

  db.Patient_Info.push(newPatient);

  // Mark room as occupied
  const roomIndex = db.room.findIndex(r => r.room_no === room);
  if (roomIndex !== -1) {
    db.room[roomIndex].Availability = 'Occupied';
  }

  saveDb();
  res.status(201).json({ success: true, message: 'Patient registered successfully', data: newPatient });
});

// Update Patient Details
app.put('/api/patients/update', (req, res) => {
  const { name, room, time, deposit } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Patient name is required' });
  }

  const patientIndex = db.Patient_Info.findIndex(
    p => p.Name.toLowerCase() === name.toLowerCase()
  );

  if (patientIndex === -1) {
    return res.status(404).json({ success: false, message: 'Patient not found' });
  }

  const oldRoom = db.Patient_Info[patientIndex].Room_Number;

  if (room && room !== oldRoom) {
    // Free up old room
    const oldRoomIdx = db.room.findIndex(r => r.room_no === oldRoom);
    if (oldRoomIdx !== -1) db.room[oldRoomIdx].Availability = 'Available';

    // Occupy new room
    const newRoomIdx = db.room.findIndex(r => r.room_no === room);
    if (newRoomIdx !== -1) db.room[newRoomIdx].Availability = 'Occupied';

    db.Patient_Info[patientIndex].Room_Number = room;
  }

  if (time !== undefined) db.Patient_Info[patientIndex].Time = time;
  if (deposit !== undefined) db.Patient_Info[patientIndex].Deposit = deposit;

  saveDb();
  res.json({
    success: true,
    message: 'Patient details updated successfully',
    data: db.Patient_Info[patientIndex]
  });
});

// Patient Discharge
app.post('/api/patients/discharge', (req, res) => {
  const { number } = req.body;
  if (!number) {
    return res.status(400).json({ success: false, message: 'Patient number is required' });
  }

  const patientIndex = db.Patient_Info.findIndex(p => p.Number === number);
  if (patientIndex === -1) {
    return res.status(404).json({ success: false, message: 'Patient not found' });
  }

  const dischargedPatient = db.Patient_Info[patientIndex];
  const roomNo = dischargedPatient.Room_Number;

  // Remove patient
  db.Patient_Info.splice(patientIndex, 1);

  // Set room availability back to 'Available'
  if (roomNo) {
    const roomIndex = db.room.findIndex(r => r.room_no === roomNo);
    if (roomIndex !== -1) {
      db.room[roomIndex].Availability = 'Available';
    }
  }

  saveDb();
  res.json({
    success: true,
    message: 'Patient discharged successfully and room marked as Available',
    dischargedPatient
  });
});

// Reset Demo Data
app.post('/api/reset', (req, res) => {
  db = JSON.parse(JSON.stringify(INITIAL_DATA));
  saveDb();
  res.json({ success: true, message: 'Database reset to initial demo data' });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Hospital Management Backend running on port ${PORT}`);
  console.log(`Ready for Render deployment!`);
});
