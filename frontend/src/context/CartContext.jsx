// context/CartContext.jsx
// Global cart state management using React Context API

import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

// ── Reducer: handles all cart actions ─────────────────────────────────────
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i._id === action.payload._id);
      if (existing) {
        // Item already in cart — increment quantity
        return {
          ...state,
          items: state.items.map((i) =>
            i._id === action.payload._id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      // New item — add with quantity 1
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i._id !== action.payload),
      };

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      if (quantity < 1) {
        // Remove item if quantity drops below 1
        return {
          ...state,
          items: state.items.filter((i) => i._id !== id),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i._id === id ? { ...i, quantity } : i
        ),
      };
    }

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "LOAD_CART":
      return { ...state, items: action.payload };

    default:
      return state;
  }
};

const initialState = { items: [] };

// ── Provider component ─────────────────────────────────────────────────────
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on first render
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) {
        dispatch({ type: "LOAD_CART", payload: JSON.parse(saved) });
      }
    } catch (e) {
      console.error("Failed to load cart from storage");
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  // ── Derived values ──────────────────────────────────────────────────────
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  const total = state.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  // ── Action helpers ──────────────────────────────────────────────────────
  const addToCart = (product) =>
    dispatch({ type: "ADD_ITEM", payload: product });

  const removeFromCart = (id) =>
    dispatch({ type: "REMOVE_ITEM", payload: id });

  const updateQuantity = (id, quantity) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });

  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const isInCart = (id) => state.items.some((i) => i._id === id);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        itemCount,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for easy context access
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
