import Stock from "../models/Stock.js";
import StockLedger from "../models/StockLedger.js";

export const increaseStock = async (itemId, quantity, source, sourceId) => {
  const stock = await Stock.findOne({ item: itemId });

  if (stock) {
    stock.quantity += quantity;
    await stock.save();
  } else {
    await Stock.create({ item: itemId, quantity });
  }

  await StockLedger.create({
    item: itemId,
    transactionType: "IN",
    quantity,
    source,
    sourceId,
    timestamp: new Date(),
  });
};

export const decreaseStock = async (itemId, quantity, source, sourceId) => {
  const stock = await Stock.findOne({ item: itemId });

  if (stock) {
    stock.quantity -= quantity;
    await stock.save();
  }

  await StockLedger.create({
    item: itemId,
    transactionType: "OUT",
    quantity,
    source,
    sourceId,
    timestamp: new Date(),
  });
};
