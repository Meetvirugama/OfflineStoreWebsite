# 🔌 AgroPlatform Full System & API Architecture

This document provides a highly detailed visualization of how every major frontend page traverses the system, connecting to Zustand stores, API routes, and finally mapping down to the underlying SQL Models.

## 🗺️ Master System Flow Visualization

```mermaid
flowchart TD
    %% Define Styles
    classDef page fill:#0b3d1e,stroke:#fff,stroke-width:2px,color:#fff
    classDef store fill:#64748b,stroke:#fff,stroke-width:2px,color:#fff
    classDef route fill:#10b981,stroke:#fff,stroke-width:2px,color:#fff
    classDef db fill:#0369a1,stroke:#fff,stroke-width:2px,color:#fff

    subgraph Frontend Pages [🖥️ Client Layer (React)]
        Home[Home / Market Page]:::page
        News[News / Intelligence]:::page
        CartUI[Cart Drawer & Checkout]:::page
        Admin[Admin Dashboard]:::page
        Auth[Auth Gateway]:::page
    end

    subgraph State Management [🧠 Store Layer (Zustand)]
        CartStore[cart.store.js]:::store
        NewsStore[news.store.js]:::store
        AuthStore[auth.store.js]:::store
    end

    subgraph Backend APIs [⚙️ Express Backend Routers]
        ProductRoute[/api/products/api/mandi/]:::route
        TranslateRoute[/api/translate/]:::route
        CheckoutRoute[/api/orders/api/cart/]:::route
        DashboardRoute[/api/dashboard/api/reports/]:::route
        UserRoute[/api/auth/api/users/]:::route
    end

    subgraph Database Models [💾 Data Layer (PostgreSQL)]
        ProductsDB[(Products & Inventory)]:::db
        TranslationDB[(Translation Cache)]:::db
        OrdersDB[(Orders & Cart Items)]:::db
        LedgerDB[(Ledger & Admin Analytics)]:::db
        UsersDB[(Users & Sessions)]:::db
    end

    %% Connections for Home Page
    Home -->|Browsing| ProductRoute
    ProductRoute --> ProductsDB
    
    %% Connections for News Intelligence
    News --> NewsStore
    NewsStore -->|Auto-Sourced| TranslateRoute
    TranslateRoute -->|If cached| TranslationDB
    TranslateRoute -.->|If missed| LibreTranslate((LibreTranslate API))
    
    %% Connections for Commerce
    CartUI --> CartStore
    CartStore --> CheckoutRoute
    CheckoutRoute --> OrdersDB
    CheckoutRoute -->|Invoice Trigger| LedgerDB
    
    %% Connections for Admin
    Admin --> DashboardRoute
    DashboardRoute --> LedgerDB
    DashboardRoute --> OrdersDB
    DashboardRoute --> ProductsDB
    
    %% Connections for Auth
    Auth --> AuthStore
    AuthStore --> UserRoute
    UserRoute --> UsersDB
```

---

## 🔐 Auth & Identity (`/api/auth`)

Handles User generation, logins, and session lifecycles utilizing pure JWT strategies and native Google OAuth verifications.

| Endpoint | Method | Attached UI Page | Description |
| :--- | :--- | :--- | :--- |
| `/login` | `POST` | `LoginPage.jsx` | Standard email/password entry returning Access Tokens. |
| `/google` | `POST` | `LoginPage.jsx` | Validates a frontend Google OAuth `credential` payload against Google's servers. |
| `/send-otp` | `POST` | `LoginPage.jsx` | NodeMailer triggers an email delivery mapping an ephemeral 6-digit confirmation key. |
| `/verify-otp` | `POST` | `LoginPage.jsx` | Confirms Email verification logic and provisions immediate login session if passed. |

---

## 🛒 E-Commerce & Logistics (`/api/orders`, `/api/cart`)

Manages storefront Cart workflows spanning from temporary items toward immutable physical Delivery records.

| Endpoint | Method | Attached UI Page | Description |
| :--- | :--- | :--- | :--- |
| `/cart` | `GET` | `CartDrawer.jsx` | Loads the user's current sessionized basket with pre-calculated taxes. |
| `/cart/add` | `POST` | `ProductCard.jsx` | Provisions an item or increments an existing bundle counting towards wholesale price cuts. |
| `/orders` | `POST` | `CartDrawer.jsx` | Flushes cart data and initiates atomic Sequelize checkout creation sequences. |
| `/orders/:id/status` | `PATCH` | `AdminOrders.jsx` | Modifies the strict state machines (Pending -> Shipped -> Delivered -> Paid). |

---

## 🧠 Agri-Intelligence Hub (`/api/mandi`, `/api/news`, `/api/translate`)

Interfaces specifically handling data streams unique to the Agricultural and Farming experiences.

| Endpoint | Method | Attached UI Page | Description |
| :--- | :--- | :--- | :--- |
| `/mandi/prices` | `GET` | `AgriAnalyticsPage.jsx` | Proxies requests into Govt domains retrieving massive crop pricing payloads to visualize. |
| `/news/sync` | `POST` | `FarmingNewsPage.jsx`| Forces a server-wide fetch to `newsdata.io` ensuring active breaking updates reach the PostgreSQL cluster. |
| `/translate` | `POST` | `DynText` wrapper | Intercepts English payloads (`q`, `lang`) and utilizes the ephemeral cache maps or external `LibreTranslate` to render UI natively. |

---

## 🧾 Administration (`/api/dashboard`, `/api/inventory`)

Provides statistical insight explicitly required by administrative staff managing the ecosystem.

| Endpoint | Method | Attached UI Page | Description |
| :--- | :--- | :--- | :--- |
| `/dashboard/metrics` | `GET` | `AdminDashboard.jsx` | Cumulates active orders grouped by state and aggregates daily financial revenues for Recharts metrics. |
| `/inventory/low-stock` | `GET` | `AdminProducts.jsx` | Pulls product lists dropping beneath 20 available units automatically. |

> **Note:** Error Responses conform identically globally wrapping messages in `{ success: false, error: "..." }` schemas to simplify UI integration handling.
