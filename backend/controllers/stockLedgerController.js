import StockLedger from "../models/StockLedger.js";

export const getStockLedger = async (req, res) => {
  try {
    const ledger = await StockLedger.find()
      .populate("item", "name sku")
      .sort({ timestamp: -1 });

    res.json(ledger);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stock ledger" });
  }
};
