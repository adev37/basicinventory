import StockTransfer from "../models/StockTransfer.js";
import StockLedger from "../models/StockLedger.js";

// ✅ CREATE STOCK TRANSFER with quantity check and action field
// controllers/stockTransferController.js

export const createStockTransfer = async (req, res) => {
  try {
    const { item, quantity, fromWarehouse, toWarehouse, note } = req.body;

    if (fromWarehouse === toWarehouse) {
      return res
        .status(400)
        .json({ message: "Source and destination warehouses must differ." });
    }

    // Check available stock in source warehouse
    const ledgerEntries = await StockLedger.find({
      item,
      warehouse: fromWarehouse,
    });
    const available = ledgerEntries.reduce((sum, e) => sum + e.quantity, 0);

    if (available < quantity) {
      return res.status(400).json({
        message: `Insufficient stock. Available: ${available}`,
      });
    }

    // 1. Log OUT entry in StockLedger
    await StockLedger.create({
      item,
      warehouse: fromWarehouse,
      quantity: -Math.abs(quantity),
      action: "OUT",
      type: "Transfer Out",
      purpose: null,
      remarks: note,
      date: new Date(),
    });

    // 2. Log IN entry in StockLedger
    await StockLedger.create({
      item,
      warehouse: toWarehouse,
      quantity: Math.abs(quantity),
      action: "IN",
      type: "Transfer In",
      purpose: null,
      remarks: note,
      date: new Date(),
    });

    // 3. Save to StockTransfer log
    const transfer = await StockTransfer.create({
      item,
      quantity,
      fromWarehouse,
      toWarehouse,
      note,
      transferDate: new Date(),
    });

    res.status(201).json({
      message: "✅ Stock transferred successfully.",
      transfer,
    });
  } catch (error) {
    console.error("❌ Error in createStockTransfer:", error);
    res.status(500).json({ message: "Stock transfer failed" });
  }
};

// ✅ GET ALL TRANSFERS
export const getAllTransfers = async (req, res) => {
  try {
    const transfers = await StockTransfer.find()
      .populate("item", "name modelNo")
      .populate("fromWarehouse", "name")
      .populate("toWarehouse", "name")
      .sort({ createdAt: -1 });

    res.json(transfers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transfers" });
  }
};
