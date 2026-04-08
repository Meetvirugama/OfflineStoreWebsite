import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sprout, Skull, Info, Leaf, ArrowRight, Star, Award, ShieldCheck } from "lucide-react";
import api from "../../services/axiosInstance";
import ProductCard from "@features/shop/components/ProductCard";
import "@/styles/HomePage.css";

const CATEGORIES = [
  { name: "Fertilizers", icon: <Sprout size={32} />, color: "#059669", desc: "Boost crop yields" },
  { name: "Pesticides", icon: <Skull size={32} />, color: "#ea580c", desc: "Protect your harvest" },
  { name: "Medicines", icon: <Info size={32} />, color: "#0284c7", desc: "Ensure plant health" },
  { name: "Seeds", icon: <Leaf size={32} />, color: "#854d0e", desc: "High quality seeds" },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "AgroMart – India's Trusted Source";

    api
      .get("/products")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setProducts(data.slice(0, 8));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="home-page fade-in">
      
      {/* HERO BANNER */}
      <section className="hero">
        <div className="hero__bg svg-pattern-leaves">
          <img src="/hero_banner.png" alt="AgroMart Banner" className="hero__img" style={{ opacity: 0.1 }} />
          <div className="hero__overlay" style={{ background: 'linear-gradient(to bottom, rgba(2, 44, 34, 0.95), rgba(2, 44, 34, 0.8))' }} />
        </div>

        <div className="hero__content container">
          <div className="hero__text">
            <span className="hero__kicker">
              <Award size={16} /> Trusted by 50,000+ Farmers
            </span>
            <h1 className="hero__title">
              Premium Agro Supplies<br />
              <span className="hero__title--accent">Delivered to your Farm</span>
            </h1>
            <p className="hero__desc">
              Get certified fertilizers, protective equipment, and organic seeds at unbeatable wholesale prices.
            </p>
            <div className="hero__trust-badges">
              <div className="trust-badge"><ShieldCheck size={18} /> <span>100% Certified</span></div>
              <div className="trust-badge"><Star size={18} /> <span>Premium Quality</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY CARDS OVERLAPPING */}
      <section className="home-categories-row container">
        <div className="home-cats">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="home-cat-card"
            >
              <div
                className="home-cat-card__icon"
                style={{ color: cat.color }}
              >
                {cat.icon}
              </div>
              <h3 className="home-cat-card__name">{cat.name}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "12px" }}>{cat.desc}</p>
              <span className="home-cat-card__arrow">Explore <ArrowRight size={14} /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* PRODUCTS ROW */}
      <section className="home-featured">
        <div className="container">
          <div className="home-featured__header">
            <h2>Recommended for You</h2>
          </div>

          {loading ? (
            <div className="loading" style={{ padding: "40px", textAlign: "center" }}>
              <div className="spinner" style={{ margin: '0 auto' }}></div>
              <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Loading supplies...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="empty" style={{ padding: "40px", textAlign: "center" }}>No products available at the moment.</div>
          ) : (
            <div className="home-featured-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* FINAL SPACER */}
      <div style={{ height: '60px' }}></div>
    </div>
  );
}