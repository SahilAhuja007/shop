const User = require("../../models/user.model");
const Cart = require("../../../cart/models/cart.model");
exports.isFirstLogin = async (req, res) => {
  try {
    const user = req.user;

    const existingUser = await User.findOne({ email: user.email });

    if (existingUser) {
      if (existingUser.role !== "user") {
        return res.status(403).json({
          success: false,
          message: `Access denied for role '${existingUser.role}'. Only 'user' role allowed.`,
        });
      }

      return res.status(200).json({
        success: true,
        isFirstLogin: false,
      });
    }

    return res.status(200).json({
      success: true,
      isFirstLogin: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Issue while checking isFirstLogin",
      data: error.message,
    });
  }
};

exports.ApplicationForm = async (req, res) => {
  try {
    const user = req.user;
    console.log("user:- ", user);
    const { phone_number, role } = req.body;
    console.log("req.body", req.body);
    if (!phone_number || !phone_number.trim() || !role || !role.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if (role !== "user") {
      return res.status(403).json({
        success: false,
        message:
          "Invalid role. Only 'user' registration is allowed from this form.",
      });
    }

    const existinguser = await User.findOne({
      $or: [{ email: user.email }, { phone: phone_number }],
    });

    console.log("existinguser:- ", existinguser);
    if (existinguser) {
      const existingcart = await Cart.findOne({ user: existinguser._id });
      if (!existingcart) {
        const newcart = await Cart.create({
          user: existinguser._id,
          totalPrice: 0,
          totalItemCount: 0,
          totalItems: 0,
        });
        if (!newcart) {
          return res.status(400).json({
            success: false,
            message: "there is an issue while creating a cart by existing user",
          });
        }
      }
      return res.status(400).json({
        success: false,
        message: "Account already exists. Try a different email or number.",
      });
    }

    const new_user = await User.create({
      name: user.name,
      email: user.email,
      role,
      phone: phone_number,
      googleId: user.uid,
    });

    const newCart = await Cart.create({
      user: new_user._id,
      totalPrice: 0,
      totalItems: 0,
    });

    if (!newCart) {
      return res
        .status(400)
        .json({ success: false, message: "issue while creating new cart" });
    }

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: new_user,
    });
  } catch (error) {
    console.log("Issue while submitting application form", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.whattypeofuseritis = async (req, res) => {
  try {
    const user = req.user;
    const exist = await User.findOne({ email: user.email });
    if (exist) {
      const role = exist.role;
      return res.status(200).json({
        success: true,
        message: `current user is ${role}`,
        data: role,
      });
    }
    return res.status(400).json({ success: false, message: "login first" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "there was issue while finding what type of user it is",
    });
  }
};
