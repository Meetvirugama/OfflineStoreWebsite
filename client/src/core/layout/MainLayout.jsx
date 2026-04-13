import { Outlet, useLocation } from \"react-router-dom\";
import { useEffect } from \"react\";
import Navbar from \"@core/layout/Navbar\";
import Footer from \"@core/layout/Footer\";
import CartDrawer from \"@core/components/CartDrawer\";
import Toast from \"@core/components/Toast\";
import MobileNav from \"@core/components/MobileNav\";
import ChatWidget from \"@features/chat/components/ChatWidget\";
import useAuthStore from \"@features/auth/store/auth.store\";
import useCartStore from \"@features/checkout/store/cart.store\";

export default function MainLayout() {
  const { init, user, initialized } = useAuthStore();
  const { fetchCart } = useCartStore();
  const location = useLocation();

  const isAuthPage = location.pathname.startsWith(\"/auth\");

  useEffect(() => {
    if (!initialized) init();
  }, [initialized, init]);

  useEffect(() => {
    if (user?.id) {
      fetchCart();
    }
  }, [user?.id]);

  return (
    <div style={{ minHeight: \"100vh\", display: \"flex\", flexDirection: \"column\" }}>
      <Navbar />
      <main style={{ flex: 1 }} className=\"mobile-bottom-safe\">
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
      <CartDrawer />
      <Toast />
      <ChatWidget />
      {!isAuthPage && <MobileNav />}
    </div>
  );
}
