// backend/models/SalesOrder.js
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  rate: {
    type: Number,
    required: true,
    min: 0,
  },
  gst: {
    type: Number,
    required: true,
    min: 0,
  },
  delivered: {
    type: Number,
    default: 0,
  },
});

const salesOrderSchema = new mongoose.Schema(
  {
    soNumber: {
      type: String,
      required: true,
    },
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    items: [itemSchema],
    deliveryDate: {
      type: Date,
      required: true,
    },
    remarks: String,
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Partially Delivered", "Completed", "Confirmed"], // ✅ Fixed here
      default: "Pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const SalesOrder = mongoose.model("SalesOrder", salesOrderSchema);
export default SalesOrder;
