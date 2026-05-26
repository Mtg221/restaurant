// components/common/index.jsx
// Reusable UI components: Spinner, ErrorMessage, EmptyState, StatusBadge

// ── Loading Spinner ────────────────────────────────────────────────────────
export const Spinner = ({ size = "md", text = "Loading..." }) => {
  const sizes = { sm: "w-6 h-6", md: "w-10 h-10", lg: "w-14 h-14" };
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className={`${sizes[size]} spinner`} />
      {text && <p className="text-stone-400 text-sm">{text}</p>}
    </div>
  );
};

// ── Error Message ──────────────────────────────────────────────────────────
export const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-16 px-4 text-center">
    <div className="text-5xl">😕</div>
    <div>
      <p className="text-stone-700 font-medium mb-1">Something went wrong</p>
      <p className="text-stone-500 text-sm">{message}</p>
    </div>
    {onRetry && (
      <button onClick={onRetry} className="btn-primary text-sm px-5 py-2">
        Try Again
      </button>
    )}
  </div>
);

// ── Empty State ────────────────────────────────────────────────────────────
export const EmptyState = ({ emoji = "🍽️", title, subtitle, action }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-20 px-4 text-center">
    <div className="text-6xl">{emoji}</div>
    <div>
      <p className="text-stone-700 font-semibold text-lg mb-1">{title}</p>
      {subtitle && <p className="text-stone-400 text-sm">{subtitle}</p>}
    </div>
    {action}
  </div>
);

// ── Order Status Badge ─────────────────────────────────────────────────────
export const StatusBadge = ({ status }) => {
  const styles = {
    pending:   "bg-yellow-100 text-yellow-700 border border-yellow-200",
    preparing: "bg-blue-100 text-blue-700 border border-blue-200",
    delivered: "bg-green-100 text-green-700 border border-green-200",
    cancelled: "bg-red-100 text-red-600 border border-red-200",
  };
  const labels = {
    pending:   "⏳ Pending",
    preparing: "👨‍🍳 Preparing",
    delivered: "✅ Delivered",
    cancelled: "❌ Cancelled",
  };
  return (
    <span className={`badge ${styles[status] || "bg-stone-100 text-stone-600"}`}>
      {labels[status] || status}
    </span>
  );
};

// ── Page Header ────────────────────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, children }) => (
  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-b border-amber-100 py-10 px-4">
    <div className="max-w-6xl mx-auto">
      <h1 className="section-title">{title}</h1>
      {subtitle && <p className="text-stone-500 mt-1">{subtitle}</p>}
      {children}
    </div>
  </div>
);

// ── Confirm Modal ──────────────────────────────────────────────────────────
export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, danger = false }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full animate-slide-up">
        <h3 className="font-display text-xl text-stone-800 mb-2">{title}</h3>
        <p className="text-stone-500 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-secondary text-sm px-5 py-2">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={danger ? "btn-danger" : "btn-primary text-sm"}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
