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
    type: {
      type: String,
      enum: [
        "In",
        "Out",
        "Transfer In",
        "Transfer Out",
        "Return In",
        "Return Out",
      ],
      required: true,
    },
    purpose: {
      type: String,
      enum: ["Sale", "Demo", "Demo Return"],
      default: null,
    },
    returned: {
      type: Boolean,
      default: null, // Used for Demo Out entries
    },
    returnDate: {
      type: Date, // Expected return date for Demo
    },
    date: {
      type: Date,
      default: Date.now,
    },
    remarks: {
      type: String,
    },

    // ✅ NEW: Link return record to original OUT record
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StockLedger",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.StockLedger ||
  mongoose.model("StockLedger", stockLedgerSchema);
