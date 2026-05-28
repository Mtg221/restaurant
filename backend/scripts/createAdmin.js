require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("../config/db");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "superadmin"], default: "admin" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

const createAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ email: "admin@senegaldishes.com" });
    if (existingAdmin) {
      console.log("✅ Admin already exists!");
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    await User.create({
      name: "Admin",
      email: "admin@senegaldishes.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin created successfully!");
    console.log("Email: admin@senegaldishes.com");
    console.log("Password: admin123");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createAdmin();