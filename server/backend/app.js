import express from "express";
import cors from "cors";
import morgan from "morgan";

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

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health Check
app.get("/health", (req, res) => res.send("AgroMart ERP API is alive 🌾"));

// Mount Module Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/ledger", ledgerRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/mandi", mandiRoutes);
app.use("/api/v1/weather", weatherRoutes);
app.use("/api/v1/crops", cropRoutes);
app.use("/api/v1/profit", profitRoutes);
app.use("/api/v1/alerts", alertRoutes);
app.use("/api/v1/price", priceRoutes);

// Global Error Handler (Must be last)
app.use(globalErrorHandler);

export default app;
