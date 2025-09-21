const express = require("express");
const Tenant = require("../models/Tenant");
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

// Lấy danh sách tenants
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tenants = await Tenant.find();
    res.json(tenants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tạo tenant mới
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newTenant = new Tenant(req.body);
    await newTenant.save();
    res.json(newTenant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cập nhật tenant
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedTenant = await Tenant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedTenant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Xóa tenant
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Tenant.findByIdAndDelete(req.params.id);
    res.json({ message: "Tenant deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
