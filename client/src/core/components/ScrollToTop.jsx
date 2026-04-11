import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop — Resets the scroll position to top whenever the route changes.
 * This prevents the "page opens at footer" bug in React SPA navigation.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
