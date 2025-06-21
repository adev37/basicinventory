// backend/controllers/deliveryChallanController.js

import DeliveryChallan from "../models/DeliveryChallan.js";
import { decreaseStock } from "./stockController.js"; // ✅

export const createChallan = async (req, res) => {
  try {
    const { clientName, items, transportDetails } = req.body;

    const dc = await DeliveryChallan.create({
      clientName,
      items,
      transportDetails,
    });

    // ✅ Decrease stock for each item in the challan
    for (let i of items) {
      await decreaseStock(i.item, i.quantity);
    }

    res.status(201).json({
      message: "✅ Delivery Challan created and stock updated.",
      challan: dc,
    });
  } catch (err) {
    console.error("❌ Error in createChallan:", err);
    res
      .status(500)
      .json({ message: "Failed to create DC", error: err.message });
  }
};

export const getChallans = async (req, res) => {
  try {
    const data = await DeliveryChallan.find().populate("items.item");
    res.json(data);
  } catch (err) {
    console.error("❌ Error in getChallans:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch DCs", error: err.message });
  }
};
