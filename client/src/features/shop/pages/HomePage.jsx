import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sprout, Skull, Info, Leaf, ArrowRight, Star, Award, ShieldCheck } from "lucide-react";
import api from "@core/api/client";
import ProductCard from "@features/shop/components/ProductCard";
import useTranslation from "@core/i18n/useTranslation";
import DynText from "@core/i18n/DynText";
import "@/styles/HomePage.css";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const CATEGORY_MAP = {
    "Fertilizers": { icon: <Sprout size={32} />, color: "#059669", desc: t('home.boostCropYields') },
    "Pesticides": { icon: <Skull size={32} />, color: "#ea580c", desc: t('home.protectHarvest') },
    "Medicines": { icon: <Info size={32} />, color: "#0284c7", desc: t('home.ensurePlantHealth') },
    "Seeds": { icon: <Leaf size={32} />, color: "#854d0e", desc: t('home.highQualitySeeds') },
    "default": { icon: <Leaf size={32} />, color: "#10b981", desc: t('home.organicAgroSupplies') }
  };

  useEffect(() => {
    document.title = "એગ્રોપ્લેટફોર્મ – ભારતનું વિશ્વસનીય સ્ત્રોત";

    const fetchHomeData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get("/products?limit=8"),
          api.get("/products/categories")
        ]);
        setProducts(prodRes || []);
        setCategories(catRes || []);
      } catch (err) {
        console.error("Error fetching home data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="home-page fade-in">
      
      {/* HERO BANNER */}
      <section className="hero">
        <div className="hero__bg svg-pattern-leaves">
          <img src="/hero_banner.png" alt="AgroPlatform Banner" className="hero__img" style={{ opacity: 0.1 }} />
          <div className="hero__overlay" style={{ background: 'linear-gradient(to bottom, rgba(2, 44, 34, 0.95), rgba(2, 44, 34, 0.8))' }} />
        </div>

        <div className="hero__content container">
          <div className="hero__text">
            <span className="hero__kicker">
              <Award size={16} /> {t('home.trustedBy')}
            </span>
            <h1 className="hero__title">
              {t('home.heroTitle1')}<br />
              <span className="hero__title--accent">{t('home.heroTitle2')}</span>
            </h1>
            <p className="hero__desc">
              {t('home.heroDesc')}
            </p>
            <div className="hero__trust-badges">
              <div className="trust-badge"><ShieldCheck size={18} /> <span>{t('home.certified')}</span></div>
              <div className="trust-badge"><Star size={18} /> <span>{t('home.premiumQuality')}</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY CARDS OVERLAPPING */}
      <section className="home-categories-row container">
        <div className="home-cats">
          {categories.map((name) => {
            const config = CATEGORY_MAP[name] || CATEGORY_MAP.default;
            return (
              <Link
                key={name}
                to={`/products?category=${encodeURIComponent(name)}`}
                className="home-cat-card"
              >
                <div
                  className="home-cat-card__icon"
                  style={{ color: config.color }}
                >
                  {config.icon}
                </div>
                <h3 className="home-cat-card__name"><DynText text={name} /></h3>
                <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "12px" }}>{config.desc}</p>
                <span className="home-cat-card__arrow">{t('home.explore')} <ArrowRight size={14} /></span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* PRODUCTS ROW */}
      <section className="home-featured">
        <div className="container">
          <div className="home-featured__header">
            <h2>{t('home.recommendedForYou')}</h2>
          </div>

          {loading ? (
            <div className="loading" style={{ padding: "40px", textAlign: "center" }}>
              <div className="spinner" style={{ margin: '0 auto' }}></div>
              <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>{t('home.loadingSupplies')}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="empty" style={{ padding: "40px", textAlign: "center" }}>{t('home.noProducts')}</div>
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