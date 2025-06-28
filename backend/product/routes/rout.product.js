const express = require("express");
const productRouter = express.Router();
const { verifyToken, authorization } = require("../../middleware/verifyToken");
const {
  createProduct,
  deleteProducct,
  updateProduct,
  getAllProducts,
  getProductBasedOnType,
} = require("../controller/product.controller");

productRouter.post(
  "/create",
  verifyToken,
  authorization("admin", "vendor"),
  createProduct
);

productRouter.delete(
  "/delete/:product_id",
  verifyToken,
  authorization("admin", "vendor"),
  deleteProducct
);

productRouter.put(
  "/update/:product_id",
  verifyToken,
  authorization("admin", "vendor"),
  updateProduct
);
productRouter.get(
  "/getAllProducts",
  verifyToken,
  authorization("admin", "vendor", "user"),
  getAllProducts
);

productRouter.get(
  "/gettopicwiseproducts/:type",
  verifyToken,
  authorization("admin", "vendor", "user"),
  getProductBasedOnType
);
module.exports = productRouter;
