# 🌱 AgroMart: Comprehensive ERP & Store Management System

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

> A high-end, nature-inspired ERP solution designed for agricultural retail and industrial supply chain management. Built with a focus on visual excellence, data integrity, and professional financial logic.

---

## 👨‍💻 Project Identity
- **Author**: Meetvirugama
- **Institution**: **DA-IICT** (Dhirubhai Ambani Institute of Information and Communication Technology)
- **Topic**: Modernized ERP for Offline Agricultural Stores

---

## 🖼️ Visual Gallery

### 🏠 Public Storefront
The storefront features a "Digital Forest" aesthetic with smooth gradients and a professional product grid.
![Home Page](docs/screenshots/home.png)

### 🚜 Product Discovery
High-performance product listing with real-time stock status and tiered pricing visualization.
![Products Page](docs/screenshots/products.png)

### 🔐 Multi-Tier Authentication
A secure portal for customers and administrators, featuring OTP verification and Google OAuth integration.
![Login Portal](docs/screenshots/login.png)

---

## 🚀 Core Features

### 1. Advanced Authentication & Security
- **OTP Verification**: 6-digit email OTPs via Nodemailer with 10-minute expiration.
- **Google OAuth 2.0**: One-tap professional login integration.
- **State Management**: **Zustand** driven auth state with persistent sessions.

### 2. Intelligent Financial Engine
- **Automated GST**: Precision 18% GST (9% CGST / 9% SGST) calculation.
- **Dynamic Discounts**: Auto-tiered savings (5% to 15%) based on order volume.
- **Razorpay Integration**: Fully functional secure payment gateway for credit/debit/UPI.

### 3. Management & Logistics
- **Inventory Ledger**: Real-time tracking of `IN/OUT` stock movements.
- **Low Stock Guard**: Automated thresholds (20 units) with dashboard alerts.
- **PDF Invoicing**: Server-side generation of industrial-grade invoices.

### 4. Data-Driven Analytics
- **Sales Intelligence**: Revenue growth charts and monthly trends via **Recharts**.
- **Customer CLV**: Spend-based ranking to identify high-value agricultural partners.

---

## 📂 Project Architecture

```text
.
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # High-end UI Components
│   │   ├── pages/          # Shop & Admin Views
│   │   ├── store/          # Zustand State Management
│   │   └── services/       # Axios API Handlers
│   └── public/             # Static Assets
├── server/                 # Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/    # Request Handling
│   │   ├── services/       # Core Business Logic (Brain)
│   │   ├── models/         # Sequelize (PostgreSQL) Models
│   │   └── routes/         # REST API Endpoints
├── database/               # SQL Schemas & Seed Data
├── docs/                   # Visual Documentation & Diagrams
└── scripts/                # Database Sync & Test Utilities
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Zustand, Lucide Icons, Recharts.
- **Backend**: Node.js, Express, Sequelize ORM.
- **Database**: PostgreSQL (Relational).
- **Security**: JWT, BcryptJS, Google OAuth.
- **Operations**: Docker, Nodemailer, Razorpay SDK.

---

## 🏁 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Meetvirugama/OfflineStoreWebsite.git
   ```
2. **Install Dependencies**:
   ```bash
   npm install && cd client && npm install && cd ../server && npm install
   ```
3. **Configure Environment**:
   Create a `.env` in the `server/` directory with your DB and SMTP credentials.
4. **Run the Engine**:
   ```bash
   npm run dev
   ```

---

Developed with ❤️ by **Meetvirugama** at **DA-IICT**.
