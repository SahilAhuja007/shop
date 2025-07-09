const Cart = require("../models/cart.moel");
const CartProductLink = require("../models/cartproductlink");
const Product = require("../../product/models/product.model");

exports.createCart = async (req, res) => {
  try {
    // const { user } = req.body;
    const user = req.user._id;
    const cart = await Cart.findOne({ user: user });
    if (cart) {
      return res
        .status(400)
        .json({ success: false, message: "cart is already created" });
    }
    const newCart = await Cart.create({
      user: user,
      totalItems: 0,
      totalPrice: 0,
    });
    return res.status(200).json({
      success: true,
      message: "cart created successfully!",
      data: newCart,
    });
  } catch (error) {
    console.log("issue while creating cart =>", error.message);
    return res
      .status(500)
      .json({ success: false, message: "issue while creating cart" });
  }
};
exports.deleteCart = async (req, res) => {
  try {
    // const { user } = req.body;
    const user = req.user._id;

    const existcart = await Cart.findOne({ user: user });
    if (!existcart) {
      return res.status(400).json({
        success: false,
        message: "Cart is already deleted or does not exist",
      });
    }

    const productslinktocart = await CartProductLink.find({
      cart: existcart._id,
    });

    for (let x of productslinktocart) {
      await CartProductLink.findByIdAndDelete(x._id);
    }

    await existcart.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Cart and its linked products deleted successfully",
    });
  } catch (error) {
    console.log("Issue while deleting cart =>", error.message);
    return res.status(500).json({
      success: false,
      message: "Issue while deleting cart",
      data: error.message,
    });
  }
};

exports.addProductInTheCart = async (req, res) => {
  try {
    const user = req.user._id;
    const { product_id, quantity } = req.body;
    if (!product_id || !quantity > 0) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const cart = await Cart.findOne({ user: user });
    if (!cart) {
      return res.status(400).json({
        success: false,
        message:
          "cart is not their for this user please create a cart for this ",
      });
    }
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "product not found by this product id",
      });
    }
    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "we don't have that much stock for this product",
      });
    }
    const existincart = await CartProductLink.findOne({
      cart: cart._id,
      product: product_id,
    });
    if (existincart) {
      cart.totalItems -= existincart.quantity;
      cart.totalItems += quantity;
      cart.totalPrice -= existincart.quantity * product.price;
      cart.totalPrice += quantity * product.price;
      existincart.quantity = quantity;
      await existincart.save();
      await cart.save();
    } else {
      const cartproductlink = await CartProductLink.create({
        cart: cart._id,
        product: product_id,
        quantity: quantity,
      });
      cart.totalItems += quantity;
      cart.totalPrice += quantity * product.price;
      await cart.save();
    }
    return res
      .status(200)
      .json({ success: true, message: "product added successfully" });
  } catch (error) {
    console.log("issue while add product in the cart => ", error.message);
    return res.status(500).json({
      success: false,
      message: "issue while add product in the cart ",
      data: error.message,
    });
  }
};

exports.deleteProductFromTheCart = async (req, res) => {
  try {
    const user = req.user._id;
    const { product_id } = req.body;

    if (!product_id || !user) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const cart = await Cart.findOne({ user });
    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "Cart not found for this user",
      });
    }

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found for this product id",
      });
    }

    const existproductincart = await CartProductLink.findOne({
      cart: cart._id,
      product: product_id,
    });

    if (!existproductincart) {
      return res.status(400).json({
        success: false,
        message: "Product not in the cart",
      });
    }

    if (existproductincart.quantity > 1) {
      existproductincart.quantity -= 1;
      await existproductincart.save();
    } else {
      await existproductincart.deleteOne();
    }

    cart.totalItems = Math.max(0, cart.totalItems - 1);
    cart.totalPrice = Math.max(0, cart.totalPrice - product.price);

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully from the cart",
    });
  } catch (error) {
    console.log(
      "Issue while deleting the product from the cart =>",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Issue while deleting the product from the cart",
      data: error.message,
    });
  }
};

exports.cartdetail = async (req, res) => {
  try {
    const user = req.user;
    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return res.status(400).json({
        success: false,
        message:
          "cart is not present for this user so please create cart for this user",
      });
    }
    const a = {};
    const cartproducts = await CartProductLink.find({ cart: cart._id });

    for (let product of cartproducts) {
      const p = await Product.findById(product.product);
      if (!p) {
        product.deleteOne();
      }
    }
    a = {
      cart: cart,
      products: cartproducts,
    };
    return res.status(200).json({
      success: true,
      message: "cart detail fetched successfully!",
      data: a,
    });
  } catch (error) {
    console.log("issue while fetching  cart detail :- ", error.message);
    return res.status(500).json({
      succcess: false,
      message: "issue while fetching cart detail",
      data: error.message,
    });
  }
};
