const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  totalPrice: { type: Number, required: true, default: 0 },
  totalItemCount: { type: Number, required: true, default: 0 },
  totalItems: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model("Cart", cartSchema);
