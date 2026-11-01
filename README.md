# 🏥 Hospital Management System (Web & Cloud Ready)

> **Cloud Architecture**: Designed for **Render** (Backend API) & **Vercel** (Frontend UI)

---

## 📌 Architecture & Why this Re-organization was Done

The original project was a **Java Swing Desktop Application** (`JFrame`, `JTable`, `JOptionPane`). 

### Why Java Swing Cannot Be Uploaded Directly to Render & Vercel
1. **Vercel** only hosts web frontends (HTML, CSS, JavaScript, React, Next.js, etc.) and serverless edge functions. It cannot execute desktop Java GUIs.
2. **Render** hosts cloud web servers, background workers, and containerized HTTP APIs. A Java Swing application requires a physical or virtual OS display window manager (X11 / Windows desktop) and crashes in headless cloud environments.
3. Therefore, this repository has been structured into **two cloud-native tiers**:

```
📁 1 big/
├── 📁 frontend/                     # 🚀 Deploy to VERCEL (Web Client)
│   ├── index.html                  # Responsive Single-Page Web Application
│   ├── css/style.css               # Matching Java Swing Teal/Gold theme
│   ├── js/app.js                   # REST API client & state management
│   ├── assets/                     # Original images (dr.png, amb.png, icons)
│   └── vercel.json                 # Vercel deployment & routing config
│
├── 📁 backend/                      # 🚀 Deploy to RENDER (REST API Web Service)
│   ├── server.js                   # Express.js REST API with zero-config DB
│   ├── package.json                # Dependencies & start scripts
│   ├── render.yaml                 # Render Blueprint configuration
│   ├── schema.sql                  # Database schema & demo seed data
│   └── .env.example                # Environment variables template
│
├── 📁 Hospital managment systemNew/ # 📦 Original Java Swing desktop code (preserved)
├── render.yaml                     # Root Render Blueprint
└── .gitignore                      # Git ignore file
```

---

## 🚀 Quick Deployment Guide

### Step 1: Push This Folder to GitHub

If you haven't already, push this project to your GitHub account:

```bash
git init
git add .
git commit -m "Initial commit: Hospital Management System ready for Render and Vercel"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
git push -u origin main
```

---

### Step 2: Deploy Backend to Render

1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **Web Service**.
3. Choose **Build and deploy from a Git repository** and connect your GitHub repository.
4. Fill in the following settings:
   - **Name**: `hospital-management-backend` (or any name you prefer)
   - **Region**: Closest to you (e.g. *Frankfurt*, *Oregon*, or *Singapore*)
   - **Root Directory**: `backend` *(⚠️ Important!)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
5. Click **Deploy Web Service**.
6. Once deployed, Render will provide your public URL, for example:
   ```
   https://hospital-management-backend-xxxx.onrender.com
   ```
   *(Copy this URL for the frontend step).*

> **Note on Render Free Tier**: When idle, the backend spins down. It automatically wakes up within 30–50 seconds on the first request.

---

### Step 3: Deploy Frontend to Vercel

1. Log in to [Vercel Dashboard](https://vercel.com/).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. In the **Configure Project** screen:
   - **Project Name**: `hospital-management-frontend`
   - **Root Directory**: Click *Edit* and select **`frontend`** *(⚠️ Important!)*
   - **Framework Preset**: `Other`
   - **Build and Output Settings**: Leave as default (No build command needed)
5. Click **Deploy**.
6. Within a few seconds, Vercel will give you a live production URL:
   ```
   https://hospital-management-frontend-xxxx.vercel.app
   ```

---

### Step 4: Connect Frontend to Backend

1. Open your live **Vercel** website in your browser.
2. At the top banner (or from the top right `⚙️ API URL` button), click **Change API URL**.
3. Paste your **Render backend URL** (e.g., `https://hospital-management-backend-xxxx.onrender.com`).
4. Click **Test Connection**, then click **Save & Apply**.
5. Log in with the default credentials:
   - **Username**: `admin`
   - **Password**: `admin123`

---

## 📋 Features Included

All features from the original Java application are fully functional:
- 🔐 **Authentication System**: Secure sign-in with session management.
- ➕ **Add Patient**: Register new admissions with ID proof type, diagnosis, and allocate rooms.
- 🛏️ **Room Management**: View real-time room availability, bed types, and daily rates.
- 🔍 **Search Room**: Filter rooms by *Available* or *Occupied* status.
- 🏢 **Department Directory**: Contact directory for all hospital departments.
- 👨‍⚕️ **Staff & Employee Directory**: Comprehensive staff profiles, salary, and contact information.
- 📋 **Patient Information**: Complete log of admitted patients and deposits.
- ✏️ **Update Patient Details**: Auto-fetches room rate and calculates pending balance (`Room Price - Deposit`).
- 🚪 **Patient Discharge**: Computes stay duration, deletes patient record, and automatically releases room status back to *Available*.
- 🚑 **24/7 Ambulance Fleet**: Tracks real-time vehicle availability and base locations.

---

## 🛠️ Local Development (Optional)

If you want to run the project locally on your machine:

### Run Backend
```bash
cd backend
npm install
npm start
# Server starts at http://localhost:5000
```

### Run Frontend
Simply open `frontend/index.html` in any web browser, or serve it using any local static server:
```bash
npx serve frontend
# Or python -m http.server 3000 --directory frontend
```
