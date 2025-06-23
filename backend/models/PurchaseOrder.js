import mongoose from "mongoose";

const PurchaseOrderSchema = new mongoose.Schema({
  poNumber: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  items: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
      },
      quantity: Number,
      rate: Number,
      gst: Number,
      total: Number,
    },
  ],
  deliveryDate: Date,
  status: {
    type: String,
    enum: ["Pending", "Partially Received", "Received", "Cancelled"],
    default: "Pending",
  },
  remarks: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  source: {
    type: {
      type: String,
    },
    refId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "source.type",
    },
  },
});

const PurchaseOrder = mongoose.model("PurchaseOrder", PurchaseOrderSchema);
export default PurchaseOrder;
