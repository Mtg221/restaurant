// pages/admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { orderAPI, productAPI } from "../../services/api";
import { Spinner, StatusBadge } from "../../components/common";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, ordersRes, productsRes] = await Promise.all([
          orderAPI.getStats(),
          orderAPI.getAll({ limit: 5 }),
          productAPI.getAll(),
        ]);
        setStats(statsRes.data.data);
        setRecentOrders(ordersRes.data.data);
        setProductCount(productsRes.data.count);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-SN", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(price);

  if (loading) return <Spinner text="Loading dashboard..." />;

  const pendingCount = stats?.byStatus?.find((s) => s._id === "pending")?.count || 0;
  const preparingCount = stats?.byStatus?.find((s) => s._id === "preparing")?.count || 0;
  const deliveredCount = stats?.byStatus?.find((s) => s._id === "delivered")?.count || 0;

  return (
    <div className="page-enter max-w-6xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-stone-800">Dashboard</h1>
        <p className="text-stone-400 text-sm">Overview of your restaurant performance</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Orders",
            value: stats?.totalOrders || 0,
            icon: "📦",
            color: "bg-blue-50 text-blue-600",
          },
          {
            label: "Total Revenue",
            value: formatPrice(stats?.totalRevenue || 0),
            icon: "💰",
            color: "bg-green-50 text-green-600",
          },
          {
            label: "Pending Orders",
            value: pendingCount,
            icon: "⏳",
            color: "bg-yellow-50 text-yellow-600",
          },
          {
            label: "Menu Items",
            value: productCount,
            icon: "🍛",
            color: "bg-amber-50 text-amber-600",
          },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3 ${color}`}>
              {icon}
            </div>
            <p className="text-2xl font-bold text-stone-800">{value}</p>
            <p className="text-stone-400 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Order status breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { status: "pending", count: pendingCount, link: "/admin/orders?status=pending" },
          { status: "preparing", count: preparingCount, link: "/admin/orders?status=preparing" },
          { status: "delivered", count: deliveredCount, link: "/admin/orders?status=delivered" },
        ].map(({ status, count, link }) => (
          <Link
            key={status}
            to={link}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
          >
            <div>
              <StatusBadge status={status} />
              <p className="text-2xl font-bold text-stone-800 mt-2">{count}</p>
            </div>
            <svg className="w-5 h-5 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>

      {/* Recent orders table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-50 flex justify-between items-center">
          <h2 className="font-display text-lg text-stone-800">Recent Orders</h2>
          <Link to="/admin/orders" className="text-amber-500 hover:text-amber-600 text-sm font-medium">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-stone-400 uppercase tracking-wide border-b border-stone-50">
                <th className="text-left px-6 py-3">Customer</th>
                <th className="text-left px-6 py-3 hidden sm:table-cell">Items</th>
                <th className="text-left px-6 py-3">Total</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-left px-6 py-3 hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-stone-400 text-sm">
                    No orders yet
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-3">
                      <p className="font-medium text-stone-700 text-sm">{order.customerName}</p>
                      <p className="text-stone-400 text-xs">{order.phone}</p>
                    </td>
                    <td className="px-6 py-3 hidden sm:table-cell text-stone-500 text-sm">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </td>
                    <td className="px-6 py-3 font-semibold text-stone-700 text-sm">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-3 hidden md:table-cell text-stone-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
