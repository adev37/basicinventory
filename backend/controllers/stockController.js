// backend/controllers/stockController.js
import Stock from "../models/Stock.js";
import Item from "../models/Item.js"; // ✅ FIXED: This import was missing

export const increaseStock = async (
  itemId,
  qty,
  updatedBy = "System",
  remarks = ""
) => {
  let stock = await Stock.findOne({ item: itemId });

  if (!stock) {
    // Create new stock entry if not found
    stock = new Stock({
      item: itemId,
      quantity: qty,
      lastUpdatedBy: updatedBy,
      remarks,
    });
  } else {
    // Update existing stock
    stock.quantity += qty;
    stock.lastUpdatedBy = updatedBy;
    stock.remarks = remarks;
  }

  await stock.save();
};

export const decreaseStock = async (itemId, qty) => {
  const stock = await Stock.findOne({ item: itemId });
  if (!stock) throw new Error("Stock not found for item " + itemId);

  if (stock.quantity < qty)
    throw new Error(`Insufficient stock to return for item ${itemId}`);

  stock.quantity -= qty;
  await stock.save();
};
export const getAllStock = async (req, res) => {
  try {
    const stocks = await Stock.find().populate("item");
    res.json(stocks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch stock", error: error.message });
  }
};
