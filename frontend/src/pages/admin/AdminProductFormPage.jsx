// pages/admin/AdminProductFormPage.jsx
// Shared form for creating and editing dishes

import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { productAPI } from "../../services/api";
import { Spinner } from "../../components/common";
import toast from "react-hot-toast";

const CATEGORIES = ["Rice Dishes", "Grilled", "Snacks", "Desserts", "Drinks", "Soups & Stews"];

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "Rice Dishes",
  available: true,
};

const AdminProductFormPage = () => {
  const { id } = useParams(); // Present when editing
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit); // Load existing data if editing
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [imgPreviewError, setImgPreviewError] = useState(false);

  // Load existing product data if editing
  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        const { data } = await productAPI.getById(id);
        const p = data.data;
        setForm({
          name: p.name,
          description: p.description,
          price: p.price.toString(),
          image: p.image,
          category: p.category,
          available: p.available,
        });
      } catch {
        toast.error("Product not found");
        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      e.price = "Enter a valid price";
    if (!form.image.trim()) e.image = "Image URL is required";
    if (!form.category) e.category = "Category is required";
    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "image") setImgPreviewError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...form, price: Number(form.price) };

      if (isEdit) {
        await productAPI.update(id, payload);
        toast.success("Dish updated successfully!");
      } else {
        await productAPI.create(payload);
        toast.success("Dish added to menu!");
      }
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner text="Loading product..." />;

  return (
    <div className="page-enter max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <Link to="/admin/products" className="text-stone-400 hover:text-stone-600 transition-colors">
          ←
        </Link>
        <div>
          <h1 className="font-display text-2xl text-stone-800">
            {isEdit ? "Edit Dish" : "Add New Dish"}
          </h1>
          <p className="text-stone-400 text-sm">
            {isEdit ? "Update the dish details below" : "Add a new dish to your menu"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left — main fields */}
          <div className="md:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Dish Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Thiéboudienne"
                  className={`input-field ${errors.name ? "border-red-400" : ""}`}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the dish — ingredients, taste, serving style..."
                  className={`input-field resize-none ${errors.description ? "border-red-400" : ""}`}
                />
                <div className="flex justify-between mt-1">
                  {errors.description && <p className="text-red-400 text-xs">{errors.description}</p>}
                  <p className="text-stone-300 text-xs ml-auto">{form.description.length}/500</p>
                </div>
              </div>

              {/* Price + Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Price (CFA) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="3500"
                    min="0"
                    className={`input-field ${errors.price ? "border-red-400" : ""}`}
                  />
                  {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Availability toggle */}
              <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
                <div>
                  <p className="font-medium text-stone-700 text-sm">Available on Menu</p>
                  <p className="text-stone-400 text-xs">Customers can order this dish</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="available"
                    checked={form.available}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:ring-2 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
                </label>
              </div>
            </div>
          </div>

          {/* Right — image */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Image URL <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  className={`input-field text-xs ${errors.image ? "border-red-400" : ""}`}
                />
                {errors.image && <p className="text-red-400 text-xs mt-1">{errors.image}</p>}
              </div>

              {/* Image preview */}
              <div className="aspect-square rounded-xl overflow-hidden bg-stone-50 border border-stone-100">
                {form.image && !imgPreviewError ? (
                  <img
                    src={form.image}
                    alt="Preview"
                    onError={() => setImgPreviewError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300 text-sm">
                    {imgPreviewError ? "⚠️ Invalid URL" : "Image preview"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit buttons */}
        <div className="flex gap-4 mt-6 justify-end">
          <Link to="/admin/products" className="btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary flex items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              isEdit ? "Update Dish" : "Add Dish"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductFormPage;
