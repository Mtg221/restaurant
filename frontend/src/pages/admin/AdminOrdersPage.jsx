// pages/admin/AdminOrdersPage.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { orderAPI } from "../../services/api";
import { Spinner, ErrorMessage, StatusBadge } from "../../components/common";
import toast from "react-hot-toast";

const STATUSES = ["all", "pending", "preparing", "delivered", "cancelled"];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeStatus = searchParams.get("status") || "all";

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = activeStatus !== "all" ? { status: activeStatus } : {};
      const { data } = await orderAPI.getAll(params);
      setOrders(data.data);
    } catch {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [activeStatus]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => o._id === orderId ? { ...o, status: newStatus } : o)
      );
      toast.success(`Order updated to "${newStatus}"`);
    } catch {
      toast.error("Failed to update order status");
    }
  };

  const formatPrice = (p) =>
    new Intl.NumberFormat("fr-SN", { style: "currency", currency: "XOF", minimumFractionDigits: 0 }).format(p);

  return (
    <div className="page-enter max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-stone-800">Orders</h1>
          <p className="text-stone-400 text-sm">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={fetchOrders} className="btn-secondary text-sm px-4 py-2">
          Refresh
        </button>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setSearchParams(s !== "all" ? { status: s } : {})}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all capitalize flex-shrink-0 ${
              activeStatus === s
                ? "bg-amber-500 text-white"
                : "bg-white border border-stone-200 text-stone-600 hover:border-amber-300"
            }`}
          >
            {s === "all" ? "All Orders" : s}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner text="Loading orders..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchOrders} />
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-stone-400">
          <div className="text-5xl mb-4">📦</div>
          <p>No {activeStatus !== "all" ? activeStatus : ""} orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Order header */}
              <div
                className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-stone-50 transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium text-stone-800 text-sm">{order.customerName}</p>
                    <p className="text-stone-400 text-xs">{order.phone}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="font-bold text-stone-700 text-sm">{formatPrice(order.total)}</p>
                    <p className="text-stone-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <svg
                    className={`w-4 h-4 text-stone-400 transition-transform ${expandedOrder === order._id ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Expanded details */}
              {expandedOrder === order._id && (
                <div className="border-t border-stone-50 px-5 py-4 space-y-4 bg-stone-50/50">
                  {/* Items */}
                  <div>
                    <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">Items</p>
                    <div className="space-y-1.5">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-stone-600">{item.name} × {item.quantity}</span>
                          <span className="text-stone-700 font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-1">Address</p>
                      <p className="text-sm text-stone-700">{order.address}</p>
                    </div>
                    {order.notes && (
                      <div>
                        <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-1">Notes</p>
                        <p className="text-sm text-stone-700 italic">{order.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Status update */}
                  <div>
                    <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">Update Status</p>
                    <div className="flex flex-wrap gap-2">
                      {["pending", "preparing", "delivered", "cancelled"].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleStatusUpdate(order._id, s)}
                          disabled={order.status === s}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                            order.status === s
                              ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                              : "bg-white border border-stone-200 text-stone-600 hover:border-amber-400 hover:text-amber-600"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
