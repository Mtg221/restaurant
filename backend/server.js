require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Connect DB
connectDB();

const app = express();

// ─── Middlewares ───────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── CORS ───────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "https://restaurantdemakh.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Routes ─────────────────────────────────────────────────────

// Root route (fix "Route / not found")
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Sénégal Dishes API is running 🍛",
    endpoints: ["/api/auth", "/api/products", "/api/orders", "/api/health"],
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Health check (Render / deployment)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy 🚀",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 Handler ───────────────────────────────────────────────
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ──────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ──────────────────────────────────────────────
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`
🚀 Server running in ${process.env.NODE_ENV || "development"} mode
🌍 Port: ${PORT}
📡 API: http://localhost:${PORT}/api
  `);
});