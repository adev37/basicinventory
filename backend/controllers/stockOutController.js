// controllers/stockOutController.js
import StockOut from "../models/StockOut.js";
import StockLedger from "../models/StockLedger.js";
import StockIn from "../models/StockIn.js"; // Only if needed for full trace

// ➕ Create new Stock Out entry
export const createStockOut = async (req, res) => {
  try {
    const {
      item,
      warehouse,
      quantity,
      purpose,
      date,
      returnDate,
      reason,
      tenderNo,
    } = req.body;

    // ✅ Check available stock
    const ledgerEntries = await StockLedger.find({ item, warehouse });
    const currentQty = ledgerEntries.reduce(
      (acc, entry) => acc + entry.quantity,
      0
    );

    if (quantity > currentQty) {
      return res.status(400).json({
        message: `Insufficient stock. Only ${currentQty} available.`,
        success: false,
      });
    }

    // ➕ Save in StockOut
    const entry = await StockOut.create({
      item,
      warehouse,
      quantity,
      purpose,
      date,
      returnDate,
      reason,
      tenderNo,
    });

    // 📝 Log in StockLedger (OUT entry)
    await StockLedger.create({
      item,
      warehouse,
      quantity: -Math.abs(quantity),
      action: "OUT",
      purpose,
      remarks: reason,
      date,
      returnDate: purpose === "Demo" ? returnDate : undefined, // Only if Demo
      returned: false,
    });

    res.status(201).json({ message: "Stock Out recorded", entry });
  } catch (error) {
    console.error("❌ Error in createStockOut:", error);
    res.status(500).json({ message: error.message });
  }
};

// 📃 Get all Stock Out entries
export const getAllStockOuts = async (req, res) => {
  try {
    const entries = await StockOut.find()
      .populate("item", "name")
      .populate("warehouse", "name")
      .sort({ date: -1 });

    res.status(200).json(entries);
  } catch (error) {
    console.error("Error in getAllStockOuts:", error);
    res.status(500).json({ message: "Failed to fetch stock out records" });
  }
};
export const getPendingDemoReturns = async (req, res) => {
  try {
    const demoItems = await StockOut.find({
      purpose: "Demo",
      returnDate: { $exists: true, $gte: new Date() },
    })
      .populate("item", "name modelNo")
      .populate("warehouse", "name")
      .sort({ returnDate: 1 });

    res.status(200).json(demoItems);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch demo returns" });
  }
};
