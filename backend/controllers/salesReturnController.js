// === File: backend/controllers/salesReturnController.js ===
import SalesReturn from "../models/SalesReturn.js";
import SalesInvoice from "../models/SalesInvoice.js";
import StockLedger from "../models/StockLedger.js";
import { increaseStock } from "../controllers/stockController.js";

export const createSalesReturn = async (req, res) => {
  try {
    const { referenceInvoiceId, items, reason } = req.body;

    // Step 1: Fetch original invoice
    const invoice = await SalesInvoice.findById(referenceInvoiceId);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    // Step 2: Fetch existing returns for this invoice
    const pastReturns = await SalesReturn.find({
      referenceId: referenceInvoiceId,
    });

    // Step 3: Build item-level return quantity tracker
    const returnedQtyMap = {};
    for (const r of pastReturns) {
      for (const i of r.items) {
        returnedQtyMap[i.item] = (returnedQtyMap[i.item] || 0) + i.quantity;
      }
    }

    // Step 4: Validate
    for (const { item, quantity } of items) {
      const sold = invoice.items.find((i) => i.item.toString() === item);
      if (!sold) {
        return res
          .status(400)
          .json({ message: `Item ${item} not found in invoice` });
      }

      const alreadyReturned = returnedQtyMap[item] || 0;
      const remaining = sold.quantity - alreadyReturned;

      if (quantity > remaining) {
        return res.status(400).json({
          message: `Cannot return ${quantity} of item ${item} — only ${remaining} left to return`,
        });
      }
    }

    // Step 5: Proceed with stock increase + ledger logging
    const salesReturn = await SalesReturn.create({
      referenceId: referenceInvoiceId,
      items,
      reason,
      createdBy: req.user._id,
    });

    for (const { item, quantity } of items) {
      await increaseStock(item, quantity);

      await StockLedger.create({
        item,
        transactionType: "RETURN",
        quantity,
        source: "SalesReturn",
        sourceId: salesReturn._id,
        timestamp: new Date(),
      });
    }

    res.status(201).json({
      message: "✅ Sales Return recorded and stock updated",
      salesReturn,
    });
  } catch (err) {
    console.error("❌ Error in createSalesReturn:", err);
    res.status(500).json({
      message: "Failed to create Sales Return",
      error: err.message,
    });
  }
};

// controllers/salesReturnController.js
export const getSalesReturns = async (req, res) => {
  try {
    const returns = await SalesReturn.find()
      .populate({
        path: "referenceId",
        select: "invoiceNumber client",
        populate: {
          path: "client",
          model: "Client", // ✅ explicitly tell Mongoose it's the Client model
          select: "companyName",
        },
      })
      .populate("items.item", "name")
      .sort({ createdAt: -1 });

    res.json(returns);
  } catch (err) {
    console.error("❌ Error in getSalesReturns:", err);
    res.status(500).json({
      message: "Failed to fetch Sales Returns",
      error: err.message,
    });
  }
};
