# 🏠 RealEstate CRM — Frontend

A modern Real Estate CRM platform built with React + Vite + Tailwind CSS. Supports Web, Windows Desktop (Electron), and Android Mobile (Capacitor).

---

## 🌐 Live Demo
[(https://real-estate-crm-frontend-1w42yte25-darshans-projects-238b0611.vercel.app]

---

## 📱 Platform Support
| Platform | Technology | Status |
|----------|-----------|--------|
| Web Browser | React + Vite | ✅ Live on Vercel |
| Windows Desktop | Electron | ✅ EXE Installer |
| Android Mobile | Capacitor | ✅ APK Available |

---

## 🎯 Features
- 🔐 Role-based authentication (7 roles)
- 🏘️ Property listing with filters and images
- ⚖️ Legal verification workflow
- 📋 Lead management with auto-assignment
- 📅 Site visit scheduling
- 🌱 Grow What You Eat — Managed Farming Module
- 📊 CEO & Zonal Leader dashboards with analytics
- 👥 User management
- 📄 Document checklist (5 legal documents)
- 💰 Budget filter ₹10L to ₹10Cr in ₹2.5L increments
- 📱 Fully mobile responsive

---

## 👥 User Roles
| Role | Access |
|------|--------|
| CEO | Full access — dashboard, analytics, all modules |
| Admin | Full access — platform configuration |
| Zonal Leader | Zone management, agents, leads |
| Agent | Leads, properties, site visits |
| Legal Officer | Document verification, legal status |
| Seller | List properties, upload documents |
| Buyer | Browse properties, schedule visits |

---

## 🛠️ Tech Stack
- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM v7
- **HTTP Client:** Axios
- **Desktop:** Electron 41
- **Mobile:** Capacitor + Android

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/ShivaDarshan000/real-estate-crm-frontend.git

# Navigate to project folder
cd real-estate-crm-frontend

# Install dependencies
npm install
```

### Run on Web (Development)
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### Run on Windows Desktop
```bash
npm run electron:dev
```

### Build Windows EXE Installer
```bash
npm run build
npm run electron:build
```
EXE will be generated in `dist-electron/` folder.

### Build Android APK
```bash
# Build React app
npm run build

# Sync with Android
npx cap sync android

# Open in Android Studio
npx cap open android
```
Then in Android Studio: **Build → Build APK(s)**

---

## 🔐 Test Credentials
| Role | Email | Password |
|------|-------|----------|
| CEO | ceo@realestate.com | password123 |
| Admin | admin@realestate.com | password123 |
| Zonal Leader | zonal@realestate.com | password123 |
| Agent | agent@realestate.com | password123 |
| Legal Officer | legal@realestate.com | password123 |
| Seller | seller@realestate.com | password123 |
| Buyer | buyer@realestate.com | password123 |

---

## 📁 Project Structure
```
src/
├── api/
│   └── axios.js          # API configuration
├── components/
│   ├── Navbar.jsx         # Navigation bar
│   └── ProtectedRoute.jsx # Auth guard
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx      # Role-based dashboard
│   ├── Properties.jsx     # Property listings
│   ├── PropertyDetail.jsx # Property details
│   ├── Leads.jsx          # Lead management
│   ├── SiteVisits.jsx     # Site visit scheduler
│   ├── LegalVerification.jsx
│   ├── DocumentChecklist.jsx
│   ├── Farming.jsx        # Grow What You Eat
│   └── Users.jsx          # User management
electron/
└── main.cjs               # Electron entry point
android/                   # Capacitor Android project
```

---

## 🔗 Backend Repository
[https://github.com/ShivaDarshan000/real-estate-crm-backend](https://github.com/ShivaDarshan000/real-estate-crm-backend)

---

## 📄 License
This project is private and confidential.
