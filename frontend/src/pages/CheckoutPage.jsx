// pages/CheckoutPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { orderAPI } from "../services/api";
import { PageHeader, EmptyState } from "../components/common";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-SN", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(price);

  // ── Form validation ──────────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (!form.customerName.trim()) newErrors.customerName = "Name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[\d\s\+\-]{7,15}$/.test(form.phone.trim()))
      newErrors.phone = "Enter a valid phone number";
    if (!form.address.trim()) newErrors.address = "Delivery address is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      // Build order payload
      const orderData = {
        ...form,
        items: items.map((item) => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        total,
      };

      await orderAPI.create(orderData);

      clearCart();
      toast.success("Order placed successfully! 🎉", {
        duration: 4000,
        style: { background: "#166534", color: "#fff", borderRadius: "12px" },
      });
      navigate("/order-success");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order. Please try again.", {
        style: { background: "#7f1d1d", color: "#fff", borderRadius: "12px" },
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="page-enter min-h-screen">
        <PageHeader title="Checkout" />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <EmptyState
            emoji="🛒"
            title="No items to checkout"
            subtitle="Add some dishes to your cart first"
            action={<Link to="/menu" className="btn-primary">Browse Menu</Link>}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter min-h-screen">
      <PageHeader title="Checkout" subtitle="Fill in your delivery details" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* ── Delivery Form ── */}
            <div className="lg:col-span-3">
              <div className="card p-6">
                <h2 className="font-display text-xl text-stone-800 mb-6">
                  Delivery Details
                </h2>
                <div className="space-y-5">
                  {/* Customer Name */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={form.customerName}
                      onChange={handleChange}
                      placeholder="e.g. Fatou Diallo"
                      className={`input-field ${errors.customerName ? "border-red-400 focus:ring-red-300" : ""}`}
                    />
                    {errors.customerName && (
                      <p className="text-red-400 text-xs mt-1">{errors.customerName}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="e.g. +221 77 123 45 67"
                      className={`input-field ${errors.phone ? "border-red-400 focus:ring-red-300" : ""}`}
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                      Delivery Address <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Street, neighborhood, landmarks..."
                      className={`input-field resize-none ${errors.address ? "border-red-400 focus:ring-red-300" : ""}`}
                    />
                    {errors.address && (
                      <p className="text-red-400 text-xs mt-1">{errors.address}</p>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                      Order Notes{" "}
                      <span className="text-stone-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Spice preferences, allergies, special requests..."
                      className="input-field resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Order Review ── */}
            <div className="lg:col-span-2">
              <div className="card p-6 sticky top-24">
                <h2 className="font-display text-xl text-stone-800 mb-4">
                  Your Order
                </h2>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item._id} className="flex gap-3 items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => e.target.src = "https://placehold.co/50x50/fef3c7/92400e?text=🍛"}
                        className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-stone-700 truncate">{item.name}</p>
                        <p className="text-xs text-stone-400">× {item.quantity}</p>
                      </div>
                      <span className="text-xs font-semibold text-stone-700 flex-shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone-100 pt-4 mb-5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-stone-800">Total</span>
                    <span className="font-bold text-amber-600 text-xl">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    "Place Order 🎉"
                  )}
                </button>

                <Link
                  to="/cart"
                  className="block text-center text-sm text-stone-400 hover:text-amber-500 mt-3 transition-colors"
                >
                  ← Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
