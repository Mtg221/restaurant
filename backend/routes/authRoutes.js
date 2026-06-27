// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Trop de tentatives, réessayez dans 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware : vérifie que la requête provient d'un admin existant ou porte le secret d'inscription
const requireRegisterSecret = (req, res, next) => {
  const secret = req.headers["x-register-secret"];
  if (!process.env.REGISTER_SECRET || secret !== process.env.REGISTER_SECRET) {
    return res.status(403).json({ success: false, message: "Création de compte non autorisée" });
  }
  next();
};

router.post("/register", requireRegisterSecret, register);
router.post("/login", authLimiter, login);
router.get("/me", protect, getMe);

module.exports = router;
