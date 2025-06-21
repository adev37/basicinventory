import PurchaseOrder from "../models/PurchaseOrder.js";

export const createPurchaseOrder = async (req, res) => {
  try {
    const { poNumber, vendor, items, deliveryDate, remarks, createdBy } =
      req.body;

    const totalItems = items.map((item) => ({
      ...item,
      total:
        item.quantity * item.rate +
        (item.quantity * item.rate * item.gst) / 100,
    }));

    const newPO = new PurchaseOrder({
      poNumber,
      vendor,
      items: totalItems,
      deliveryDate,
      remarks,
      createdBy,
      status: "Pending", // ✔️ Initialize PO status
    });

    await newPO.save();

    res.status(201).json({ message: "Purchase Order created", po: newPO });
  } catch (error) {
    console.error("Error creating PO:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllPOs = async (req, res) => {
  try {
    const pos = await PurchaseOrder.find()
      .populate("vendor")
      .populate("items.item");
    res.json(pos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
