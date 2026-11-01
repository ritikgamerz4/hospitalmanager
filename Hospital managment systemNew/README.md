# 🏥 Hospital Management System

A desktop-based Hospital Management System built in **Java**, using **Swing** for the GUI and **JDBC** with **MySQL** for data storage. This project was built as my first Java project, covering core hospital operations like patient registration, room allocation, employee records, and ambulance management.

![Java](https://img.shields.io/badge/Java-JDK-orange)
![Swing](https://img.shields.io/badge/GUI-Java%20Swing-blue)
![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1)

---

## 📋 Features

- **Login System** — Secure login screen for authorized access
- **Add Patient** — Register new patients with their details
- **Patient Info** — View patient records
- **Update Patient Details** — Edit existing patient information
- **Patient Discharge** — Discharge patients and update records
- **Room Management** — Manage hospital rooms
- **Search Room** — Search for available/occupied rooms
- **Department** — Manage hospital departments
- **All Employee Info** — View and manage employee/staff records
- **Hospital Ambulance** — Manage ambulance details and dispatch
- **Logout** — Secure session logout

---

## 🛠️ Tech Stack

- **Language:** Java
- **GUI:** Java Swing (AWT + Swing components)
- **Database:** MySQL
- **Database Connectivity:** JDBC
- **IDE:** IntelliJ IDEA

---

## ⚙️ Setup & Installation

### Prerequisites
- Java JDK installed (JDK 17 or above recommended)
- MySQL Server installed and running
- An IDE like IntelliJ IDEA (recommended) or Eclipse
- MySQL JDBC Connector (`mysql-connector-java`) added to your project libraries

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/anmolgehlaut-gehlaut/Hospital-Management-System.git
   ```

2. **Set up the MySQL database**
   - Open MySQL Workbench or your terminal
   - Create a database (e.g., `hospital_management`)
   - Update the database credentials (URL, username, password) in the `Conn.java` file to match your local MySQL setup

3. **Open the project in IntelliJ IDEA**
   - Open the project folder
   - Make sure the MySQL JDBC connector `.jar` is added to your project's dependencies

4. **Run the application**
   - Run `Login.java` to start the application

---

## 📂 Project Structure

```
src/hospital/management/system/
├── Login.java                  # Login screen
├── Reception.java              # Main dashboard/menu
├── ALL_Patient_Info.java       # View all patients
├── NEW_PATIENT.java            # Add new patient
├── Update_Patient_Details.java # Update patient records
├── Patient_Discharge.java      # Discharge patient
├── Room.java                   # Room management
├── SearchRoom.java             # Search rooms
├── Department.java             # Department management
├── Employee_info.java          # Employee records
├── Ambulance.java               # Ambulance management
├── Conn.java                   # Database connection
└── icon/                       # Application images/icons
```

---

## 🚀 Future Improvements

- [ ] Add input validation across all forms
- [ ] Hash passwords instead of storing them as plain text
- [ ] Add unit tests
- [ ] Package the app as a runnable `.jar` file
- [ ] Migrate UI to JavaFX or a web-based version (Spring Boot)

---

## 👤 Author

**Anmol Gehlaut**  
This is my first Java project — built to learn Swing GUI development and JDBC database integration.

---

## 📄 License

This project is open source and available for learning purposes.
