const express = require("express");
const Driver = require("../models/Driver");
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

// Lấy danh sách driver
router.get("/", authMiddleware, async (req, res) => {
  try {
    const drivers = await Driver.find().populate("user_id");
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tạo driver mới
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newDriver = new Driver(req.body);
    await newDriver.save();
    res.json(newDriver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cập nhật driver
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedDriver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedDriver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Xóa driver
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.json({ message: "Driver deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
