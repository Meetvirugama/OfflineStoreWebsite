import { Link } from "react-router-dom";
import useTranslation from "@core/i18n/useTranslation";
import "@/styles/Footer.css";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer__main container">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <span>🌿</span> AgroPlatform
          </Link>
          <p className="footer__tagline">
            {t('footer.tagline')}
          </p>
          <div className="footer__social">
            <a href="https://www.linkedin.com/in/meet-patel-76a107320/" className="footer__social-link social--linkedin" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="https://www.instagram.com/virugamameet/" className="footer__social-link social--instagram" target="_blank" rel="noreferrer" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://github.com/Meetvirugama" className="footer__social-link social--github" target="_blank" rel="noreferrer" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
            <a href="https://codeforces.com/profile/meet56963" className="footer__social-link social--codeforces" target="_blank" rel="noreferrer" aria-label="Codeforces">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14v6M12 4v16M20 9v11"/></svg>
            </a>
            <a href="https://leetcode.com/u/meetvirugama/" className="footer__social-link social--leetcode" target="_blank" rel="noreferrer" aria-label="LeetCode">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 16v-6M18 16V8M12 16v-4"/></svg>
            </a>
            <a href="https://wa.me/919876500000" className="footer__social-link social--whatsapp" target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </a>
          </div>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">{t('footer.quickLinks')}</h4>
          <ul className="footer__links">
            <li><Link to="/">{t('footer.home')}</Link></li>
            <li><Link to="/products">{t('footer.allProducts')}</Link></li>
            <li><Link to="/products?category=Fertilizers">{t('footer.fertilizers')}</Link></li>
            <li><Link to="/products?category=Pesticides">{t('footer.pesticides')}</Link></li>
            <li><Link to="/products?category=Medicines">{t('footer.cropMedicines')}</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">{t('footer.myAccount')}</h4>
          <ul className="footer__links">
            <li><Link to="/auth/login">{t('footer.login')}</Link></li>
            <li><Link to="/auth/register">{t('footer.register')}</Link></li>
            <li><Link to="/profile">{t('footer.myProfile')}</Link></li>
            <li><Link to="/orders">{t('footer.myOrders')}</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">{t('footer.agriIntelligence')}</h4>
          <ul className="footer__links">
            <li><Link to="/farming-news">{t('footer.farmingNews')}</Link></li>
            <li><Link to="/nearby-mandis">{t('footer.nearbyMandis')}</Link></li>
            <li><Link to="/pest-detection">{t('footer.pestDetection')}</Link></li>
            <li><Link to="/crop-advisory">{t('footer.cropAdvisory')}</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">{t('footer.contact')}</h4>
          <ul className="footer__links footer__links--info">
            <li>📞 +91 98765 00000</li>
            <li>📧 support@agroplatform.app</li>
            <li>🕐 Mon–Sat: 9 AM – 6 PM</li>
            <li>🌐 www.agroplatform.app</li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>{t('footer.copyright')}</p>
          <div className="footer__badges">
            <span className="footer__badge">{t('footer.certifiedProducts')}</span>
            <span className="footer__badge">{t('footer.farmDelivery')}</span>
            <span className="footer__badge">{t('footer.securePayments')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
