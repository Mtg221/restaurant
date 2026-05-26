// components/common/ProductCard.jsx
// Displays a single dish card on the menu page

import { useState } from "react";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const { addToCart, isInCart } = useCart();
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart! 🛒`, {
      style: { background: "#1c1917", color: "#fff", borderRadius: "12px" },
      iconTheme: { primary: "#f59e0b", secondary: "#fff" },
    });
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-SN", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="card group flex flex-col overflow-hidden animate-fade-in">
      {/* Dish image */}
      <div className="relative overflow-hidden h-48 bg-amber-50">
        <img
          src={imgError ? "https://placehold.co/400x300/fef3c7/92400e?text=Dish" : product.image}
          alt={product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category tag */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-amber-700 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
          {product.category}
        </span>
        {/* Unavailable overlay */}
        {!product.available && (
          <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center">
            <span className="text-white font-medium text-sm bg-stone-700 px-3 py-1 rounded-full">
              Currently Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-display text-lg text-stone-800 mb-1 leading-snug">
          {product.name}
        </h3>
        <p className="text-stone-500 text-xs leading-relaxed line-clamp-3 flex-1 mb-3">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-stone-100">
          <span className="font-bold text-amber-600 text-lg">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={!product.available}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 active:scale-95
              ${isInCart(product._id)
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-amber-500 hover:bg-amber-600 text-white shadow-sm hover:shadow"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {isInCart(product._id) ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Added
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
