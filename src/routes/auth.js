const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// 📌 Đăng ký
router.post("/register", async (req, res) => {
  try {
    console.log("📩 Body nhận được:", req.body);

    const { name, email, password, role } = req.body;

    // Kiểm tra input
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }

    // Kiểm tra email tồn tại chưa
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    // Tạo token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "✅ User registered successfully",
      user,
      token
    });
  } catch (err) {
    console.error("❌ Register error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 📌 Đăng nhập
router.post("/login", async (req, res) => {
  try {
    console.log("📩 Body nhận được (login):", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "✅ Login successful", user, token });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
