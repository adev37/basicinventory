import StockIn from "../models/StockIn.js";
import StockLedger from "../models/StockLedger.js";

// ➕ Create Stock In Entry
export const createStockIn = async (req, res) => {
  try {
    const { item, warehouse, quantity, date, remarks } = req.body;

    const entry = await StockIn.create({
      item,
      warehouse,
      quantity,
      date,
      remarks,
    });

    await StockLedger.create({
      item,
      warehouse,
      quantity,
      action: "IN", // ✅ Required
      type: "In", // ✅ Required
      purpose: null, // Optional
      returned: null, // Optional
      returnDate: null, // Optional
      date,
      remarks, // ✅ Corrected from 'note'
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
