import "@styles/PolicyPage.css";
import { ShieldCheck, RefreshCcw, Lock, AlertCircle } from "lucide-react";

export default function PolicyPage() {
  return (
    <div className="policy-container">
      <header className="policy-header">
        <h1>AgroPlatform Policy Center</h1>
        <p>Your trust is our foundation. Learn about our commitments to you.</p>
      </header>

      <div className="policy-grid">
        <section className="policy-card">
          <div className="policy-icon">
            <RefreshCcw size={32} />
          </div>
          <h2>Refund & Return Policy</h2>
          <div className="policy-content">
            <p><strong>Note: No Refund or Return Policy</strong></p>
            <p>
              AgroMart specializes in agricultural supplies including seeds, fertilizers, and equipment. 
              Due to the nature of these products and the critical timing of agricultural cycles, we maintain a 
              <strong> strict no-refund and no-return policy</strong> once a product has been delivered.
            </p>
            <ul>
              <li>Seeds and biological items are non-returnable due to viability concerns.</li>
              <li>Fertilizers and chemicals are non-returnable to prevent contamination.</li>
              <li>Equipment once used in field operations cannot be returned.</li>
            </ul>
          </div>
        </section>

        <section className="policy-card">
          <div className="policy-icon">
            <ShieldCheck size={32} />
          </div>
          <h2>Safety & Security</h2>
          <div className="policy-content">
            <p>
              We employ military-grade encryption for all transactions. Your payment details are processed 
              through secure gateways (Razorpay) and are never stored on our local servers.
            </p>
            <p>
              Our automated system monitors for fraudulent activity 24/7 to ensure the integrity of the 
              AgroPlatform marketplace.
            </p>
          </div>
        </section>

        <section className="policy-card">
          <div className="policy-icon">
            <Lock size={32} />
          </div>
          <h2>Privacy Commitment</h2>
          <div className="policy-content">
            <p>
              Your agricultural data, including crop yields and farm locations, is strictly confidential. 
              We do not sell user data to third-party advertisers.
            </p>
            <p>
              Data is used exclusively to improve the AI-driven crop advisory and local market pricing 
              accuracy for the benefit of the farmer community.
            </p>
          </div>
        </section>

        <section className="policy-card">
          <div className="policy-icon">
            <AlertCircle size={32} />
          </div>
          <h2>Copyright & IP</h2>
          <div className="policy-content">
            <p>
              All content on this platform, including the AgroIntelligence AI engine, proprietary 
              mandi analytics, and diagnostic tools, is the property of AgroPlatform Systems.
            </p>
            <p>
              The name "AgroMart" and the AgroPlatform logo are registered trademarks of their respective owners.
            </p>
          </div>
        </section>
      </div>
      
      <footer className="policy-footer">
        <p>Last Updated: April 2026. AgroPlatform Systems reserves the right to modify these policies at any time.</p>
      </footer>
    </div>
  );
}
