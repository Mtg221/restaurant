// models/Product.js
// Mongoose schema for Senegalese dishes

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      default: "https://via.placeholder.com/400x300?text=Dish+Image",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["Rice Dishes", "Grilled", "Snacks", "Desserts", "Drinks", "Soups & Stews"],
        message: "{VALUE} is not a valid category",
      },
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Index for faster search queries
productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
