const express = require("express");
const orderRouter = express.Router();
const {
  verifyToken,
  authorization,
  adminvendorAccess,
} = require("../../middleware/verifyToken");
const {
  createorder,
  updateorderstatus,
  updateorderdeliverystatus,
  cancelOrder,
  getorderspendinguser,
  getorderscompleteduser,
  getordersrejecteduser,
  getorderspending,
  getorderscompleted,
  getordersrejected,
} = require("../controller/order.controller");

orderRouter.post("/create", verifyToken, authorization("user"), createorder);
orderRouter.put(
  "/updatestatus/:order_id",
  verifyToken,
  adminvendorAccess("orders management"),
  updateorderstatus
);
orderRouter.put(
  "/updatedeliverystatus/:order_id",
  verifyToken,
  adminvendorAccess("orders management"),
  updateorderdeliverystatus
);
orderRouter.delete(
  "/deleteorder/:order_id",
  verifyToken,
  authorization("admin", "vendor", "user"),
  cancelOrder
);

orderRouter.get(
  "/pendingorderuser",
  verifyToken,
  authorization("user"),
  getorderspendinguser
);

orderRouter.get(
  "/completedorderuser",
  verifyToken,
  authorization("user"),
  getorderscompleteduser
);

orderRouter.get(
  "/rejectedorderuser",
  verifyToken,
  authorization("user"),
  getordersrejecteduser
);

orderRouter.get(
  "/pendingorder",
  verifyToken,
  adminvendorAccess("orders management"),
  getorderspending
);
orderRouter.get(
  "/comletedorder",
  verifyToken,
  adminvendorAccess("orders management"),
  getorderscompleted
);

orderRouter.get(
  "/rejectedorder",
  verifyToken,
  adminvendorAccess("orders management"),
  getordersrejected
);
module.exports = orderRouter;
