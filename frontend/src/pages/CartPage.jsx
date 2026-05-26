// pages/CartPage.jsx
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { EmptyState, PageHeader } from "../components/common";
import toast from "react-hot-toast";

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();

  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-SN", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(price);

  const handleRemove = (item) => {
    removeFromCart(item._id);
    toast.error(`${item.name} removed`, {
      style: { background: "#1c1917", color: "#fff", borderRadius: "12px" },
    });
  };

  if (items.length === 0) {
    return (
      <div className="page-enter min-h-screen">
        <PageHeader title="Your Cart" subtitle="Review your order before checkout" />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <EmptyState
            emoji="🛒"
            title="Your cart is empty"
            subtitle="Add some delicious Senegalese dishes to get started!"
            action={
              <Link to="/menu" className="btn-primary">
                Browse Menu
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter min-h-screen">
      <PageHeader
        title="Your Cart"
        subtitle={`${items.length} item${items.length > 1 ? "s" : ""} in your cart`}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item._id} className="card p-4 flex gap-4 items-start">
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = "https://placehold.co/100x100/fef3c7/92400e?text=🍛";
                  }}
                  className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                />
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-display font-semibold text-stone-800 text-sm leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-amber-600 font-semibold text-sm mt-0.5">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(item)}
                      className="text-stone-300 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                      aria-label="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-2 bg-stone-50 rounded-full border border-stone-200 px-1">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-stone-500 hover:text-amber-600 transition-colors font-bold"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-stone-700">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-stone-500 hover:text-amber-600 transition-colors font-bold"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-stone-400 text-sm">
                      = {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear cart */}
            <button
              onClick={() => {
                clearCart();
                toast("Cart cleared", { icon: "🗑️" });
              }}
              className="text-sm text-stone-400 hover:text-red-400 transition-colors mt-2"
            >
              Clear all items
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-display text-xl text-stone-800 mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-stone-500 truncate flex-1 mr-2">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-stone-700 font-medium flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-stone-100 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-bold text-stone-800">Total</span>
                  <span className="font-bold text-amber-600 text-xl">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
              <Link to="/checkout" className="btn-primary w-full text-center block">
                Proceed to Checkout →
              </Link>
              <Link
                to="/menu"
                className="block text-center text-sm text-stone-400 hover:text-amber-500 mt-3 transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
