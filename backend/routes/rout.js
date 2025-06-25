const express = require("express");
const userRouter = require("../user/routes/rout.user");
const cartRouter = require("../cart/routes/rout.cart");
const productRouter = require("../product/routes/rout.product");
const orderRouter = require("../order/routes/rout.order");
const router = express.Router();

router.use("/user", userRouter);
router.use("/cart", cartRouter);
router.use("/order", orderRouter);
router.use("/product", productRouter);

module.exports = router;
