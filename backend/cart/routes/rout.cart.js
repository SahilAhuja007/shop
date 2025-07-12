const express = require("express");
const {
  // createCart,
  deleteCart,
  addProductInTheCart,
  deleteProductFromTheCart,
  cartdetail,
} = require("../controller/cart.controller");
const { verifyToken, authorization } = require("../../middleware/verifyToken");
const cartRouter = express.Router();

// cartRouter.post("/create", verifyToken, authorization("user"), createCart);
cartRouter.delete("/delete", verifyToken, authorization("user"), deleteCart);
cartRouter.post(
  "/addProduct",
  verifyToken,
  authorization("user"),
  addProductInTheCart
);
cartRouter.delete(
  "/deleteProduct",
  verifyToken,
  authorization("user"),
  deleteProductFromTheCart
);
cartRouter.get(
  "/getcartdetail",
  verifyToken,
  authorization("user"),
  cartdetail
);
module.exports = cartRouter;
