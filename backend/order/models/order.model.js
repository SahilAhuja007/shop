const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalprice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    deliveredAt: {
      type: Date,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: "India" },
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentInfo: {
      method: String,
      order_id: String,
      payment_id: String,
      signature: String,
      paidAt: Date,
    },
    deliverStatus: {
      type: String,
      enum: [
        "processing",
        "packed",
        "shipped",
        "out for delivery",
        "delivered",
      ],
      default: "processing",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
