// pages/HomePage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productAPI } from "../services/api";
import ProductCard from "../components/common/ProductCard";
import { Spinner, ErrorMessage } from "../components/common";

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await productAPI.getAll({ available: true });
        // Show first 4 dishes as featured
        setFeatured(data.data.slice(0, 4));
      } catch {
        setError("Could not load featured dishes.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="page-enter">
      {/* ── Hero Section ── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-stone-900">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/80 to-transparent" />

        {/* Hero image (right side) */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1547592166-23ac45744acd?w=900&q=80"
            alt="Senegalese food"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900 to-transparent" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <span>🇸🇳</span> Authentic Senegalese Cuisine
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6">
              A Taste of{" "}
              <span className="text-amber-400 italic">Dakar</span>
              <br />in Every Bite
            </h1>
            <p className="text-stone-300 text-lg leading-relaxed mb-8 max-w-md">
              From the iconic Thiéboudienne to creamy Thiakry desserts — discover
              the rich, aromatic flavors of Senegal, made fresh and delivered to
              your door.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/menu" className="btn-primary text-base px-8 py-4">
                Order Now 🛒
              </Link>
              <a
                href="#featured"
                className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-full transition-all duration-200"
              >
                Browse Menu
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
              {[
                { value: "20+", label: "Dishes" },
                { value: "100%", label: "Authentic" },
                { value: "Fast", label: "Delivery" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="font-display text-2xl text-amber-400 font-bold">{value}</div>
                  <div className="text-stone-400 text-xs mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories Banner ── */}
      <section className="bg-amber-500 py-4 overflow-hidden">
        <div className="flex gap-8 items-center justify-center flex-wrap px-4">
          {["🍚 Rice Dishes", "🍖 Grilled", "🥟 Snacks", "🍮 Desserts", "🥤 Drinks", "🍲 Soups & Stews"].map((cat) => (
            <span key={cat} className="text-amber-900 font-medium text-sm whitespace-nowrap">
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* ── Featured Dishes ── */}
      <section id="featured" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-amber-500 font-medium text-sm mb-2 tracking-widest uppercase">
            Customer Favorites
          </p>
          <h2 className="section-title">Featured Dishes</h2>
          <p className="text-stone-500 mt-2 max-w-md mx-auto">
            Our most-loved Senegalese recipes, prepared with traditional spices and fresh ingredients.
          </p>
        </div>

        {loading ? (
          <Spinner text="Loading featured dishes..." />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/menu" className="btn-secondary inline-flex items-center gap-2">
            See Full Menu
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="bg-stone-50 border-y border-stone-100 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-title">Why Choose Us?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🌿",
                title: "Fresh Ingredients",
                desc: "Every dish is prepared daily using fresh, locally sourced ingredients and authentic Senegalese spices.",
              },
              {
                icon: "⚡",
                title: "Fast Delivery",
                desc: "We deliver hot, fresh food straight to your door — quickly and reliably across Dakar.",
              },
              {
                icon: "👨‍🍳",
                title: "Traditional Recipes",
                desc: "Our chefs bring generations of Senegalese culinary tradition to every plate they prepare.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-display text-xl text-stone-800 mb-2">{title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-500 py-16 px-4 text-center">
        <h2 className="font-display text-3xl md:text-4xl text-white mb-4">
          Ready to Order?
        </h2>
        <p className="text-amber-100 mb-8 max-w-md mx-auto">
          Browse our full menu and get authentic Senegalese food delivered to your door.
        </p>
        <Link
          to="/menu"
          className="inline-block bg-white text-amber-600 hover:bg-amber-50 font-bold px-10 py-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
        >
          View Full Menu →
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
