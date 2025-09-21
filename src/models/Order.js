const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  driver_id: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
  tenant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
  pickup_location: { type: String, required: true },
  dropoff_location: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["pending", "accepted", "in_transit", "delivered", "cancelled"], 
    default: "pending" 
  },
  total_price: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
