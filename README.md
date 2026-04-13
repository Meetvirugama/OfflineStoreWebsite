# 🏪 AgroPlatform (ERP System)

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

> *An independent-instance Enterprise Resource Planning (ERP) platform customized for offline agricultural retail stores heavily leveraging React and Domain-Driven Backend Architectures.*

### 👤 Architect & Contact Information
- **Lead Developer:** Meet Virugama
- **Institution:** DA-IICT (Dhirubhai Ambani Institute of Information and Communication Technology)
- **Degree Program:** B.Tech (ICT) Enterprise Engineering
- **Production Portal:** [agroplatform.app](https://agroplatform.app)

---

## 🚀 Core Features

### 🔐 Security & Auth
- [x] stateless `JWT` Authorization
- [x] Google `OAuth 2.0` Single Sign-On
- [x] `Nodemailer` Native 6-Digit Email OTP Fallbacks
- [x] Role-Based Access Control (Admin/User)

### 📱 User Experience & Interface
- [x] fully Responsive Mobile-First Design (PWA Ready)
- [x] CSS-driven Micro-Animations & Glassmorphism themes
- [x] Toast-based unified notification system (Zero standard browser popups)

### 🛒 E-Commerce & Checkout
- [x] Intrastate GST auto-calculation splits (9% CGST / 9% SGST)
- [x] High-volume Tiered Cart Discounts (5%, 10%, 15%)
- [x] `Razorpay` payment gateway integration
- [x] PDF Invoice auto-generation & storage
- [x] SQL Atomic Transactions (Checkout Rollbacks)

### 🧠 Agri-Intelligence
- [x] Local Mandi (Market) Price Radars (Live Govt. Data)
- [x] Farming News Streams Sync Pipeline
- [x] OpenWeather Telemetry (Heat Stress/Irrigation alerts)
- [x] AI Pesticide Analysis (Image integration)
- [x] High-Quality Transactional Email System (SMTP/Nodemailer)

### 📊 Admin Operations
- [x] Low-Stock automated guardrails (<20 units)
- [x] Dual-entry Ledger tracking (Purchases/Sales entries)
- [x] Recharts analytical dashboards (Customer LTV & PnL)

---

## 📚 Topics & Architecture Domains

- **Frontend Core**: SPAs, Custom Hooks, Zustand Stores, Tailwind/Glassmorphism logic.
- **Backend Core**: Domain-Driven Router (`modules/`), Express middleware guards.
- **Database**: PostgreSQL Relational Schemas, Sequelize ORM (HasMany, BelongsTo).
- **Communication**: Automated SMTP transmissions via Nodemailer with Render DNS optimization.
- **Automation**: Data synchronizations via `node-cron`.

---

## 📂 Full File Structure

```text
.
├── client/                     # React 19 Frontend Environment
│   ├── public/                 # Static PWA Assets & Icons
│   ├── src/
│   │   ├── components/         # Reusable Custom Components (Toasts, Modals)
│   │   ├── core/               
│   │   │   └── api/            # Axios API config & interceptors
│   │   ├── features/           # Module-Specific implementations
│   │   │   ├── admin/          # Dashboard analytics UI
│   │   │   ├── agriculture/    # News, Weather, Mandi, Crop logic
│   │   │   ├── auth/           # Login & OTP screens
│   │   │   └── shop/           # Catalog, Checkout cart drawer, Orders
│   │   └── styles/             # Global CSS & specific module styling
│   └── vercel.json             # Vercel SPA deployment config
│
├── server/                     # Node/Express Backend Environment
│   ├── backend/
│   │   ├── config/             # Environment, DB string connections
│   │   ├── middleware/         # Auth, Error handlers, Roles
│   │   └── modules/            # Micro-Routers per Domain
│   │       ├── auth/           # Login Controllers
│   │       ├── cart/           # Basket APIs
│   │       ├── crop/           # Advisory & Pest Detection APIs
│   │       ├── product/        # Suppliers & Inventories
│   │       └── ...             # (Orders, Payments, Mandi, News, Weather)
│   ├── app.js                  # Main Express Application Core
│   └── server.js               # Application Entry & Sequelize Sync
```

---

## 🛠 Tech Stack & Resources

**Frontend Layer**
- React 19 (`vite`)
- Zustand (Global Data Stores)
- React Router DOM
- Recharts (Analytics Graphs)
- Lucide React (Icons)

**Backend Layer**
- Node.js & Express
- Sequelize ORM
- PostgreSQL
- JWT & bcryptjs
- Nodemailer (SMTP Server)

**External Intelligence APIs**
- `NewsData.io` (Farming Announcements)
- `data.gov.in` (Agmarknet Mandi Pricing)
- `OpenWeather` (Synoptic Telemetry)
- `Groq AI` (Agricultural Analysis)

---

## 🔑 Environment Variables (`.env.example`)

To deploy instances, set these variables in your environment:

```env
# -----------------------------
FRONTEND_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

---

## 🏁 Setup Instructions

```bash
# 1. Clone the repository locally
git clone https://github.com/Meetvirugama/OfflineStoreWebsite.git
cd OfflineStoreWebsite

# 2. Start the Frontend Application
cd client
npm install
npm run dev

# 3. Start the Backend API Server (In a new terminal)
cd ../server
npm install
npm run dev
```
