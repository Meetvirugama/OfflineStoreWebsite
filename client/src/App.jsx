import { BrowserRouter, Routes, Route } from \"react-router-dom\";
import { lazy, Suspense } from \"react\";
import MainLayout from \"@core/layout/MainLayout\";
import AdminLayout from \"@core/layout/AdminLayout\";
import RoleGuard from \"@core/guards/RoleGuard\";
import LoadingBar from \"@core/components/LoadingBar\";
import IntelligenceLayout from \"@core/layout/IntelligenceLayout\";
import AgroLoader from \"@core/components/AgroLoader\";
import ScrollToTop from \"@core/components/ScrollToTop\";

// Features: Shop & Products
const HomePage = lazy(() => import(\"@features/shop/pages/HomePage\"));
const ProductsPage = lazy(() => import(\"@features/shop/pages/ProductsPage\"));
const ProductDetailPage = lazy(() => import(\"@features/shop/pages/ProductDetailPage\"));
const PolicyPage = lazy(() => import(\"@features/shop/pages/PolicyPage\"));
const AboutPage = lazy(() => import(\"@features/shop/pages/AboutPage\"));
const ContactPage = lazy(() => import(\"@features/shop/pages/ContactPage\"));

// Features: Checkout & Orders
const CheckoutPage = lazy(() => import(\"@features/checkout/pages/CheckoutPage\"));
const OrderSuccessPage = lazy(() => import(\"@features/checkout/pages/OrderSuccessPage\"));
const PaymentPage = lazy(() => import(\"@features/checkout/pages/PaymentPage\"));
const OrdersPage = lazy(() => import(\"@features/orders/pages/OrdersPage\"));
const OrderDetailsPage = lazy(() => import(\"@features/orders/pages/OrderDetailsPage\"));

// Features: User & Profile
const ProfilePage = lazy(() => import(\"@features/user/pages/ProfilePage\"));

// Features: Auth
const LoginPage = lazy(() => import(\"@features/auth/pages/LoginPage\"));
const RegisterPage = lazy(() => import(\"@features/auth/pages/RegisterPage\"));
const OtpPage = lazy(() => import(\"@features/auth/pages/OtpPage\"));
const ForgotPasswordPage = lazy(() => import(\"@features/auth/pages/ForgotPasswordPage\"));
const ResetPasswordPage = lazy(() => import(\"@features/auth/pages/ResetPasswordPage\"));
const GoogleSuccessPage = lazy(() => import(\"@features/auth/pages/GoogleSuccessPage\"));

// Features: Agriculture Intelligence
const CropDetailsPage = lazy(() => import(\"@features/agriculture/pages/CropDetailsPage\"));
const AgriAnalyticsPage = lazy(() => import(\"@features/agriculture/pages/AgriAnalyticsPage\"));
const FarmingNewsPage = lazy(() => import(\"@features/agriculture/pages/FarmingNewsPage\"));
const CropAdvisoryPage = lazy(() => import(\"@features/agriculture/pages/CropAdvisoryPage\"));
const PestDetectionPage = lazy(() => import(\"@features/agriculture/pages/PestDetectionPage\"));
const NearbyMandisPage = lazy(() => import(\"@features/agriculture/pages/NearbyMandisPage\"));
const FarmerDashboardPage = lazy(() => import(\"@features/agriculture/pages/FarmerDashboardPage\"));
const WeatherDashboard = lazy(() => import(\"@features/agriculture/pages/WeatherDashboard\"));

// Features: Admin
const AnalyticsPage = lazy(() => import(\"@features/admin/pages/AnalyticsPage\"));
const AdminProductsPage = lazy(() => import(\"@features/admin/pages/AdminProductsPage\"));
const AdminOrdersPage = lazy(() => import(\"@features/admin/pages/AdminOrdersPage\"));
const AdminOrderDetailsPage = lazy(() => import(\"@features/admin/pages/AdminOrderDetailsPage\"));
const AdminProfilePage = lazy(() => import(\"@features/admin/pages/AdminProfilePage\"));
const SuppliersListPage = lazy(() => import(\"@features/admin/pages/SuppliersListPage\"));
const SupplierDetailsPage = lazy(() => import(\"@features/admin/pages/SupplierDetailsPage\"));
const MandiPricesPage = lazy(() => import(\"@features/admin/pages/MandiPricesPage\"));
const MandiDashboardPage = lazy(() => import(\"@features/admin/pages/MandiDashboardPage\"));
const AdminChatPage = lazy(() => import(\"@features/admin/pages/AdminChatPage\"));

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <LoadingBar />
      <Suspense fallback={<AgroLoader />}>
      <Routes>
        {/* PUBLIC */}
        <Route element={<MainLayout />}>
          <Route path=\"/\" element={<HomePage />} />
          <Route path=\"/products\" element={<ProductsPage />} />
          <Route path=\"/products/:id\" element={<ProductDetailPage />} />
          <Route path=\"/policies\" element={<PolicyPage />} />
          <Route path=\"/about\" element={<AboutPage />} />
          <Route path=\"/contact\" element={<ContactPage />} />
          <Route path=\"/pest-detection\" element={<PestDetectionPage />} />
          <Route path=\"/nearby-mandis\" element={<NearbyMandisPage />} />
          <Route path=\"/farmer-dashboard\" element={<FarmerDashboardPage />} />

          <Route path=\"/auth/login\" element={<LoginPage />} />
          <Route path=\"/auth/register\" element={<RegisterPage />} />
          <Route path=\"/auth/verify-otp\" element={<OtpPage />} />
          <Route path=\"/auth/forgot-password\" element={<ForgotPasswordPage />} />
          <Route path=\"/auth/reset-password\" element={<ResetPasswordPage />} />
          <Route path=\"/google-success\" element={<GoogleSuccessPage />} />

          {/* CUSTOMER */}
          <Route path=\"/checkout\" element={<RoleGuard allowedRoles={[\"CUSTOMER\", \"ADMIN\"]}><CheckoutPage /></RoleGuard>} />
          <Route path=\"/order-success/:orderId\" element={<RoleGuard allowedRoles={[\"CUSTOMER\", \"ADMIN\"]}><OrderSuccessPage /></RoleGuard>} />
          <Route path=\"/payment/:orderId\" element={<RoleGuard allowedRoles={[\"CUSTOMER\", \"ADMIN\"]}><PaymentPage /></RoleGuard>} />
          <Route path=\"/orders\" element={<RoleGuard allowedRoles={[\"CUSTOMER\", \"ADMIN\"]}><OrdersPage /></RoleGuard>} />
          <Route path=\"/orders/:id\" element={<RoleGuard allowedRoles={[\"CUSTOMER\", \"ADMIN\"]}><OrderDetailsPage /></RoleGuard>} />
          <Route path=\"/profile\" element={<RoleGuard allowedRoles={[\"CUSTOMER\", \"ADMIN\"]}><ProfilePage /></RoleGuard>} />
        </Route>

        {/* PUBLIC INTELLIGENCE HUB */}
        <Route element={<IntelligenceLayout />}>
          <Route path=\"/intelligence/mandi\" element={<MandiDashboardPage />} />
          <Route path=\"/intelligence/mandi/prices\" element={<MandiPricesPage />} />
          <Route path=\"/intelligence/agri/analytics\" element={<AgriAnalyticsPage />} />
          <Route path=\"/intelligence/weather\" element={<WeatherDashboard />} />
          <Route path=\"/intelligence/advisory\" element={<CropAdvisoryPage />} />
          <Route path=\"/intelligence/agri/crop/:name\" element={<CropDetailsPage />} />
          <Route path=\"/intelligence/agri/news\" element={<FarmingNewsPage />} />
        </Route>

        {/* ADMIN */}
        <Route element={<RoleGuard allowedRoles={[\"ADMIN\"]}><AdminLayout /></RoleGuard>}>
          <Route path=\"/admin\" element={<AnalyticsPage />} />
          <Route path=\"/admin/dashboard\" element={<AnalyticsPage />} />
          <Route path=\"/admin/analytics\" element={<AnalyticsPage />} />
          <Route path=\"/admin/products\" element={<AdminProductsPage />} />
          <Route path=\"/admin/orders\" element={<AdminOrdersPage />} />
          <Route path=\"/admin/orders/:id\" element={<AdminOrderDetailsPage />} />
          <Route path=\"/admin/profile\" element={<AdminProfilePage />} />
          <Route path=\"/admin/suppliers\" element={<SuppliersListPage />} />
          <Route path=\"/admin/suppliers/:id\" element={<SupplierDetailsPage />} />
          <Route path=\"/admin/support-chat\" element={<AdminChatPage />} />
        </Route>
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;