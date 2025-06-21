// backend/models/DeliveryChallan.js
import mongoose from "mongoose";

const deliveryChallanSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  items: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
      quantity: Number,
    },
  ],
  transportDetails: String,
  date: { type: Date, default: Date.now },
});

const DeliveryChallan = mongoose.model(
  "DeliveryChallan",
  deliveryChallanSchema
);
export default DeliveryChallan;
