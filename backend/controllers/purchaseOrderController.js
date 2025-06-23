import VendorQuotation from "../models/vendorQuotationModel.js";
import PurchaseOrder from "../models/PurchaseOrder.js";
import Item from "../models/Item.js"; // only if needed for unit etc.

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

export const createPOFromQuotation = async (req, res) => {
  try {
    const { quotationId, deliveryDate, createdBy } = req.body;

    const quotation = await VendorQuotation.findById(quotationId)
      .populate("vendor")
      .populate("items.item");

    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    const poItems = quotation.items.map((qi) => {
      const { quantity, price } = qi;
      const gst = qi.item?.gst || 0;
      const unit = qi.item?.unit || "";
      const total = quantity * price + (quantity * price * gst) / 100;

      return {
        item: qi.item._id,
        quantity,
        rate: price,
        gst,
        unit,
        total,
      };
    });

    const poNumber = "PO-" + Date.now();

    const newPO = new PurchaseOrder({
      poNumber,
      vendor: quotation.vendor._id,
      items: poItems,
      deliveryDate,
      remarks: quotation.terms,
      createdBy,
      status: "Pending",
    });

    await newPO.save();

    // ✅ Mark quotation as converted
    quotation.status = "Converted";
    await quotation.save();

    res.status(201).json({
      message: "Purchase Order created from quotation",
      po: newPO,
    });
  } catch (err) {
    console.error("❌ Error creating PO from quotation:", err);
    res.status(500).json({ error: err.message });
  }
};
