// pages/MenuPage.jsx
import { useState, useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/common/ProductCard";
import { Spinner, ErrorMessage, EmptyState, PageHeader } from "../components/common";

const CATEGORIES = ["All", "Rice Dishes", "Grilled", "Snacks", "Desserts", "Drinks", "Soups & Stews"];

const MenuPage = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { products, loading, error, refetch, updateParams } = useProducts();

  // Debounce search input (wait 400ms before querying)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Update API params when filters change
  useEffect(() => {
    updateParams({
      category: activeCategory === "All" ? undefined : activeCategory,
      search: debouncedSearch || undefined,
    });
  }, [activeCategory, debouncedSearch]);

  return (
    <div className="page-enter min-h-screen">
      <PageHeader
        title="Our Menu"
        subtitle="Explore authentic Senegalese dishes, made fresh daily."
      >
        {/* Search bar */}
        <div className="relative mt-5 max-w-md">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes..."
            className="input-field pl-11 pr-4"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              ✕
            </button>
          )}
        </div>
      </PageHeader>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Category filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                activeCategory === cat
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-white border border-stone-200 text-stone-600 hover:border-amber-300 hover:text-amber-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && !error && (
          <p className="text-stone-400 text-sm mb-6">
            {products.length} dish{products.length !== 1 ? "es" : ""} found
            {activeCategory !== "All" && ` in ${activeCategory}`}
            {debouncedSearch && ` for "${debouncedSearch}"`}
          </p>
        )}

        {/* Content */}
        {loading ? (
          <Spinner text="Loading dishes..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={refetch} />
        ) : products.length === 0 ? (
          <EmptyState
            emoji="🔍"
            title="No dishes found"
            subtitle="Try a different search or category"
            action={
              <button
                onClick={() => { setSearch(""); setActiveCategory("All"); }}
                className="btn-primary text-sm"
              >
                Clear Filters
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
