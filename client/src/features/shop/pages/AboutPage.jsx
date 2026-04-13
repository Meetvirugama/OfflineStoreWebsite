import React, { useEffect } from 'react';
import { Target, Users, Zap, Leaf } from 'lucide-react';
import '@/styles/global.css'; // Reusing global styles

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "About Us - AgroMart";
  }, []);

  return (
    <div className="about-page fade-in">
      {/* Hero Section */}
      <section className="policy-hero" style={{ background: 'linear-gradient(135deg, #065f46 0%, #064e3b 100%)' }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900 }}>Our Mission</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
            Empowering Bharat's farmers with data-driven intelligence and premium agricultural infrastructure.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="container" style={{ padding: '80px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', color: '#111827', marginBottom: '24px' }}>Cultivating the Future</h2>
            <p style={{ lineHeight: 1.8, color: '#4b5563', fontSize: '1.1rem', marginBottom: '20px' }}>
              AgroMart was born out of a simple realization: the backbone of our economy—the Indian farmer—deserves the same 
              cutting-edge technology as any modern enterprise. We are building the \"Operating System for Farming\" in Gujarat 
              and beyond.
            </p>
            <p style={{ lineHeight: 1.8, color: '#4b5563', fontSize: '1.1rem' }}>
              By combining AI-powered pest detection, real-time mandi intelligence, and an elite supply chain, we ensure that 
              every hand that sows the earth gets the highest possible return on its labor.
            </p>
          </div>
          <div style={{ background: '#f8fafc', padding: '40px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div className="stat-card">
                <Target color="#059669" size={32} />
                <h3 style={{ marginTop: '16px' }}>Precision</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>AI diagnostics with 98% accuracy.</p>
              </div>
              <div className="stat-card">
                <Users color="#059669" size={32} />
                <h3 style={{ marginTop: '16px' }}>Community</h3>
                <h4 style={{ margin: 0, color: '#059669' }}>5,000+</h4>
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Active verified farmers.</p>
              </div>
              <div className="stat-card">
                <Zap color="#059669" size={32} />
                <h3 style={{ marginTop: '16px' }}>Speed</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Instant market price insights.</p>
              </div>
              <div className="stat-card">
                <Leaf color="#059669" size={32} />
                <h3 style={{ marginTop: '16px' }}>Quality</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Certified seeds and supplies.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section style={{ background: '#f1f5f9', padding: '80px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '40px' }}>The AgroPlatform Philosophy</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
            <div className="card-premium" style={{ padding: '30px' }}>
              <h3>Transparency</h3>
              <p>Direct-from-source pricing and verified product history.</p>
            </div>
            <div className="card-premium" style={{ padding: '30px' }}>
              <h3>Innovation</h3>
              <p>Leveraging deep-learning for crop health and yield prediction.</p>
            </div>
            <div className="card-premium" style={{ padding: '30px' }}>
              <h3>Sustainability</h3>
              <p>Promoting practices that preserve the soil for the next generation.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
