// pages/OrderSuccessPage.jsx
import { Link } from "react-router-dom";

export const OrderSuccessPage = () => (
  <div className="page-enter min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-amber-50 to-orange-50">
    <div className="max-w-md w-full text-center">
      <div className="text-7xl mb-6 animate-bounce">🎉</div>
      <h1 className="font-display text-4xl text-stone-800 mb-3">Order Placed!</h1>
      <p className="text-stone-500 mb-2">
        Thank you for your order! We've received it and our kitchen team
        is already getting started.
      </p>
      <p className="text-stone-400 text-sm mb-8">
        We'll deliver your food as soon as possible. You can contact us
        for updates.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/menu" className="btn-primary">
          Order More 🍛
        </Link>
        <Link to="/" className="btn-secondary">
          Back to Home
        </Link>
      </div>
    </div>
  </div>
);

// pages/ContactPage.jsx
export const ContactPage = () => (
  <div className="page-enter min-h-screen">
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-b border-amber-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-4xl text-stone-800 mb-2">Contact Us</h1>
        <p className="text-stone-500">We'd love to hear from you</p>
      </div>
    </div>

    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact info */}
        <div>
          <h2 className="font-display text-2xl text-stone-800 mb-6">Get in Touch</h2>
          <p className="text-stone-500 mb-8 leading-relaxed">
            Have questions about our menu, delivery, or want to place a large
            group order? We're happy to help! Reach out via any of the
            channels below.
          </p>
          <div className="space-y-5">
            {[
              {
                icon: "📞",
                label: "Phone",
                value: "+221 70 123 45 67",
                href: "tel:+221701234567",
                color: "bg-blue-50 text-blue-600",
              },
              {
                icon: "✉️",
                label: "Email",
                value: "hello@senegaldishes.com",
                href: "mailto:hello@senegaldishes.com",
                color: "bg-amber-50 text-amber-600",
              },
              {
                icon: "💬",
                label: "WhatsApp",
                value: "Chat with us",
                href: "https://wa.me/221701234567",
                color: "bg-green-50 text-green-600",
                external: true,
              },
              {
                icon: "📍",
                label: "Address",
                value: "Dakar, Sénégal",
                color: "bg-red-50 text-red-600",
              },
            ].map(({ icon, label, value, href, color, external }) => (
              <div
                key={label}
                className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${color}`}>
                  {icon}
                </div>
                <div>
                  <p className="text-xs text-stone-400 font-medium uppercase tracking-wide">
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="font-medium text-stone-700 hover:text-amber-600 transition-colors"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="font-medium text-stone-700">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hours & Info */}
        <div>
          <h2 className="font-display text-2xl text-stone-800 mb-6">Opening Hours</h2>
          <div className="card p-6">
            <div className="space-y-3">
              {[
                { day: "Monday – Friday", hours: "10:00 AM – 9:00 PM" },
                { day: "Saturday", hours: "10:00 AM – 10:00 PM" },
                { day: "Sunday", hours: "12:00 PM – 8:00 PM" },
              ].map(({ day, hours }) => (
                <div key={day} className="flex justify-between py-2 border-b border-stone-50 last:border-0">
                  <span className="text-stone-600 text-sm">{day}</span>
                  <span className="text-stone-800 font-medium text-sm">{hours}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-amber-50 rounded-xl">
              <p className="text-amber-700 text-sm">
                🚀 <strong>Fast Delivery:</strong> Most orders are delivered
                within 30–45 minutes in central Dakar.
              </p>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <a
            href="https://wa.me/221701234567?text=Hello!%20I'd%20like%20to%20order%20from%20S%C3%A9n%C3%A9gal%20Dishes."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-4 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg w-full"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Order via WhatsApp
          </a>
        </div>
      </div>
    </div>
  </div>
);
