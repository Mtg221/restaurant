const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.error("Error:", err.message);
  }

  if (err.name === "CastError")
    return res.status(404).json({ success: false, message: "Ressource introuvable" });

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "champ";
    return res.status(400).json({ success: false, message: `${field} déjà utilisé` });
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(v => v.message);
    return res.status(400).json({ success: false, message: messages.join(", ") });
  }

  if (err.name === "JsonWebTokenError")
    return res.status(401).json({ success: false, message: "Token invalide" });

  if (err.name === "TokenExpiredError")
    return res.status(401).json({ success: false, message: "Token expiré" });

  res.status(err.statusCode || 500).json({ success: false, message: "Erreur serveur" });
};

module.exports = errorHandler;
