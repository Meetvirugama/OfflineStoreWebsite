import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./components/layout/AdminLayout";
import RoleGuard from "./components/common/RoleGuard";

// Pages
import HomePage from "./pages/shop/HomePage";
import ProductsPage from "./pages/shop/ProductsPage";
import ProductDetailPage from "./pages/shop/ProductDetailPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import OrderSuccessPage from "./pages/checkout/OrderSuccessPage";
import PaymentPage from "./pages/checkout/PaymentPage";
import OrdersPage from "./pages/orders/OrdersPage";
import OrderDetailsPage from "./pages/orders/OrderDetailsPage";
import ProfilePage from "./pages/user/ProfilePage";

// Auth
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import OtpPage from "./pages/auth/OtpPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import GoogleSuccess from "./pages/GoogleSuccess";

// ✅ Analytics & Admin
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminOrderDetailsPage from "./pages/admin/AdminOrderDetailsPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import SuppliersListPage from "./pages/admin/SuppliersListPage";
import SupplierDetailsPage from "./pages/admin/SupplierDetailsPage";
import MandiPricesPage from "./pages/admin/MandiPricesPage";
import MandiDashboardPage from "./pages/admin/MandiDashboardPage";
import CropDetailsPage from "./pages/agriculture/CropDetailsPage";
import AgriAnalyticsPage from "./pages/agriculture/AgriAnalyticsPage";
import LoadingBar from "./components/common/LoadingBar";

function App() {
  return (
    <BrowserRouter>
      <LoadingBar />
      <Routes>

        {/* PUBLIC */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />

          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/verify-otp" element={<OtpPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route path="/google-success" element={<GoogleSuccess />} />

          {/* CUSTOMER */}
          <Route path="/checkout" element={<RoleGuard allowedRoles={["CUSTOMER", "ADMIN"]}><CheckoutPage /></RoleGuard>} />
          <Route path="/order-success/:orderId" element={<RoleGuard allowedRoles={["CUSTOMER", "ADMIN"]}><OrderSuccessPage /></RoleGuard>} />
          <Route path="/payment/:orderId" element={<RoleGuard allowedRoles={["CUSTOMER", "ADMIN"]}><PaymentPage /></RoleGuard>} />
          <Route path="/orders" element={<RoleGuard allowedRoles={["CUSTOMER", "ADMIN"]}><OrdersPage /></RoleGuard>} />
          <Route path="/orders/:id" element={<RoleGuard allowedRoles={["CUSTOMER", "ADMIN"]}><OrderDetailsPage /></RoleGuard>} />
          {/* SHARED AUTH ROUTES */}
          <Route path="/profile" element={<RoleGuard allowedRoles={["CUSTOMER", "ADMIN"]}><ProfilePage /></RoleGuard>} />
        </Route>

        {/* ADMIN (optional) */}
        <Route element={<RoleGuard allowedRoles={["ADMIN"]}><AdminLayout /></RoleGuard>}>
          <Route path="/admin" element={<AnalyticsPage />} />
          <Route path="/admin/dashboard" element={<AnalyticsPage />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetailsPage />} />
          <Route path="/admin/profile" element={<AdminProfilePage />} />
          <Route path="/admin/suppliers" element={<SuppliersListPage />} />
          <Route path="/admin/suppliers/:id" element={<SupplierDetailsPage />} />
          <Route path="/admin/mandi" element={<MandiDashboardPage />} />
          <Route path="/admin/mandi/prices" element={<MandiPricesPage />} />

          {/* 🌿 AGRI INTELLIGENCE */}
          <Route path="/admin/agri/analytics" element={<AgriAnalyticsPage />} />
          <Route path="/admin/agri/crop/:name" element={<CropDetailsPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;