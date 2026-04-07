# 🌱 AgroMart: Industrial-Grade ERP & Store Management System

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

> A high-end, nature-inspired ERP solution designed for agricultural retail and industrial supply chain management. This system professionalizes offline stores with advanced financial, inventory, and analytics operations.

---

## 👨‍💻 Project Identity
- **Author**: Meetvirugama
- **Institution**: **DA-IICT** (Dhirubhai Ambani Institute of Information and Communication Technology)
- **Course**: B.Tech (ICT) Project
- **Topic**: Enterprise Resource Planning (ERP) for the Agricultural Sector

---

## 🖼️ Visual Gallery

### 🏠 Public Storefront & Discovery
The storefront features a "Digital Forest" aesthetic with smooth gradients and a high-performance product discovery grid.
| Home Page | Products Grid |
| :--- | :--- |
| ![Home Page](docs/screenshots/home.png) | ![Products Page](docs/screenshots/products.png) |

### 🛒 Real-Time Cart & Pricing
An interactive side-drawer cart that calculates tiered discounts and GST in real-time as users add items.
![Cart Drawer](docs/screenshots/cart.png)

### 🔐 Secure Portals
Multi-role authentication system featuring 6-digit OTP verification and Google OAuth 2.0.
| Login Gateway | Customer Profile |
| :--- | :--- |
| ![Login Portal](docs/screenshots/login.png) | ![User Profile](docs/screenshots/profile.png) |

### 📊 Admin Intelligence (Insights)
Powerful administrative dashboards with data visualization for revenue, order trends, and inventory health.
| Analytics Dashboard | Inventory Management |
| :--- | :--- |
| ![Admin Dashboard](docs/screenshots/admin_dashboard.png) | ![Admin Products](docs/screenshots/admin_products.png) |

---

## 🚀 Key Services & Technical Specifications

### 💎 Financial Core Service
- **Atomic Transactions**: All order operations use **SQL Transactions** (Sequelize) ensuring that inventory updates and ledger entries succeed or fail together.
- **Taxation Engine**: Internal logic automatically calculates **18% GST**, split into **CGST (9%)** and **SGST (9%)** for intrastate compliance.
- **Tiered Discounts**: Volume-based savings automatically applied (Orders > ₹2k: 5%, >₹5k: 10%, >₹10k: 15%).
- **Razorpay SDK**: Integrated payment gateway with checksum verification for secure digital transactions.

### 📦 Inventory & Logistics Service
- **Dual-Entry Ledger**: Every stock movement is double-logged (`IN/OUT`) with reference IDs to Orders or Purchases.
- **Low-Stock Sentinel**: Automated health checks flagging items below **20 units** in the admin dashboard for immediate reordering.
- **Supplier Sourcing**: Seamlessly link products to suppliers for streamlined procurement workflows.

### 📊 Data Intelligence Service
- **Revenue Analytics**: Real-time sales trend visualization and growth percentage calculation via **Recharts**.
- **Customer CLV**: Spend-based ranking system (VIP, Regular, New) to prioritize high-value agricultural partners.
- **Performance Reporting**: Raw SQL optimization for generating complex monthly financial reports.

### 📩 Utilities & Security
- **OTP Gateway**: 6-digit email OTPs via **Nodemailer** for secure user registration.
- **PDF Invoicing**: Server-side generation of professional PDF invoices (stored in `server/storage/invoices/`).
- **Stateless Auth**: JWT (JSON Web Tokens) for persistent, role-based session management.

---

## 📂 Project Architecture

```text
.
├── client/                 # Frontend Environment (React 19 + Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI (Cart, Navbar, Layouts)
│   │   ├── store/          # Zustand State (Auth, Cart, Toast)
│   │   └── services/       # Persistent API Gateways (Axios)
├── server/                 # Backend Environment (Node.js + Express)
│   ├── src/
│   │   ├── controllers/    # API Request Processing
│   │   ├── services/       # Core Logic (The "Brain")
│   │   ├── models/         # Postgres Schema (Sequelize)
│   │   └── routes/         # endpoint Definitions
├── database/               # Migrations, SQL Schemas, & Seed Data
└── infrastructure/         # Deployment (Docker & Compose)
```

---

## 🏁 Installation & Configuration

### 1. Prerequisites
- **Node.js**: v18+
- **PostgreSQL**: v14+
- **Google Cloud Console**: Client ID for OAuth.

### 2. Environment Setup
Create a `.env` file in the `server/` directory:
```env
# Database Configuration
DB_NAME=erp_system
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_DIALECT=postgres

# Security & Secrets
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret

# Third-Party API Keys
RAZORPAY_KEY=your_rzp_key
RAZORPAY_SECRET=your_rzp_secret
EMAIL=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Execution
```bash
# Install root dependencies
npm install

# Run Client and Server concurrently
npm run dev
```

---

Developed with ❤️ by **Meetvirugama** at **DA-IICT**, Gandhinagar.
