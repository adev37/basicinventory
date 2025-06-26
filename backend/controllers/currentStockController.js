// controllers/currentStockController.js
import Item from "../models/Item.js";
import StockLedger from "../models/StockLedger.js";

export const getCurrentStock = async (req, res) => {
  try {
    const entries = await StockLedger.find()
      .populate("item", "name modelNo companyName") // 👈 include companyName
      .populate("warehouse", "name");

    const stockMap = {};

    for (const entry of entries) {
      const item = entry.item || {};
      const warehouse = entry.warehouse || {};
      const key = `${item._id}-${warehouse._id}`;

      if (!stockMap[key]) {
        stockMap[key] = {
          item: item.name || "Unknown",
          modelNo: item.modelNo || "-",
          companyName: item.companyName || "Unknown", // 👈 added
          warehouse: warehouse.name || "Unknown",
          quantity: 0,
        };
      }

      stockMap[key].quantity += entry.quantity;
    }

    const result = Object.values(stockMap);
    res.json(result);
  } catch (error) {
    console.error("❌ Error in getCurrentStock:", error);
    res.status(500).json({ message: "Failed to fetch current stock" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const ledgerEntries = await StockLedger.find().populate("item");

    const stockMap = {}; // itemId => quantity + minStockAlert

    for (const entry of ledgerEntries) {
      const item = entry.item;
      if (!item || !item._id) continue;

      const id = item._id.toString();

      if (!stockMap[id]) {
        stockMap[id] = {
          quantity: 0,
          minStockAlert: item.minStockAlert || 0,
        };
      }

      stockMap[id].quantity += entry.quantity;
    }

    const totalItems = await Item.countDocuments();
    const totalStock = Object.values(stockMap).reduce(
      (sum, s) => sum + s.quantity,
      0
    );

    const lowStockItems = Object.values(stockMap).filter(
      (s) => s.quantity <= s.minStockAlert
    ).length;

    // ✅ Debug logs

    res.json({
      totalItems,
      totalStock,
      lowStockItems,
    });
  } catch (error) {
    console.error("❌ Error in getDashboardStats:", error);
    res.status(500).json({ message: "Dashboard summary error" });
  }
};
