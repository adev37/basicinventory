import DeliveryChallan from "../models/DeliveryChallan.js";
import SalesOrder from "../models/SalesOrder.js";
import { decreaseStock } from "./stockController.js";

// @desc    Create Delivery Challan from a Sales Order
// @route   POST /api/delivery-challans
// @access  Private
export const createChallan = async (req, res) => {
  try {
    const { salesOrderId, items, transportDetails } = req.body;

    const salesOrder = await SalesOrder.findById(salesOrderId);
    if (!salesOrder) {
      return res.status(404).json({ message: "Sales Order not found" });
    }

    // ✅ Create Delivery Challan
    const challan = await DeliveryChallan.create({
      salesOrder: salesOrder._id,
      client: salesOrder.client,
      items,
      transportDetails,
    });

    // ✅ Decrease stock
    for (let i of items) {
      await decreaseStock(i.item, i.quantity);
    }

    // ✅ Update delivered quantities in Sales Order
    let fullyDelivered = true;
    for (let dcItem of items) {
      const soItem = salesOrder.items.find(
        (i) => i.item.toString() === dcItem.item
      );
      if (soItem) {
        soItem.delivered = (soItem.delivered || 0) + dcItem.quantity;

        // Check if this item is still pending
        if (soItem.delivered < soItem.quantity) {
          fullyDelivered = false;
        }
      }
    }

    // ✅ Set Sales Order status
    if (fullyDelivered) {
      salesOrder.status = "Confirmed"; // Only now it's valid due to schema fix
    } else {
      salesOrder.status = "Partially Delivered";
    }

    await salesOrder.save();

    res.status(201).json({
      message: "✅ Delivery Challan created, stock updated, SO updated.",
      challan,
    });
  } catch (err) {
    console.error("❌ Error in createChallan:", err);
    res.status(500).json({
      message: "Failed to create Delivery Challan",
      error: err.message,
    });
  }
};

// @desc    Get all Delivery Challans
// @route   GET /api/delivery-challans
// @access  Private
export const getChallans = async (req, res) => {
  try {
    const data = await DeliveryChallan.find()
      .populate("items.item")
      .populate("client");
    res.json(data);
  } catch (err) {
    console.error("❌ Error in getChallans:", err);
    res.status(500).json({
      message: "Failed to fetch DCs",
      error: err.message,
    });
  }
};
