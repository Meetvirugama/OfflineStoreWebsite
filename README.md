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
- **Inquiry & Support:** +91 98765 00000

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
- [x] LibreTranslate i18n Engine (Dynamic English -> Gujarati caching via RAM)
- [x] OpenWeather Telemetry (Heat Stress/Irrigation alerts)
- [x] AI Pesticide Analysis (Image integration)

### 📊 Admin Operations
- [x] Low-Stock automated guardrails (<20 units)
- [x] Dual-entry Ledger tracking (Purchases/Sales entries)
- [x] Recharts analytical dashboards (Customer LTV & PnL)

---

## 📚 Topics & Architecture Domains

- **Frontend Core**: SPAs, Custom Hooks (`useDynamicTranslation`), Zustand Stores.
- **Backend Core**: Domain-Driven Router (`modules/`), Express middleware guards.
- **Database**: PostgreSQL Relational Schemas, Sequelize ORM (HasMany, BelongsTo).
- **Internationalization**: Local `.json` static maps + Dynamic PostgreSQL Text Proxying.
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
│   │   │   ├── api/            # Axios API config & interceptors
│   │   │   └── i18n/           # English/Gujarati logic & Dynamic Cache Hooks
│   │   ├── features/           # Module-Specific implementations
│   │   │   ├── admin/          # Dashboard analytics UI
│   │   │   ├── agriculture/    # News, Weather, Mandi, Crop logic
│   │   │   ├── auth/           # Login & OTP screens
│   │   │   └── shop/           # Catalog, Checkout cart drawer, Orders
│   │   └── styles/             # Global CSS & specific module styling
│   └── vite.config.js          # Next-gen bundler configuration
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
│   │       ├── translation/    # LibreTranslate Server Proxy
│   │       └── ...             # (Orders, Payments, Mandi, News, Weather)
│   ├── app.js                  # Main Express Application Core
│   └── server.js               # Application Entry & Sequelize Sync
│
├── database/                   # Static schema references & SQL setups
└── docs/                       # External Architectures (API.md / project-details.md)
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
- `LibreTranslate` (Open-Source Machine Translation)

---

## 🔑 Environment Variables (`.env.example`)

To deploy instances locally, place these fake `.env` structures in your `/server/backend/` directory:

```env
# -----------------------------
# DATABASE CONNECTION
# -----------------------------
DATABASE_URL=postgres://demo_admin:DemoSecurePass123@your-db-cluster.us-east-1.rds.amazonaws.com:5432/agromart_db

# -----------------------------
# SECURITY & AUTHENTICATION
# -----------------------------
JWT_SECRET=super_secret_local_dev_token_x9v2
GOOGLE_CLIENT_ID=1234567890-fakegoogleid.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-fake_google_client_secret_xyz

# -----------------------------
# EMAIL SMTP CONFIGURATION
# -----------------------------
EMAIL=support_agro@fake-company.com
EMAIL_PASS=smtp_app_password_abcd

# -----------------------------
# PAYMENT GATEWAY
# -----------------------------
RAZORPAY_KEY=rzp_test_fake123abc
RAZORPAY_SECRET=rzp_secret_fakeXYZ789

# -----------------------------
# EXTERNAL INTELLIGENCE APIs
# -----------------------------
NEWS_KEY=pub_fake_news_api_token_001
AGMARKNET_API_KEY=fake_data_gov_in_token_xyz
LIBRETRANSLATE_URL=https://libretranslate.de/translate

# -----------------------------
# FRONTEND MAPPING
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
