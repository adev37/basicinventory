// controllers/purchaseReturnController.js
import PurchaseReturn from "../models/PurchaseReturn.js";
import GoodsReceipt from "../models/GoodsReceipt.js";
import { decreaseStock } from "./stockController.js";

export const createPurchaseReturn = async (req, res) => {
  try {
    const { grn, returnedItems, remarks, createdBy } = req.body;

    const grnDoc = await GoodsReceipt.findById(grn).populate(
      "receivedItems.item"
    );

    if (!grnDoc) return res.status(404).json({ message: "GRN not found" });

    const grnItemsMap = {};
    for (const ri of grnDoc.receivedItems) {
      grnItemsMap[ri.item._id.toString()] = ri.receivedQty;
    }

    // Validate and update stock
    for (const ret of returnedItems) {
      const itemId = ret.item;
      const qty = parseInt(ret.returnQty);

      if (!grnItemsMap[itemId])
        return res.status(400).json({ message: `Item ${itemId} not in GRN` });

      if (qty > grnItemsMap[itemId])
        return res.status(400).json({
          message: `Returned qty ${qty} exceeds received for item ${itemId}`,
        });

      await decreaseStock(itemId, qty); // Custom function to reduce stock
    }

    const purchaseReturn = new PurchaseReturn({
      grn,
      returnedItems,
      remarks,
      createdBy,
    });

    await purchaseReturn.save();

    return res.status(201).json({
      message: "✅ Purchase Return recorded successfully.",
      purchaseReturn,
    });
  } catch (err) {
    console.error("❌ Error in createPurchaseReturn:", err);
    return res.status(500).json({
      message: "Failed to process return",
      error: err.message,
    });
  }
};

export const getAllReturns = async (req, res) => {
  try {
    const returns = await PurchaseReturn.find()
      .populate({
        path: "grn",
        populate: {
          path: "purchaseOrder",
          populate: {
            path: "vendor",
            select: "name",
          },
        },
      })
      .populate("returnedItems.item", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(returns);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch returns",
      error: err.message,
    });
  }
};
