import React, { useEffect } from 'react';
import { ShieldCheck, RefreshCcw, Copyright, Lock, Truck, AlertTriangle } from 'lucide-react';
import '@/styles/PolicyPage.css';

const PolicyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Policies & Legal - AgroMart";
  }, []);

  return (
    <div className="policy-page fade-in">
      <div className="policy-hero">
        <div className="container">
          <h1>Legal & Policies</h1>
          <p>Transparency and safety are our priorities at AgroMart.</p>
        </div>
      </div>

      <div className="policy-content container">
        <aside className="policy-nav">
          <nav>
            <a href="#refund">Refund Policy</a>
            <a href="#safety">Safety & Privacy</a>
            <a href="#copyright">Copyright Notice</a>
          </nav>
        </aside>

        <main className="policy-main">
          {/* REFUND POLICY */}
          <section id="refund" className="policy-section card-premium">
            <div className="section-header">
              <RefreshCcw className="icon-agri" />
              <h2>Refund & Return Policy</h2>
            </div>
            <div className="policy-text">
              <div className="alert-no-refund">
                <AlertTriangle size={20} />
                <p><strong>Strict Policy:</strong> We do not offer refunds or returns on any products once purchased.</p>
              </div>
              <p>
                At AgroMart, we deals in agricultural supplies that are critical for crop health. To ensure the safety and 
                integrity of the supply chain for all our farmers, we maintain a strict <strong>No Return, No Refund</strong> policy.
              </p>
              <ul>
                <li>Once an order is confirmed and processed, it cannot be cancelled or returned.</li>
                <li>We do not accept returns for chemical products, seeds, or fertilizers due to potential contamination risks.</li>
                <li>In rare cases of incorrect item delivery, please contact us within 24 hours with unboxing video evidence.</li>
              </ul>
            </div>
          </section>

          {/* SAFETY & PRIVACY */}
          <section id="safety" className="policy-section card-premium">
            <div className="section-header">
              <ShieldCheck className="icon-agri" />
              <h2>Safety & Privacy</h2>
            </div>
            <div className="policy-text">
              <p>
                Your safety and data privacy are deeply integrated into the AgroPlatform ecosystem. 
                We use industry-standard encryption to protect your transactional data.
              </p>
              <div className="policy-grid">
                <div className="policy-feature">
                  <Lock size={18} />
                  <div>
                    <h4>Secure Transactions</h4>
                    <p>All payments are processed through PCI-DSS compliant gateways like Razorpay.</p>
                  </div>
                </div>
                <div className="policy-feature">
                  <Truck size={18} />
                  <div>
                    <h4>Safe Delivery</h4>
                    <p>Our logistics nodes follow strict safety protocols during transit and handling.</p>
                  </div>
                </div>
              </div>
              <p style={{ marginTop: '20px' }}>
                For any privacy-related queries, please reach out to our safety cell at <strong>support@agroplatform.app</strong>.
              </p>
            </div>
          </section>

          {/* COPYRIGHT */}
          <section id="copyright" className="policy-section card-premium">
            <div className="section-header">
              <Copyright className="icon-agri" />
              <h2>Copyright Notice</h2>
            </div>
            <div className="policy-text">
              <p>
                © {new Date().getFullYear()} <strong>AgroMart / AgroPlatform Systems</strong>. All Rights Reserved.
              </p>
              <p>
                All content, including text, graphics, logos, images, AI-generated advisories, and software code, 
                is the intellectual property of AgroMart. Unauthorized reproduction, distribution, or 
                mirroring of this platform is strictly prohibited and protected by Indian and International 
                copyright laws.
              </p>
              <p>
                The name \"AgroMart\" and the AgroPlatform logo are registered trademarks of their respective owners.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default PolicyPage;
