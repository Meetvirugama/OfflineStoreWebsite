import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@core/layout/MainLayout";
import AdminLayout from "@core/layout/AdminLayout";
import RoleGuard from "@core/guards/RoleGuard";
import LoadingBar from "@core/components/LoadingBar";
import IntelligenceLayout from "@core/layout/IntelligenceLayout";

// Features: Shop & Products
import HomePage from "@features/shop/pages/HomePage";
import ProductsPage from "@features/shop/pages/ProductsPage";
import ProductDetailPage from "@features/shop/pages/ProductDetailPage";

// Features: Checkout & Orders
import CheckoutPage from "@features/checkout/pages/CheckoutPage";
import OrderSuccessPage from "@features/checkout/pages/OrderSuccessPage";
import PaymentPage from "@features/checkout/pages/PaymentPage";
import OrdersPage from "@features/orders/pages/OrdersPage";
import OrderDetailsPage from "@features/orders/pages/OrderDetailsPage";

// Features: User & Profile
import ProfilePage from "@features/user/pages/ProfilePage";

// Features: Auth
import LoginPage from "@features/auth/pages/LoginPage";
import RegisterPage from "@features/auth/pages/RegisterPage";
import OtpPage from "@features/auth/pages/OtpPage";
import ForgotPasswordPage from "@features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@features/auth/pages/ResetPasswordPage";
import GoogleSuccessPage from "@features/auth/pages/GoogleSuccessPage";

// Features: Agriculture Intelligence
import CropDetailsPage from "@features/agriculture/pages/CropDetailsPage";
import AgriAnalyticsPage from "@features/agriculture/pages/AgriAnalyticsPage";
import FarmingNewsPage from "@features/agriculture/pages/FarmingNewsPage";
import CropAdvisoryPage from "@features/agriculture/pages/CropAdvisoryPage";
import PestDetectionPage from "@features/agriculture/pages/PestDetectionPage";
import NearbyMandisPage from "@features/agriculture/pages/NearbyMandisPage";
import FarmerDashboardPage from "@features/agriculture/pages/FarmerDashboardPage";
import WeatherDashboard from "@features/agriculture/pages/WeatherDashboard";

// Features: Admin
import AnalyticsPage from "@features/admin/pages/AnalyticsPage";
import AdminProductsPage from "@features/admin/pages/AdminProductsPage";
import AdminOrdersPage from "@features/admin/pages/AdminOrdersPage";
import AdminOrderDetailsPage from "@features/admin/pages/AdminOrderDetailsPage";
import AdminProfilePage from "@features/admin/pages/AdminProfilePage";
import SuppliersListPage from "@features/admin/pages/SuppliersListPage";
import SupplierDetailsPage from "@features/admin/pages/SupplierDetailsPage";
import MandiPricesPage from "@features/admin/pages/MandiPricesPage";
import MandiDashboardPage from "@features/admin/pages/MandiDashboardPage";

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
          <Route path="/crop-advisory" element={<CropAdvisoryPage />} />
          <Route path="/pest-detection" element={<PestDetectionPage />} />
          <Route path="/nearby-mandis" element={<NearbyMandisPage />} />
          <Route path="/farmer-dashboard" element={<FarmerDashboardPage />} />

          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/verify-otp" element={<OtpPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route path="/google-success" element={<GoogleSuccessPage />} />

          {/* CUSTOMER */}
          <Route path="/checkout" element={<RoleGuard allowedRoles={["CUSTOMER", "ADMIN"]}><CheckoutPage /></RoleGuard>} />
          <Route path="/order-success/:orderId" element={<RoleGuard allowedRoles={["CUSTOMER", "ADMIN"]}><OrderSuccessPage /></RoleGuard>} />
          <Route path="/payment/:orderId" element={<RoleGuard allowedRoles={["CUSTOMER", "ADMIN"]}><PaymentPage /></RoleGuard>} />
          <Route path="/orders" element={<RoleGuard allowedRoles={["CUSTOMER", "ADMIN"]}><OrdersPage /></RoleGuard>} />
          <Route path="/orders/:id" element={<RoleGuard allowedRoles={["CUSTOMER", "ADMIN"]}><OrderDetailsPage /></RoleGuard>} />
          <Route path="/profile" element={<RoleGuard allowedRoles={["CUSTOMER", "ADMIN"]}><ProfilePage /></RoleGuard>} />
        </Route>

        {/* PUBLIC INTELLIGENCE HUB */}
        <Route element={<IntelligenceLayout />}>
          <Route path="/intelligence/mandi" element={<MandiDashboardPage />} />
          <Route path="/intelligence/mandi/prices" element={<MandiPricesPage />} />
          <Route path="/intelligence/agri/analytics" element={<AgriAnalyticsPage />} />
          <Route path="/intelligence/weather" element={<WeatherDashboard />} />
          <Route path="/intelligence/agri/crop/:name" element={<CropDetailsPage />} />
          <Route path="/farming-news" element={<FarmingNewsPage />} />
        </Route>

        {/* ADMIN */}
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;