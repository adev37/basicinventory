// backend/models/Stock.js
import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  lastUpdatedBy: {
    type: String,
    default: "System",
  },
  remarks: {
    type: String,
    default: "",
  },
});

const Stock = mongoose.model("Stock", stockSchema);

export default Stock;
