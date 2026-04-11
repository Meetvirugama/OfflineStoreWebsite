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
import healthRoutes from "./modules/health/health.routes.js";
import aiRoutes from "./modules/ai/ai.routes.js";

const app = express();

// ─── CORS ──────────────────────────────────────────────────────────────────
const corsOptions = {
  origin: (origin, callback) => {
    // 1. Allow internal requests (no origin) or server-to-server
    if (!origin) return callback(null, true);

    // 2. Allow local development
    if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
      return callback(null, true);
    }

    // 3. Allow production domains and subdomains
    const allowedPatterns = [
      /\.agroplatform\.app$/,
      /^https:\/\/agroplatform\.app$/,
      /\.vercel\.app$/,
      /\.onrender\.com$/
    ];

    const isAllowed = allowedPatterns.some(pattern => pattern.test(origin));

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`🛑 CORS blocked for origin: ${origin}`);
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200
};

// Use CORS middleware (handles preflight automatically)
app.use(cors(corsOptions));


// ─── ROOT ROUTE ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to AgroMart ERP API 🌾",
    version: "1.0.0",
    status: "operational",
    endpoints: {
      health: "/health",
      diagnostics: "/api/health/diagnostics"
    }
  });
});

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
app.use("/api/health", healthRoutes);
app.use("/api/ai", aiRoutes);

// --- END OF ROUTES ---

// Global Error Handler (Must be last)
app.use(globalErrorHandler);

export default app;
