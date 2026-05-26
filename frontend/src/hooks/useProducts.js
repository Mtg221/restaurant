// hooks/useProducts.js
// Custom hook for fetching and managing products

import { useState, useEffect, useCallback } from "react";
import { productAPI } from "../services/api";

export const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await productAPI.getAll(params);
      setProducts(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dishes");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const refetch = () => fetchProducts();
  const updateParams = (newParams) => setParams((prev) => ({ ...prev, ...newParams }));

  return { products, loading, error, refetch, updateParams, params };
};

// hooks/useOrders.js
// Custom hook for admin order management
export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async (params = {}) => {
    try {
      setLoading(true);
      const { orderAPI } = await import("../services/api");
      const { data } = await orderAPI.getAll(params);
      setOrders(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, error, refetch: fetchOrders, setOrders };
};
