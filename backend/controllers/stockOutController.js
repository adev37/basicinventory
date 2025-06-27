// ✅ controllers/stockOutController.js
import StockOut from "../models/StockOut.js";
import StockLedger from "../models/StockLedger.js";

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

    const ledgerEntries = await StockLedger.find({ item, warehouse });
    const currentQty = ledgerEntries.reduce((acc, e) => acc + e.quantity, 0);
    if (quantity > currentQty) {
      return res.status(400).json({
        message: `Insufficient stock. Only ${currentQty} available.`,
        success: false,
      });
    }

    const stockOutEntry = await StockOut.create({
      item,
      warehouse,
      quantity,
      purpose,
      date,
      returnDate: purpose === "Demo" ? returnDate : undefined,
      reason,
      tenderNo,
    });

    const ledgerEntry = await StockLedger.create({
      item,
      warehouse,
      quantity: -Math.abs(quantity),
      action: "OUT",
      type: "Out",
      purpose,
      remarks: reason,
      date,
      returnDate: purpose === "Demo" ? returnDate : undefined,
      returned: purpose === "Demo" ? false : undefined,
    });

    res.status(201).json({
      message: "Stock Out recorded successfully.",
      stockOutEntry,
      ledgerEntry,
    });
  } catch (error) {
    console.error("❌ Error in createStockOut:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllStockOuts = async (req, res) => {
  try {
    const entries = await StockOut.find()
      .populate("item", "name")
      .populate("warehouse", "name")
      .sort({ date: -1 });

    res.status(200).json(entries);
  } catch (error) {
    console.error("❌ Error in getAllStockOuts:", error);
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
    console.error("❌ Error in getPendingDemoReturns (stockOut):", error);
    res.status(500).json({ message: "Failed to fetch demo returns" });
  }
};
