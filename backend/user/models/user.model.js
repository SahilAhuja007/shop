const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "vendor", "admin"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
    },
    access: {
      type: String,
      enum: ["product management", "orders management"],
    },
    googleId: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
