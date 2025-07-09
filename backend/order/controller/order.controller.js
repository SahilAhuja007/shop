const Order = require("../models/order.model");
const OrderProduct = require("../models/orderproductlink");
const Product = require("../../product/models/product.model");

exports.createorder = async (req, res) => {
  try {
    const user = req.user._id;
    const {
      totalprice,
      status,
      totalItems,
      deliveredAt,
      street,
      city,
      state,
      pincode,
      country,
      method,
      order_id,
      payment_id,
      signature,
      paidAt,
      paymentStatus,
      deliverStatus,
      products,
    } = req.body;
    if (
      !totalprice ||
      !totalItems ||
      !status ||
      !deliveredAt ||
      !street ||
      !city ||
      !state ||
      !pincode ||
      !country ||
      !paymentStatus ||
      !method ||
      !order_id ||
      !payment_id ||
      !signature ||
      !paidAt ||
      !deliverStatus ||
      !products
    ) {
      return res
        .status(400)
        .json({ success: false, message: "all fields are required" });
    }

    const existingOrder = await Order.findOne({
      user: user,
      paymentInfo: { payment_id: payment_id },
    });

    if (existingOrder) {
      return res
        .status(400)
        .json({ success: false, message: "order done previouly" });
    }
    const neworder = await Order.create({
      user: user,
      totalprice: totalprice,
      totalItems: totalItems,
      status: status,
      deliveredAt: deliveredAt,
      address: {
        street: street,
        city: city,
        state: state,
        pincode: pincode,
        country: country,
      },
      paymentStatus: paymentStatus,
      paymentInfo: {
        method: method,
        order_id: order_id,
        payment_id: payment_id,
        signature: signature,
        deliverStatus: deliverStatus,
      },
    });
    const orderProductlink = await Promise.all(
      products.map(async (pro) => {
        const product = await Product.findById(pro.id);
        if (!product) {
          return res.status(400).json({
            success: false,
            message: `product not found by this id :- ${pro}`,
          });
        }
        if (pro.quantity > product.quantity) {
          return res.status(400).json({
            success: false,
            message: `product with id ${pro.id} have ${product.quantity} and u r asking for ${pro.quantity}`,
          });
        }
        const existingorderproductlink = await OrderProduct.findOne({
          order: neworder._id,
          product: product._id,
        });

        if (existingorderproductlink) {
          return res.status(400).json({
            success: false,
            message: "product alerady linked with order",
          });
        }
        const orderprodctlink = await OrderProduct.create({
          order: neworder._id,
          product: product._id,
          name: product.name,
          image: product.image,
          type: product.type,
          quantity: pro.quantity,
          price: product.price,
        });

        product.quantity -= pro.quantity;
        await product.save();
      })
    );

    return res.status(200).json({
      success: true,
      message: "order created with linking with product succcessfully !",
      order: neworder,
    });
  } catch (error) {
    console.log("issue while creating order => ", error.message);
    return res.status(500).json({
      success: false,
      message: "issue while creating order",
      data: error.message,
    });
  }
};

exports.updateorderstatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;
    if (!order_id || !status) {
      return res
        .status(400)
        .json({ success: false, message: "order_id is required" });
    }
    const order = await Order.findById(order_id);
    if (!order) {
      return res
        .status(400)
        .json({ success: false, message: "order is not found by this id " });
    }
    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "order updated successfull!",
      data: order,
    });
  } catch (error) {
    console.log("issue while updatingorder :- ", error.message);
    return res.status(500).json({
      success: false,
      message: "issue while updating order :- ",
      data: error.message,
    });
  }
};

exports.updateorderdeliverystatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { deliverStatus } = req.body;
    if (!order_id || !deliverystatus) {
      return res
        .status(400)
        .json({ success: false, message: "order_id is required" });
    }
    const order = await Order.findById(order_id);
    if (!order) {
      return res
        .status(400)
        .json({ success: false, message: "order is not found by this id " });
    }
    if (order.deliverStatus === "accepted") {
      order.deliverStatus = deliverStatus;
      await order.save();
    } else {
      return res.status(400).json({
        success: false,
        message: "first change the status and accept it ",
      });
    }

    return res.status(200).json({
      success: true,
      message: "order updated successfull!",
      data: order,
    });
  } catch (error) {
    console.log("issue while updatingorder :- ", error.message);
    return res.status(500).json({
      success: false,
      message: "issue while updating order :- ",
      data: error.message,
    });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const user = req.user;
    const { order_id } = req.params;
    const order = await Order.findById(order_id);
    if (!order) {
      return res
        .status(400)
        .json({ success: false, message: "order not exist" });
    }
    const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

    if (user.role === "admin" || user.role === "vendor") {
      (order.iscannecelled = "yes"), (order.whocancelled = user._id);
      await order.save();
      return res
        .status(200)
        .json({ success: true, message: "order cancelled succfully" });
    }
    if (Date.now() - new Date(order.createdAt).getTime() > THREE_DAYS_MS) {
      return res.status(400).json({
        success: false,
        message: "order is unable cancelled after 3 days",
      });
    }

    if (order.deliverStatus === "processing") {
      order.iscannecelled = "yes";
      order.whocancelled = user._id;
      await order.save();
      return res
        .status(200)
        .json({ success: true, message: "order cancelled succfully" });
    } else {
      return res.status(400).json({
        success: false,
        message: `order unable to cancelled bcz order is now ${order.deliverStatus}`,
      });
    }
  } catch (error) {
    console.log("issue while cancelling order :- ", error.message);
    return res.status(500).json({
      success: false,
      message: "issue while cancelling order ",
      data: error.message,
    });
  }
};

exports.getordersrejecteduser = async (req, res) => {
  try {
    const user = req.user;
    const rejectedorders = await Order.find({
      user: user._id,
      status: "rejected",
    });
    let a = [];
    for (let rejected of rejectedorders) {
      const prodoucts = await OrderProduct.find({ order: rejected._id });
      a.push({
        order: rejected,
        products: prodoucts,
      });
    }
    return res.status(200).json({
      success: true,
      message: "user rejected orders are fetched successfully!",
      data: a,
    });
  } catch (error) {
    console.log("issue while fetching user rejected orders :- ", error.message);
    return res.status(500).json({
      success: false,
      messsage: "issue while fetching user rejected orders",
      data: error.message,
    });
  }
};

exports.getorderscompleteduser = async (req, res) => {
  try {
    const user = req.user;
    const completedorders = await Order.find({
      user: user._id,
      status: "accepted",
    });
    let a = [];
    for (let completed of completedorders) {
      const prodoucts = await OrderProduct.find({ order: completed._id });
      a.push({
        order: completed,
        products: prodoucts,
      });
    }
    return res.status(200).json({
      success: true,
      message: "user completed orders are fetched successfully!",
      data: a,
    });
  } catch (error) {
    console.log(
      "issue while fetching user completed orders :- ",
      error.message
    );
    return res.status(500).json({
      success: false,
      messsage: "issue while fetching user completed orders",
      data: error.message,
    });
  }
};
exports.getorderspendinguser = async (req, res) => {
  try {
    const user = req.user;
    const pendingorders = await Order.find({
      user: user._id,
      status: "pending",
    });
    let a = [];
    for (let pending of pendingorders) {
      const prodoucts = await OrderProduct.find({ order: pending._id });
      a.push({
        order: pending,
        products: prodoucts,
      });
    }
    return res.status(200).json({
      success: true,
      message: "user pending orders are fetched successfully!",
      data: a,
    });
  } catch (error) {
    console.log("issue while fetching user pending orders :- ", error.message);
    return res.status(500).json({
      success: false,
      messsage: "issue while fetching user pending orders",
      data: error.message,
    });
  }
};

exports.getorderscompleted = async (req, res) => {
  try {
    const ordercompleted = await Order.find({ status: "accepted" });
    let a = [];
    for (let c of ordercompleted) {
      const prodoucts = await OrderProduct.find({ order: c._id });
      a.push({
        order: c,
        products: prodoucts,
      });
    }
    return res.status(200).json({
      success: true,
      message: "completed orders fetched successfuly!",
      data: a,
    });
  } catch (error) {
    console.log("issue while completed order fetching :-", error.message);
    return res.status(500).json({
      success: false,
      message: "issue while completed order fetching",
      data: error.message,
    });
  }
};

exports.getordersrejected = async (req, res) => {
  try {
    const orderrejected = await Order.find({ status: "rejected" });
    let a = [];
    for (let r of orderrejected) {
      const prodoucts = await OrderProduct.find({ order: r._id });
      a.push({
        order: r,
        products: prodoucts,
      });
    }
    return res.status(200).json({
      success: true,
      message: "rejected orders fetched successfuly!",
      data: a,
    });
  } catch (error) {
    console.log("issue while rejected order fetching :-", error.message);
    return res.status(500).json({
      success: false,
      message: "issue while rejected order fetching",
      data: error.message,
    });
  }
};

exports.getorderspending = async (req, res) => {
  try {
    const orderpending = await Order.find({ status: "pending" });
    let a = [];
    for (let p of orderpending) {
      const prodoucts = await OrderProduct.find({ order: p._id });
      a.push({
        order: p,
        products: prodoucts,
      });
    }
    return res.status(200).json({
      success: true,
      message: "pending orders fetched successfuly!",
      data: orderrejected,
    });
  } catch (error) {
    console.log("issue while pending order fetching :-", error.message);
    return res.status(500).json({
      success: false,
      message: "issue while pending order fetching",
      data: error.message,
    });
  }
};
