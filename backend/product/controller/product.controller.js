const Product = require("../models/product.model");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../../utils/cloudinary/cloudinary.utils");
const OrderProduct = require("../../order/models/orderproductlink");
const Order = require("../../order/models/order.model");

exports.createProduct = async (req, res) => {
  try {
    const { name, type, price, quantity, description } = req.body;
    const image = req.files?.productimage;
    const owner = req.user._id;

    if (
      !name ||
      !type ||
      !price ||
      !owner ||
      !quantity ||
      !image ||
      !description
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingproduct = await Product.findOne({ owner, name });
    if (existingproduct) {
      return res.status(400).json({
        success: false,
        message: "Product already exists with this name",
      });
    }

    const imageUrl = await uploadToCloudinary(image);
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Issue uploading image to Cloudinary",
      });
    }

    const product = await Product.create({
      name,
      type,
      price,
      owner,
      image: imageUrl.secure_url,
      image_publicId: imageUrl.public_id,
      quantity,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Issue while creating product",
      data: error.message,
    });
  }
};

exports.deleteProducct = async (req, res) => {
  try {
    const { product_id } = req.params;

    const product = await Product.findById(product_id);
    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "Product not found" });
    }

    const existingOrders = await OrderProduct.find({ product: product_id });
    if (existingOrders.length > 0) {
      for (let exist of existingOrders) {
        const order = await Order.findById(exist.order);
        if (order) {
          console.log();
          if (order.deliverStatus === "processing") {
            return res.status(400).json({
              success: false,
              message: "There is an ongoing order for this product",
            });
          }
        }
      }
    }

    if (product.image_publicId) {
      await deleteFromCloudinary(product.image_publicId);
    } else {
      console.log("No image_publicId found in product");
    }

    await product.deleteOne();

    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Issue while deleting the product",
      data: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, type, price, quantity, description } = req.body;
    const { product_id } = req.params;
    const owner = req.user._id;
    const image = req.files?.productimage;

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "No product found with given product_id",
      });
    }

    if (image) {
      const prevorders = await OrderProduct.find({ image: product.image });
      if (prevorders.length === 0 && product.image_publicId) {
        await deleteFromCloudinary(product.image_publicId);
      }

      const uploadedImage = await uploadToCloudinary(image);
      if (!uploadedImage) {
        return res.status(400).json({
          success: false,
          message: "Image upload failed",
        });
      }

      product.image = uploadedImage.secure_url;
      product.image_publicId = uploadedImage.public_id;
    }

    product.name = name;
    product.type = type;
    product.price = price;
    product.quantity = quantity;
    product.owner = owner;
    product.description = description;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Issue while updating product",
      data: error.message,
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json({
      success: true,
      message: "all products are fetched successfully",
      data: products,
    });
  } catch (error) {
    console.log("issue while fetching all products => ", error.message);
    return res
      .status(500)
      .json({ success: false, message: "issue while fetching all products" });
  }
};

exports.getProductBasedOnType = async (req, res) => {
  try {
    const { type } = req.params;
    if (!type) {
      return res
        .status(400)
        .json({ success: false, message: "type is required in params" });
    }
    const products = await Product.find({ type: type });
    return res.status(200).json({
      success: true,
      message: "fetched all topic wise products",
      data: products,
    });
  } catch (error) {
    console.log(
      "issue while fetching products based on perticuler topic => ",
      error.message
    );
  }
};
