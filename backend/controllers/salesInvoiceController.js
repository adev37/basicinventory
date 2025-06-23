import SalesInvoice from "../models/SalesInvoice.js";
import DeliveryChallan from "../models/DeliveryChallan.js";
import { decreaseStock } from "./stockController.js";

// @desc    Create Sales Invoice from Delivery Challan
// @route   POST /api/sales-invoices
// @access  Private
export const createInvoice = async (req, res) => {
  try {
    const { invoiceNumber, deliveryChallan } = req.body;

    // ✅ Fetch DC and client info
    const dc = await DeliveryChallan.findById(deliveryChallan)
      .populate("client")
      .populate("items.item");

    if (!dc) {
      return res.status(404).json({ message: "Delivery Challan not found" });
    }

    // ✅ Prepare invoice items from DC
    const items = dc.items.map((i) => ({
      item: i.item._id,
      quantity: i.quantity,
      price: i.item.pricePerUnit || 0, // fallback if missing
    }));

    const totalAmount = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

    // ✅ Create invoice with DC reference
    const invoice = await SalesInvoice.create({
      invoiceNumber,
      deliveryChallan: dc._id,
      client: dc.client._id,
      items,
      totalAmount,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "✅ Invoice created from Delivery Challan",
      invoice,
    });
  } catch (err) {
    console.error("❌ Error in createInvoice:", err);
    res.status(500).json({
      message: "Invoice creation failed",
      error: err.message,
    });
  }
};

// @desc    Get all Invoices
// @route   GET /api/sales-invoices
// @access  Private
export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await SalesInvoice.find()
      .populate("client", "companyName")
      .populate("deliveryChallan", "transportDetails date")
      .populate("items.item", "name");

    res.json(invoices);
  } catch (err) {
    console.error("❌ Error in getAllInvoices:", err);
    res.status(500).json({
      message: "Fetching invoices failed",
      error: err.message,
    });
  }
};
