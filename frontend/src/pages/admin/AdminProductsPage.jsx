// pages/admin/AdminProductsPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { productAPI } from "../../services/api";
import { Spinner, ErrorMessage, ConfirmModal } from "../../components/common";
import toast from "react-hot-toast";

const AdminProductsPage = () => {
  const { products, loading, error, refetch } = useProducts();
  const [deleteModal, setDeleteModal] = useState({ open: false, product: null });
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await productAPI.delete(deleteModal.product._id);
      toast.success(`"${deleteModal.product.name}" deleted`);
      setDeleteModal({ open: false, product: null });
      refetch();
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  const formatPrice = (p) =>
    new Intl.NumberFormat("fr-SN", { style: "currency", currency: "XOF", minimumFractionDigits: 0 }).format(p);

  return (
    <div className="page-enter max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-stone-800">Menu Items</h1>
          <p className="text-stone-400 text-sm">{products.length} dishes</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary text-sm px-5 py-2.5">
          + Add Dish
        </Link>
      </div>

      {loading ? (
        <Spinner text="Loading products..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-stone-400 uppercase tracking-wide border-b border-stone-50">
                  <th className="text-left px-6 py-3">Dish</th>
                  <th className="text-left px-6 py-3 hidden sm:table-cell">Category</th>
                  <th className="text-left px-6 py-3">Price</th>
                  <th className="text-left px-6 py-3 hidden md:table-cell">Status</th>
                  <th className="text-right px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          onError={(e) => e.target.src = "https://placehold.co/40x40/fef3c7/92400e?text=🍛"}
                          className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                        />
                        <div>
                          <p className="font-medium text-stone-700 text-sm">{product.name}</p>
                          <p className="text-stone-400 text-xs line-clamp-1 max-w-48 hidden md:block">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 hidden sm:table-cell">
                      <span className="badge bg-amber-50 text-amber-700">{product.category}</span>
                    </td>
                    <td className="px-6 py-3 font-semibold text-stone-700 text-sm">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-3 hidden md:table-cell">
                      <span className={`badge ${product.available ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"}`}>
                        {product.available ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="text-xs font-medium text-amber-600 hover:text-amber-700 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ open: true, product })}
                          className="text-xs font-medium text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete Dish"
        message={`Are you sure you want to delete "${deleteModal.product?.name}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, product: null })}
        danger
      />
    </div>
  );
};

export default AdminProductsPage;
