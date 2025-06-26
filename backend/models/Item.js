// models/Item.js
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  modelNo: { type: String, required: true },
  companyName: { type: String, required: true },
  minStockAlert: { type: Number, default: 0 },
});

// 🚫 Ensure no duplicate modelNo per company
itemSchema.index({ modelNo: 1, companyName: 1 }, { unique: true });

const Item = mongoose.model("Item", itemSchema);
export default Item;
