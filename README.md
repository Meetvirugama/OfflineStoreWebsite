# 🏪 AgroPlatform: Independent Offline Store ERP System

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

> **A highly scalable, production-ready ERP system designed explicitly for offline stores. Built with an independent-instance architecture, the system is engineered to be deployed individually for different physical stores, each provisioned with its own dedicated cloud infrastructure, database, and domain name.**

*The current implementation showcases **AgroPlatform**, a high-end, nature-inspired instance fully customized for the agricultural supply chain and retail sector.*

---

## 👨‍💻 Developer & Origin
- **Developer**: **Meet Virugama**
- **Institution**: **DA-IICT** (Dhirubhai Ambani Institute of Information and Communication Technology, Gandhinagar)
- **Domain**: Enterprise Resource Planning (ERP), Cloud Infrastructure, Offline-to-Digital Business Transformation

---

## 🖼️ Visual Gallery

### 🏠 Public Storefront & Product Discovery
A high-performance product browsing grid crafted for an organic, smooth shopping experience.
| Home Page | Products Grid |
| :--- | :--- |
| ![Home Page](docs/screenshots/home.png) | ![Products Page](docs/screenshots/products.png) |

### 🔐 Secure Multi-Role Portal
State-of-the-art gateway providing robust Google OAuth 2.0 integration alongside secure 6-digit OTP fallbacks.
| Login Gateway (OAuth + OTP) | Customer Profile |
| :--- | :--- |
| ![Login Portal](docs/screenshots/login.png) | ![User Profile](docs/screenshots/profile.png) |

### 📊 Admin Intelligence & ERP Insights
A powerful administrative dashboard displaying financial analytics, inventory health, and order lifecycles with pixel-perfect accuracy.
| Analytics Dashboard | Inventory Management |
| :--- | :--- |
| ![Admin Dashboard](docs/screenshots/admin_dashboard.png) | ![Admin Products](docs/screenshots/admin_products.png) |

---

## ✨ Features & Intelligence Modules

AgroPlatform was built with massive functionality tailored to the agricultural landscape, pushing the boundaries of typical E-Commerce applications:

### 🛍️ Storefront & e-Commerce Engine
- **Dynamic Cart Systems**: Multi-tiered discounts matching actual wholesaler purchasing logic (e.g., automatically scales discounts past 10,000₹).
- **GST Taxation Pipeline**: Live calculation of 18% Interstate GST seamlessly integrated into the buyer's checkout cart drawer.
- **Secure Transaction Gateway**: Full Razorplay integration backed by strict Server-Side Order Checksum validations.
- **Full Authentication suite**: Google OAuth2 + Native 6-Digit Email OTP Fallbacks. Stateful security leveraging JWT standards.

### 🧠 Agri-Intelligence Hub
- **Live Mandi (Market) Prices Radar**: Syncs district-level crop prices from `data.gov.in` (Agmarknet) mapping real-time supply and demand variations natively for farmers.
- **Dynamic News Aggregator**: Constantly fetches live agricultural and government briefing streams from `newsdata.io`.
- **Neuro-Analytics Pesticide Scanner**: Allows image uploads to query deep learning APIs to identify and map crop diseases and instantly recommend pesticides stocked within the store's inventory.
- **Climate Telemetry Module**: Hyper-local weather forecasting relying upon the OpenWeather OneCall API triggering high-intelligence warnings (E.g. Heat stress, excessive rain pausing).
- **Internationalization (i18n)**: Fully autonomous Gujarati (ગુજરાતી) capability. Utilizing a self-hosted custom LibreTranslate caching layer to autonomously translate external Dynamic data while keeping the database free from structural bloat.

### 📊 Enterprise Administrator Dashboard
- **Financial Projections**: Integrated Recharts graphs comparing daily Ledger PnL, Inventory movements, and Supplier fulfillment rates.
- **Notification Grid**: Email triggering mechanisms for low-stock warnings natively integrated with Nodemailer.
- **Supplier & Product DB**: Unrestricted management capabilities representing a complete end-to-end PIM (Product Information Management) schema.

---

## 📂 File Architecture

The repository revolves around a full strict Monorepo design, dividing frontend experiences from the internal API layers:

```text
.
├── client/                     # Frontend Environment (React 19 + Vite + Zustand)
│   ├── src/
│   │   ├── components/         # Reusable Custom Modal & Toast components
│   │   ├── core/               # Routing mappings, translations Engine (i18n)
│   │   ├── features/           # Module specific logic (Agriculture, Stores, Checkout)
│   │   └── styles/             # 'Living Forest' aesthetic CSS tokens & animations
├── server/                     # Backend Environment (Node.js + Express)
│   ├── backend/
│   │   ├── config/             # DB & Environment variables loaders
│   │   ├── middleware/         # Security, Rate Limiting & Auth JWT extraction pipelines
│   │   └── modules/            # Domain-driven architecture (News, Models, Carts, Ledgers)
├── database/                   # Raw SQL configurations and static data
└── docs/                       # Screenshots and Architectural Artifacts (E.g., API.md)
```

---

## 🔌 Core APIs & Routing (Documentation)

The Node backend executes using an Express App following highly decoupled Domain-Driven conventions. This allows for deep scalability over time.

For a comprehensive layout of all API endpoints and Request/Response standards, see the dedicated documentation block:
👉 **[API Visualization Guide & Payloads](./docs/API.md)**

---

## 🏁 Deployment Strategies (Independent Instance Design)

This ERP operates explicitly out of independent deployments. That means for every new store utilizing this ERP software, a fresh deployment across their own isolated domains will spin up keeping Data extremely private.

### 1. Requirements
- Node.js (v18+)
- PostgreSQL Server Instance (Local or Supabase)

### 2. Required Core `.env` Layout (server/backend)
```env
DATABASE_URL=postgres://...
JWT_SECRET=super_secret_signing_key_here
FRONTEND_URL=http://localhost:5173
EMAIL=your-store-support@gmail.com
EMAIL_PASS=smtp_app_password
RAZORPAY_KEY=rzp_key_id
RAZORPAY_SECRET=rzp_secret_id
NEWS_KEY=newsdata_io_api_token
AGMARKNET_API_KEY=data_gov_in_api_token
```

### 3. Startup Procedures
With your database configured, the ORM Sequelize automates database synchronization schemas immediately upon the server connection starting sequence.

**Execute Frontend:**
```bash
cd client
npm install
npm run dev
```

**Execute Backend:**
```bash
cd server
npm install
npm run dev
```

---

*Architected & Maintained by **Meet Virugama** for academic and enterprise expansion workflows.*
