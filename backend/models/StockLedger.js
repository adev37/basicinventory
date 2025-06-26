// models/StockLedger.js
import mongoose from "mongoose";

const stockLedgerSchema = new mongoose.Schema(
  {
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
    action: {
      type: String,
      enum: ["IN", "OUT"],
      required: true,
    },
    purpose: {
      type: String, // Sale, Demo, Receiving
    },
    returnDate: {
      type: Date, // Expected return date (only when OUT for Demo)
    },
    returned: {
      type: Boolean,
      default: false,
    },
    reason: {
      type: String,
    },
    remarks: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const StockLedger = mongoose.model("StockLedger", stockLedgerSchema);
export default StockLedger;
