// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
} = require("../controllers/orderController");
const { protect } = require("../middleware/auth");

// Public route - customers place orders
router.post("/", createOrder);

// Protected admin routes
router.get("/stats", protect, getOrderStats); // Must be before /:id
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id", protect, updateOrderStatus);

module.exports = router;
