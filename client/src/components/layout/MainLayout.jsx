import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "../common/CartDrawer";
import Toast from "../common/Toast";
import useAuthStore from "../../store/authStore";
import useCartStore from "../../store/cartStore";

export default function MainLayout() {
  const { init, customer, initialized } = useAuthStore();
  const { fetchCart } = useCartStore();
  const location = useLocation();

  const isAuthPage = location.pathname.startsWith("/auth");

  useEffect(() => {
    if (!initialized) init();
  }, [initialized, init]);

  useEffect(() => {
    if (customer?.id) {
      fetchCart(customer.id);
    }
  }, [customer?.id]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
      <CartDrawer />
      <Toast />
    </div>
  );
}
