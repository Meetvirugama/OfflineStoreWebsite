import React, { useEffect } from 'react';
import "@styles/PolicyPage.css";
import { 
  ShieldCheck, 
  RefreshCcw, 
  Lock, 
  AlertCircle, 
  Scale, 
  FileText, 
  ArrowRight,
  Info
} from "lucide-react";

export default function PolicyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Policy Center - AgroMart";
  }, []);

  const navLinks = [
    { id: 'refund', title: 'Refund Policy', icon: <RefreshCcw size={18} /> },
    { id: 'safety', title: 'Safety & Security', icon: <ShieldCheck size={18} /> },
    { id: 'privacy', title: 'Privacy Commitment', icon: <Lock size={18} /> },
    { id: 'copyright', title: 'Copyright Notice', icon: <AlertCircle size={18} /> },
  ];

  return (
    <div className="policy-page fade-in">
      <header className="policy-hero">
        <div className="container">
          <h1>AgroPlatform Policy Center</h1>
          <p>Defining the standards of trust and operational integrity within our digital agricultural network.</p>
        </div>
      </header>

      <div className="policy-layout">
        {/* Sidebar Navigation - Visible on Desktop */}
        <aside className="policy-sidebar">
          <div className="policy-nav-card shadow-premium">
            <h3>Policy Index</h3>
            <div className="policy-nav-links">
              {navLinks.map(link => (
                <a key={link.id} href={`#${link.id}`}>
                  {link.icon}
                  {link.title}
                </a>
              ))}
            </div>
            
            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Legal compliance node: <br/> <strong>v2.4.0-STABLE</strong>
              </p>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="policy-content-area">
          
          {/* REFUND POLICY */}
          <section id="refund" className="policy-section-card">
            <div className="section-icon-box">
              <RefreshCcw size={30} />
            </div>
            <h2>Refund & Return Policy</h2>
            
            <div className="critical-box">
              <h4><AlertCircle size={20} /> Critical Terms</h4>
              <p>AgroPlatform maintains a strict No-Refund and No-Return policy due to the biological and environmental sensitivity of agricultural inventory.</p>
            </div>

            <div className="policy-body">
              <p>
                AgroMart specializes in high-fidelity agricultural supplies including certified seeds, crop protection chemicals, and heavy machinery. To maintain the biosecurity and reliability of our network, we adhere to the following termination and return protocols:
              </p>
              <ul>
                <li><strong>Viability Guarantee</strong>: Seeds and biological planting materials are non-returnable once they leave our climate-controlled fulfillment nodes to prevent contamination or loss of germination viability.</li>
                <li><strong>Chemical Integrity</strong>: Fertilizers, pesticides, and growth regulators are sealed for safety. Returns are not permitted as we cannot verify chemical stability once in the field environment.</li>
                <li><strong>Machinery Clause</strong>: Field equipment and machinery once utilized for field operations are considered "In-Service" and cannot be returned for a secondary market cycle.</li>
              </ul>
              <p>In the rare event of a shipping node error or damaged delivery, please contact the Support Cell within 24 hours of receipt with photographic evidence for an administrative review.</p>
            </div>
          </section>

          {/* SAFETY & SECURITY */}
          <section id="safety" className="policy-section-card">
            <div className="section-icon-box">
              <ShieldCheck size={30} />
            </div>
            <h2>Safety & Security</h2>
            <div className="policy-body">
              <p>
                The integrity of our financial ledgers is critical. We employ specialized security protocols to ensure every transaction within the AgroPlatform ecosystem is protected:
              </p>
              <p>
                <strong>Encryption Nodes</strong>: All transactional data is transmitted via SHA-256 military-grade encryption. Payment processing is synchronized directly with Razorpay infrastructure; sensitive credit data never touches our application servers.
              </p>
              <p>
                <strong>Identity Verification</strong>: Every user node is verified via dual-factor authentication to prevent unauthorized procurement or data harvesting. Our system monitors for fraudulent patterns 24/7.
              </p>
            </div>
          </section>

          {/* PRIVACY COMMITMENT */}
          <section id="privacy" className="policy-section-card">
            <div className="section-icon-box">
              <Lock size={30} />
            </div>
            <h2>Privacy Commitment</h2>
            <div className="policy-body">
              <p>
                Your farm data is your property. We act as custodians of this intelligence to provide you with optimized yield projections and mandi analysis:
              </p>
              <ul>
                <li><strong>Data Sovereignty</strong>: We do not sell, rent, or trade your agricultural yield data to third-party marketing networks.</li>
                <li><strong>Intelligence Usage</strong>: Collected data (soil metrics, pest alerts, crop cycles) is utilized exclusively to train our localized AI models for improving your farm's ROI and market timing.</li>
                <li><strong>Anonymization</strong>: Aggregated mandi trends are fully anonymized to maintain your specific farm's strategic privacy while benefiting the collective community.</li>
              </ul>
            </div>
          </section>

          {/* COPYRIGHT NOTICE */}
          <section id="copyright" className="policy-section-card">
            <div className="section-icon-box">
              <Scale size={30} />
            </div>
            <h2>Copyright & IP Notice</h2>
            <div className="policy-body">
              <p>
                © 2026 AgroPlatform Systems. All intellectual property present on this platform is legally protected under international statutes:
              </p>
              <p>
                <strong>Proprietary Intelligence</strong>: The AgroIntelligence AI engine, the Mandi Analytics dashboard, and the Pest Diagnostic computer vision models are proprietary assets. Unauthorized replication or reverse-engineering is strictly prohibited.
              </p>
              <p>
                <strong>Trademarks</strong>: The "AgroMart" name, the circular green node logo, and all associated iconography are registered trademarks of AgroPlatform Systems.
              </p>
            </div>
          </section>

          <div className="policy-footer-note">
            <Info size={16} style={{ marginBottom: '8px' }} />
            <p>Policy Index Version: 2.4.0-STABLE. Updated April 13, 2026.</p>
            <p>AgroPlatform Systems reserves the right to synchronize these terms with regional agricultural laws as required.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
