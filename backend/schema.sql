-- Hospital Management System Database Schema & Initial Data
-- Compatible with MySQL and SQLite

CREATE TABLE IF NOT EXISTS Login (
    ID VARCHAR(100) PRIMARY KEY,
    PW VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS room (
    room_no VARCHAR(20) PRIMARY KEY,
    Availability VARCHAR(20) NOT NULL,
    Price VARCHAR(20) NOT NULL,
    Bed_Type VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS department (
    Department VARCHAR(100) PRIMARY KEY,
    Phone_Number VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS EMP_INFO (
    Name VARCHAR(100) NOT NULL,
    Age INT NOT NULL,
    Phone_Number VARCHAR(50) NOT NULL,
    Salary VARCHAR(50) NOT NULL,
    Gmail VARCHAR(100) NOT NULL,
    Aadhar_Number VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Ambulance (
    Name VARCHAR(100) NOT NULL,
    Gender VARCHAR(20) NOT NULL,
    Car_Name VARCHAR(100) NOT NULL,
    Availability VARCHAR(20) NOT NULL,
    Location VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS Patient_Info (
    ID VARCHAR(50) NOT NULL,
    Number VARCHAR(50) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Gender VARCHAR(20) NOT NULL,
    Disease VARCHAR(100) NOT NULL,
    Room_Number VARCHAR(50) NOT NULL,
    Time VARCHAR(100) NOT NULL,
    Deposit VARCHAR(50) NOT NULL
);

-- Default Demo Data
INSERT IGNORE INTO Login (ID, PW) VALUES ('admin', 'admin123');

INSERT IGNORE INTO room (room_no, Availability, Price, Bed_Type) VALUES
('101', 'Available', '500', 'Single Bed'),
('102', 'Occupied', '500', 'Single Bed'),
('103', 'Available', '1000', 'Double Bed'),
('104', 'Available', '1000', 'Double Bed'),
('201', 'Available', '1500', 'Single Bed (AC)'),
('202', 'Occupied', '2000', 'Double Bed (AC)'),
('301', 'Available', '3000', 'ICU Bed'),
('302', 'Available', '3000', 'ICU Bed');

INSERT IGNORE INTO department (Department, Phone_Number) VALUES
('Emergency & Trauma', '011-26594444'),
('Cardiology', '011-26594401'),
('Neurology', '011-26594402'),
('Orthopedics', '011-26594403'),
('Pediatrics', '011-26594404'),
('General Surgery', '011-26594405'),
('Radiology & Imaging', '011-26594406'),
('Pharmacy', '011-26594407');

INSERT IGNORE INTO EMP_INFO (Name, Age, Phone_Number, Salary, Gmail, Aadhar_Number) VALUES
('Dr. Ramesh Sharma', 45, '9811002233', '150000', 'dr.ramesh@hospital.com', '2345-6789-0123'),
('Dr. Priya Verma', 38, '9822113344', '135000', 'dr.priya@hospital.com', '3456-7890-1234'),
('Dr. Anil Mehta', 50, '9833224455', '160000', 'dr.anil@hospital.com', '4567-8901-2345'),
('Sister Sunita Devi', 32, '9844335566', '45000', 'sunita.devi@hospital.com', '5678-9012-3456'),
('Brother Rajesh Paul', 29, '9855446677', '42000', 'rajesh.paul@hospital.com', '6789-0123-4567');

INSERT IGNORE INTO Ambulance (Name, Gender, Car_Name, Availability, Location) VALUES
('Manoj Yadav', 'Male', 'Force Traveler (ICU-1)', 'Available', 'Emergency Gate 1'),
('Vikas Kumar', 'Male', 'Tata Winger (Basic-2)', 'Busy', 'Sector 15 City Pick-up'),
('Deepak Singh', 'Male', 'Mahindra Bolero (Adv-3)', 'Available', 'Trauma Centre Standby'),
('Sunil Sharma', 'Male', 'Force Traveler (ICU-4)', 'Available', 'Ambulance Bay B');

INSERT IGNORE INTO Patient_Info (ID, Number, Name, Gender, Disease, Room_Number, Time, Deposit) VALUES
('Aadhar Card', 'ADR-9021', 'Rohan Gupta', 'Male', 'Viral Fever', '102', 'Sun Nov 01 10:30:00 IST 2026', '500'),
('Driving License', 'DL-4482', 'Anjali Rao', 'Female', 'Fracture', '202', 'Sun Nov 01 14:15:00 IST 2026', '1200');
