import StockLedger from "../models/StockLedger.js";

// 📦 GET: All items sent for Demo and not returned yet
export const getPendingDemoReturns = async (req, res) => {
  try {
    const demoOutItems = await StockLedger.find({
      action: "OUT",
      purpose: "Demo",
      returned: { $ne: true }, // not returned yet
    })
      .populate("item", "name modelNo")
      .populate("warehouse", "name")
      .sort({ date: -1 });

    res.json(demoOutItems);
  } catch (error) {
    console.error("❌ Error in getPendingDemoReturns:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🔄 POST: Mark a demo item as returned and log IN entry
export const returnDemoItem = async (req, res) => {
  try {
    const id = req.params.id;

    const original = await StockLedger.findById(id);
    if (!original) return res.status(404).json({ message: "Entry not found" });

    // Mark as returned
    original.returned = true;
    await original.save();

    // Log new IN entry
    const returned = await StockLedger.create({
      item: original.item,
      warehouse: original.warehouse,
      quantity: Math.abs(original.quantity),
      action: "IN",
      purpose: "Demo Return",
      remarks: "Returned from demo",
      date: new Date(),
    });

    res.status(200).json({ message: "Marked as returned", returned });
  } catch (error) {
    console.error("❌ Error in returnDemoItem:", error);
    res.status(500).json({ message: error.message });
  }
};
// 📄 GET: All completed demo returns
export const getAllDemoReturns = async (req, res) => {
  try {
    const demoReturns = await StockLedger.find({
      action: "IN",
      purpose: "Demo Return",
    })
      .populate("item", "name modelNo")
      .populate("warehouse", "name")
      .sort({ date: -1 });

    res.status(200).json(demoReturns);
  } catch (error) {
    console.error("❌ Error in getAllDemoReturns:", error);
    res.status(500).json({ message: error.message });
  }
};
// 📊 GET: All Demo items sent out (returned or not)
export const getDemoReturnReport = async (req, res) => {
  try {
    const report = await StockLedger.find({
      action: "OUT",
      purpose: "Demo",
    })
      .populate("item", "name modelNo")
      .populate("warehouse", "name")
      .sort({ date: -1 });

    res.json(report);
  } catch (error) {
    console.error("❌ Error in getDemoReturnReport:", error);
    res.status(500).json({ message: error.message });
  }
};
