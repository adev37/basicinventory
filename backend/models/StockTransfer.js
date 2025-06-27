import mongoose from "mongoose";

const stockTransferSchema = new mongoose.Schema(
  {
    fromWarehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    toWarehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    transferDate: {
      type: Date,
      default: Date.now,
    },
    note: String,
  },
  { timestamps: true }
);

// ✅ Safe export to prevent OverwriteModelError
export default mongoose.models.StockTransfer ||
  mongoose.model("StockTransfer", stockTransferSchema);
