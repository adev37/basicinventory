import SalesInvoice from "../models/SalesInvoice.js";
import { decreaseStock } from "./stockController.js";

export const createInvoice = async (req, res) => {
  try {
    const { invoiceNumber, client, items } = req.body;

    const totalAmount = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

    const invoice = await SalesInvoice.create({
      invoiceNumber,
      client,
      items,
      totalAmount,
      createdBy: req.user._id,
    });

    for (const { item, quantity } of items) {
      await decreaseStock(item, quantity);
    }

    res.status(201).json({ message: "✅ Invoice created", invoice });
  } catch (err) {
    console.error("❌ Error in createInvoice:", err);
    res
      .status(500)
      .json({ message: "Invoice creation failed", error: err.message });
  }
};

export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await SalesInvoice.find()
      .populate("client", "companyName")
      .populate("items.item", "name");
    res.json(invoices);
  } catch (err) {
    console.error("❌ Error in getAllInvoices:", err);
    res
      .status(500)
      .json({ message: "Fetching invoices failed", error: err.message });
  }
};
