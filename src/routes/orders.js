const express = require("express");
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware xác thực JWT
function authMiddleware(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = user;
    next();
  });
}

// Lấy danh sách đơn hàng
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer_id driver_id tenant_id");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tạo đơn hàng mới
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { customer_id, driver_id, tenant_id, pickup_location, dropoff_location, total_price } = req.body;
    const newOrder = new Order({
      customer_id,
      driver_id,
      tenant_id,
      pickup_location,
      dropoff_location,
      total_price
    });
    await newOrder.save();
    res.json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cập nhật đơn hàng
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Xóa đơn hàng
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
