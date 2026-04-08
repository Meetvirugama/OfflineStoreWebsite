import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.js";
import { logger } from "./utils/logger.js";
import "./jobs/scheduler.js";


// ROUTES
import customerRoutes from "./routes/customerRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import ledgerRoutes from "./routes/ledgerRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import googleAuthRoutes from "./routes/googleAuth.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import customerSelfRoutes from "./routes/customerSelfRoutes.js";
import mandiRoutes from "./routes/mandiRoutes.js";
import cropRoutes from "./routes/cropRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";




const app = express();


app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:3000",
    "https://offline-store-website.vercel.app"
  ],
  credentials: true
}));

// MIDDLEWARES (Logger first, so we see all requests)
app.use(logger);
app.use(express.json());
app.use(cookieParser());


// TEST ROUTE
app.get("/api", (req, res) => {
  res.json({ message: "ERP API running 🚀" });
});


// ROUTES
app.use("/api/customers", customerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);

app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/ledger", ledgerRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", googleAuthRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/me", customerSelfRoutes);
app.use("/api/mandi", mandiRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/farming-news", newsRoutes);



app.use("/api/suppliers", supplierRoutes);

// Error Handling (Must be last)
app.use(errorHandler);

export default app;