const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  license_number: { type: String, required: true },
  vehicle_info: { type: String },
  status: { type: String, enum: ["active", "inactive", "suspended"], default: "active" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Driver", driverSchema);
