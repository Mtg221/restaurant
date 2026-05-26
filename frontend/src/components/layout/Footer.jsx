// components/layout/Footer.jsx
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍛</span>
              <span className="font-display text-xl text-white">Sénégal Dishes</span>
            </div>
            <p className="text-sm leading-relaxed text-stone-400">
              Authentic Senegalese cuisine delivered to your door. Taste the flavors of Dakar,
              made with love and tradition.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/", label: "Home" },
                { to: "/menu", label: "Our Menu" },
                { to: "/cart", label: "Cart" },
                { to: "/contact", label: "Contact" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="hover:text-amber-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:+221701234567" className="hover:text-amber-400 transition-colors">
                  +221 70 123 45 67
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>
                <a href="mailto:hello@senegaldishes.com" className="hover:text-amber-400 transition-colors">
                  hello@senegaldishes.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span>
                <span>Dakar, Sénégal</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-stone-800 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Sénégal Dishes. All rights reserved.</p>
          <Link to="/admin" className="hover:text-amber-400 transition-colors">
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
