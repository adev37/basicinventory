// ✅ controllers/demoController.js
import StockLedger from "../models/StockLedger.js";

// 📦 GET: All items sent for Demo and not returned yet
export const getPendingDemoReturns = async (req, res) => {
  try {
    const demoOutItems = await StockLedger.find({
      action: "OUT",
      purpose: "Demo",
      returned: { $ne: true },
    })
      .populate("item", "name modelNo")
      .populate("warehouse", "name")
      .sort({ date: -1 });

    res.status(200).json(demoOutItems);
  } catch (error) {
    console.error("❌ Error in getPendingDemoReturns:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🔄 POST: Mark a demo item as returned and log IN entry
// 🔄 POST: Mark a demo item as returned and log IN entry
export const returnDemoItem = async (req, res) => {
  try {
    const id = req.params.id;
    const original = await StockLedger.findById(id);
    if (!original) return res.status(404).json({ message: "Entry not found" });

    original.returned = true;
    await original.save();

    const returned = await StockLedger.create({
      item: original.item,
      warehouse: original.warehouse,
      quantity: Math.abs(original.quantity),
      action: "IN",
      type: "Return In",
      purpose: "Demo Return",
      remarks: "Returned from demo",
      date: new Date(),
      referenceId: original._id, // ✅ NEW FIELD
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

// 📊 GET: Full demo return report
// 📊 GET: Full demo return report
export const getDemoReturnReport = async (req, res) => {
  try {
    // Fetch OUT entries for Demo
    const outEntries = await StockLedger.find({
      action: "OUT",
      purpose: "Demo",
    })
      .populate("item", "name modelNo")
      .populate("warehouse", "name")
      .sort({ date: -1 });

    // Fetch IN entries for Demo Return
    const inEntries = await StockLedger.find({
      action: "IN",
      purpose: "Demo Return",
    });

    // 1. ReferenceId matching
    const refMap = {};
    inEntries.forEach((entry) => {
      if (entry.referenceId) {
        refMap[entry.referenceId.toString()] = entry;
      }
    });

    // 2. Fallback: Matching by item+warehouse+quantity
    const unmatchedReturns = inEntries.filter((entry) => !entry.referenceId);
    const usedSet = new Set(); // to avoid duplicate matches
    const fallbackMap = {};

    outEntries.forEach((out) => {
      const key = `${out.item._id}_${out.warehouse._id}_${Math.abs(
        out.quantity
      )}`;
      const match = unmatchedReturns.find(
        (r) =>
          !usedSet.has(r._id.toString()) &&
          r.item.toString() === out.item._id.toString() &&
          r.warehouse.toString() === out.warehouse._id.toString() &&
          Math.abs(r.quantity) === Math.abs(out.quantity)
      );

      if (match) {
        fallbackMap[out._id.toString()] = match;
        usedSet.add(match._id.toString());
      }
    });

    // Merge both maps
    const report = outEntries.map((out) => {
      const returnEntry =
        refMap[out._id.toString()] || fallbackMap[out._id.toString()];

      return {
        _id: out._id,
        item: out.item,
        warehouse: out.warehouse,
        quantity: Math.abs(out.quantity),
        returnDate: out.returnDate,
        date: out.date,
        returned: !!returnEntry,
        returnedOn: returnEntry?.date || null,
      };
    });

    res.json(report);
  } catch (error) {
    console.error("❌ Error in getDemoReturnReport:", error);
    res.status(500).json({ message: error.message });
  }
};
