// backend/controllers/stockController.js
import Stock from "../models/Stock.js";
import Item from "../models/Item.js"; // ✅ Ensure Item model is imported

// 📥 Increase Stock
export const increaseStock = async (
  itemId,
  qty,
  updatedBy = "System",
  remarks = ""
) => {
  let stock = await Stock.findOne({ item: itemId });

  if (!stock) {
    stock = new Stock({
      item: itemId,
      quantity: qty,
      lastUpdatedBy: updatedBy,
      remarks,
    });
  } else {
    stock.quantity += qty;
    stock.lastUpdatedBy = updatedBy;
    stock.remarks = remarks;
  }

  await stock.save();
};

// 📤 Decrease Stock (with validation and friendly error)
export const decreaseStock = async (itemId, qty) => {
  const stock = await Stock.findOne({ item: itemId });

  if (!stock) {
    const err = new Error("Stock not found for item.");
    err.code = "STOCK_NOT_FOUND";
    throw err;
  }

  if (stock.quantity < qty) {
    const err = new Error("Insufficient stock to return for this item.");
    err.code = "INSUFFICIENT_STOCK";
    throw err;
  }

  stock.quantity -= qty;
  await stock.save();
};

// 📊 Get All Stocks
// 📊 Get All Stocks with full item and category info
export const getAllStock = async (req, res) => {
  try {
    const stocks = await Stock.find().populate({
      path: "item",
      populate: { path: "category", select: "name" }, // ✅ Ensure item.category is populated
    });

    res.json(stocks);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch stock",
      error: error.message,
    });
  }
};
