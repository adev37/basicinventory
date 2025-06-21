// models/GoodsReceipt.js
import mongoose from "mongoose";

const goodsReceiptSchema = new mongoose.Schema(
  {
    purchaseOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PurchaseOrder",
      required: true,
    },
    receivedItems: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
          required: true,
        },
        receivedQty: { type: Number, required: true, min: 0 },
      },
    ],
    remarks: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const GoodsReceipt = mongoose.model("GoodsReceipt", goodsReceiptSchema);
export default GoodsReceipt;
