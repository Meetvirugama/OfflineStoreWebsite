# Comprehensive Project Documentation: ERP & Store Management System

This document provides a highly detailed and accurate breakdown of the **AgroMart ERP System**, covering specific business logic, technical implementations, and the complete directory architecture.

---

## 🚀 Detailed Feature Specifications

### 1. Advanced Authentication & User Lifecycle
- **OTP-Based Verification:** All new registrations trigger a 6-digit OTP sent via email (powered by `Nodemailer`). OTPs have a strict **10-minute expiration** window.
- **Security:** Passwords are non-reversibly hashed using `bcryptjs` (salt rounds: 10).
- **Session Management:** Stateless authentication using **JWT (JSON Web Tokens)** with a **7-day persistence** and role-based payload (`ADMIN`, `STAFF`, `CUSTOMER`).
- **Google OAuth 2.0:** Integrated for "One-Tap" login, automatically linking to existing accounts or creating new verified profiles.

### 2. Intelligent Order & Financial Engine
- **Automated GST Logic:** Standardized **18% GST** calculation. The system automatically splits this into **CGST (9%)** and **SGST (9%)** for intrastate transactions.
- **Dynamic Tiered Discounts:**
  - Orders > ₹2,000: **5% Auto-discount**
  - Orders > ₹5,000: **10% Auto-discount**
  - Orders > ₹10,000: **15% Auto-discount**
- **Transaction Atomicity:** All order creations use **SQL Transactions**. If inventory subtraction or ledger updates fail, the entire order is rolled back to prevent data corruption.
- **Customer Financials:** Tracks `total_purchase`, `total_paid`, and `total_due` in real-time. Every purchase creates a **Ledger Entry** (DEBIT/CREDIT) for auditability.

### 3. Inventory & Supplier Ecosystem
- **Low Stock Guard:** Hard-coded threshold at **20 units**. Products falling below this are flagged in the Admin Dashboard and can trigger automated notifications.
- **Inventory Ledger:** Every stock change is logged as an `IN` or `OUT` event with a reference to the specific Order, Purchase, or Return ID.
- **Supplier Management:** Full CRUD for suppliers, linking them to specific products for streamlined reordering.

### 4. Data-Driven Analytics (The "Report" Engine)
- **Revenue Intelligence:** Day-over-day growth percentages and monthly revenue trend analysis.
- **Customer CLV (Customer Lifetime Value):** Ranks customers by total spend and frequency to identify "VIP" segments.
- **Conversion Funnel:** Tracks the journey from Home -> Product -> Cart -> Checkout to identify bounce points.
- **Product Profitability:** Calculates actual profit margins per item by comparing `selling_price` vs `cost_price`.

### 5. Automated Communications
- **Lifecycle Emails:** Welcome emails, OTPs, Order Confirmations, and Payment Receipts.
- **PDF Generation:** Server-side `invoiceService` generates professional PDF invoices stored in `server/storage/invoices/`.

---

## 📂 Accurate Codebase Map (Granular)

### 📁 Root Directory (`/`)
| File/Folder | Description |
| :--- | :--- |
| `README.md` | General project overview and setup instructions. |
| `package.json` | Root workspace config using `concurrently` to run client/server. |
| `scripts/` | Project-wide utilities (e.g., `generate-api-diagrams.js`). |

### 📁 Client-Side (`client/src/`)
| Directory | Key Files & Roles |
| :--- | :--- |
| `store/` | **Zustand** state slices: `authStore.js` (user state), `cartStore.js` (persistent cart). |
| `services/` | **Axios Instances**: Configured with interceptors for attaching JWT tokens in `axiosInstance.js`. |
| `pages/admin/` | `AnalyticsPage.jsx` (Recharts integration), `AdminOrdersPage.jsx` (Order tracking). |
| `hooks/` | Custom logic like `useAuth.js` or `useDebounce.js` for search. |
| `styles/` | **Digital Forest Theme**: Uses a curated palette of Forest Greens (`#0b3d1e`), Sun-Drenched Accents, and `Comfortaa` typography for a premium, nature-inspired feel. |
| `utils/` | Frontend helpers and formatters. |

### 📁 Server-Side (`server/src/`)
| Directory | Key Files & Roles |
| :--- | :--- |
| `app.js` | Express app config: CORS, Middlewares, and Route mounting. |
| `config/` | `db.js` (Sequelize init), `env.js` (Validation for `.env` variables). |
| `middlewares/` | `authMiddleware.js` (JWT guard), `roleMiddleware.js` (Permissions), `errorHandler.js` (Centralized catch). |
| `models/` | **Sequelize Models**: Defined with precise data types (`DataTypes.FLOAT` for currency). `index.js` handles associations (HasMany, BelongsTo). |
| `controllers/` | Request parsing and calling Service layer (e.g., `orderController.js`). |
| `services/` | **The Core Brain**: `orderService.js` (complex transactions), `reportService.js` (raw SQL analytics). |
| `jobs/` | `scheduler.js` using `node-cron` for periodic inventory/payment checks. |
| `utils/` | `emailTemplates.js` (HTML templates), `logger.js` (Winston or console-based logging). |

### 📁 Database & Docs (`database/` & `docs/`)
| Directory | Contents |
| :--- | :--- |
| `database/schema/` | `tables.sql`: The primary source of truth for the PG database structure. |
| `docs/API_VISUALIZATION/` | Auto-generated `.png` diagrams showing Route -> Controller -> Service flows. |
| `infrastructure/docker/` | **Containerization**: Includes `Dockerfile` and `docker-compose.yml` for multi-container deployment (App + PostgreSQL). |

---

## 🔄 Technical Data Flow
1. **Request:** Client makes an API call via `axialApi.js`.
2. **Middleware:** `authMiddleware` validates JWT; `roleMiddleware` checks permissions.
3. **Controller:** `controller` validates request body (`req.body`) and calls the `service`.
4. **Service:** Executes business logic (GST calc, Discount logic), starts a **Sequelize** transaction.
5. **Model/DB:** Query executed against PostgreSQL.
6. **Response:** Data returned to Client; **Zustand** store updated; UI re-renders.
