import StockIn from "../models/StockIn.js";
import StockLedger from "../models/StockLedger.js";

// ➕ Create Stock In Entry
export const createStockIn = async (req, res) => {
  try {
    const { item, warehouse, quantity, date, remarks } = req.body;

    // 1. Create StockIn Entry
    const entry = await StockIn.create({
      item,
      warehouse,
      quantity,
      date,
      remarks,
    });

    // 2. Log entry in Stock Ledger with action 'IN'
    await StockLedger.create({
      item,
      warehouse,
      quantity,
      action: "IN", // ✅ Required for ledger
      operation: "Stock In",
      remarks,
      date,
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error("❌ Error in createStockIn:", error);
    res.status(500).json({ message: error.message });
  }
};

// 📃 Get All Stock In Records
export const getAllStockIns = async (req, res) => {
  try {
    const entries = await StockIn.find()
      .populate("item", "name modelNo") // updated 'sku' to 'modelNo' if that is what you use
      .populate("warehouse", "name")
      .sort({ date: -1 });

    res.json(entries);
  } catch (error) {
    console.error("❌ Error in getAllStockIns:", error);
    res.status(500).json({ message: "Failed to fetch stock in records" });
  }
};
