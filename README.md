# Single-Tenant Offline Store Management System

This repository contains the source code for a comprehensive ERP and Store Management Website. 

**Important Architectural Note:** 
This application is **not** a universal/multi-tenant SaaS platform. It is a **white-label, single-tenant system**. 

It is designed to be deployed individually for different physical offline stores. Each store instance receives:
- **Its own dedicated website**
- **Its own separate cloud deployment** (database, backend, frontend)
- **Its own separate domain name**

This isolation ensures complete data privacy for each business, allows highly customized configurations for individual stores, and eliminates shared-resource bottlenecks (e.g. rate limits).

## Features

- **Store Dashboard & Analytics:** Comprehensive overview of revenue, custom charts, and store activity metrics.
- **Order Management:** Tools to track, update, and manage incoming customer orders and inventory statuses.
- **Customer Management:** Maintain records of customers, purchase histories, and limits.
- **Cart & Checkout Systems:** Integrated service for processing offline or pickup orders.
- **Automated Notifications:** Email notification lifecycles, payment remainders, and localized alerts.
- **Google OAuth Authentication:** Secure login for both Store Admins and internal staff.

## Technology Stack

- **Frontend:** React (Vite-based), tailored for high-end "nature-inspired" / "digital forest" interactive UI or customizable per store.
- **Backend:** Node.js & Express.js.
- **Database:** Relational Database with Sequelize ORM.
- **Payments / Gateway:** Razorpay / Custom localized integrations.

## Getting Started Locally

Because this is a bespoke deployment model, you will need to set up environment variables distinct to the specific store you are spinning up.

1. **Install Dependencies:**
   ```bash
   npm install       # Root (concurrently etc)
   cd client && npm install
   cd ../server && npm install
   ```

2. **Environment Configuration:**
   Configure your `.env` files in both the `server` and `client` directories with the appropriate credentials (DB, OAuth keys, etc.) for the specific store deployment.

3. **Run the Application Locally:**
   From the root of the project, run:
   ```bash
   npm run dev
   ```
   This uses `concurrently` to spin up both the Vite (React) client and the Express backend simultaneously.

## Deployment Strategy

When deploying for a **new store**:
1. Provision a new database instance.
2. Provision a new server/cloud app instance (e.g., AWS, Render, Heroku) scaling to the individual store's needs.
3. Configure domain rules and link the store's unique custom domain.
4. Set independent `.env` secrets.
