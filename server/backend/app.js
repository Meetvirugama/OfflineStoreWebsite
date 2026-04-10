import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Utils & Middleware
import { globalErrorHandler } from "./middleware/error.middleware.js";
import { ENV } from "./config/env.js";

// Routes
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import customerRoutes from "./modules/customer/customer.routes.js";
import productRoutes from "./modules/product/product.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import orderRoutes from "./modules/order/order.routes.js";
import paymentRoutes from "./modules/payment/payment.routes.js";
import ledgerRoutes from "./modules/ledger/ledger.routes.js";
import notificationRoutes from "./modules/notification/notification.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import reportRoutes from "./modules/report/report.routes.js";
import mandiRoutes from "./modules/mandi/mandi.routes.js";
import weatherRoutes from "./modules/weather/weather.routes.js";
import cropRoutes from "./modules/crop/crop.routes.js";
import profitRoutes from "./modules/profit/profit.routes.js";
import alertRoutes from "./modules/alert/alert.routes.js";
import priceRoutes from "./modules/price/price.routes.js";
import supplierRoutes from "./modules/product/supplier.routes.js";
import newsRoutes from "./modules/news/news.routes.js";
import invoiceRoutes from "./modules/invoice/invoice.routes.js";
import inventoryRoutes from "./modules/product/inventory.routes.js";

const app = express();

// ─── CORS ──────────────────────────────────────────────────────────────────
// Explicit list of allowed origins (add any new domains here)
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://offlinestorewebsite.onrender.com",
  "https://agroplatform.app",
  "https://www.agroplatform.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

// Handle preflight OPTIONS requests before all routes
// Use regex to bypass path-to-regexp v8 which rejects string wildcards
app.options(/.*/, cors(corsOptions));
app.use(cors(corsOptions));

// ─── STANDARD MIDDLEWARE ────────────────────────────────────────────────────
app.use(express.json());
app.use(morgan("dev"));

// Health Check
app.get("/health", (req, res) => res.send("AgroMart ERP API is alive 🌾"));

// Mount Module Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/ledger", ledgerRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/mandi", mandiRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/profit", profitRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/price", priceRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/inventory", inventoryRoutes);

// --- END OF ROUTES ---

// Global Error Handler (Must be last)
app.use(globalErrorHandler);

export default app;
