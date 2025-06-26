// models/StockOut.js
import mongoose from "mongoose";

const stockOutSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  purpose: {
    type: String,
    enum: ["Sale", "Demo"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  returnDate: {
    type: Date,
  },
  reason: {
    type: String,
  },
  tenderNo: {
    type: String,
  },
  returnDate: {
    type: Date,
  },
  returnProcessed: {
    type: Boolean,
    default: false,
  },
});

const StockOut = mongoose.model("StockOut", stockOutSchema);
export default StockOut;
