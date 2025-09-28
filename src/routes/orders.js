const express = require("express");
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");

const router = express.Router();

// 📌 Middleware xác thực JWT
function authMiddleware(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = user;
    next();
  });
}

// 📌 Lấy danh sách tất cả đơn hàng
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer_id", "name email")
      .populate("driver_id", "name phone")
      .populate("tenant_id", "name company");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Lấy chi tiết 1 đơn hàng theo ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer_id", "name email")
      .populate("driver_id", "name phone")
      .populate("tenant_id", "name company");

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Tạo đơn hàng mới
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { customer_id, driver_id, tenant_id, pickup_location, dropoff_location, total_price } = req.body;

    if (!customer_id || !pickup_location || !dropoff_location) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newOrder = new Order({
      customer_id,
      driver_id,
      tenant_id,
      pickup_location,
      dropoff_location,
      total_price,
      status: "pending"
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Cập nhật đơn hàng
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ error: "Order not found" });

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Xóa đơn hàng
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) return res.status(404).json({ error: "Order not found" });

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
