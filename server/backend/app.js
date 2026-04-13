import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

// Route Imports
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
import analyticsRoutes from "./modules/analytics/analytics.routes.js";
import supportRoutes from "./modules/support/support.routes.js";
import chatRoutes from "./modules/chat/chat.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Global Health Check
app.get("/health", (req, res) => res.send("AgroPlatform ERP API is alive 🌾"));

// Information endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to AgroPlatform ERP API 🌾",
    version: "1.0.0",
    status: "operational",
    endpoints: {
      health: "/health",
      diagnostics: "/api/health/diagnostics"
    }
  });
});

// API Routes
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
app.use("/api/analytics", analyticsRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/chat", chatRoutes);

// Error Handling
app.use(errorHandler);

export default app;
