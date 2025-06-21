import React, { useState, useEffect } from "react";
import axios from "axios";

const AddSalesReturn = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [reason, setReason] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Get all sales invoices
        const invoiceRes = await axios.get(
          "http://localhost:5000/api/sales-invoices",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const invoices = invoiceRes.data;

        // Get all existing returns
        const returnRes = await axios.get(
          "http://localhost:5000/api/sales-returns",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const returns = returnRes.data;

        // Build a map of returned quantities per item per invoice
        const returnMap = {};
        for (const r of returns) {
          if (!returnMap[r.referenceId]) returnMap[r.referenceId] = {};
          for (const i of r.items) {
            const itemId = typeof i.item === "object" ? i.item._id : i.item;
            returnMap[r.referenceId][itemId] =
              (returnMap[r.referenceId][itemId] || 0) + i.quantity;
          }
        }

        // Filter out invoices where all items are fully returned
        const eligible = invoices.filter((inv) => {
          return inv.items.some((invItem) => {
            const itemId =
              typeof invItem.item === "object"
                ? invItem.item._id
                : invItem.item;
            const returnedQty = returnMap[inv._id]?.[itemId] || 0;

            return returnedQty < invItem.quantity;
          });
        });

        setInvoices(eligible);
      } catch (err) {
        console.error("❌ Error loading invoices:", err);
      }
    };

    fetchData();
  }, []);

  const handleInvoiceSelect = (e) => {
    const invoiceId = e.target.value;
    setSelectedInvoiceId(invoiceId);

    const invoice = invoices.find((inv) => inv._id === invoiceId);
    if (invoice) {
      setSelectedItems(
        invoice.items.map((i) => ({ item: i.item._id, quantity: i.quantity }))
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(
      "http://localhost:5000/api/sales-returns",
      {
        referenceInvoiceId: selectedInvoiceId,
        items: selectedItems,
        reason,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Sales return submitted");
    setSelectedInvoiceId("");
    setSelectedItems([]);
    setReason("");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create Sales Return</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          className="w-full border p-2 rounded"
          value={selectedInvoiceId}
          onChange={handleInvoiceSelect}
          required>
          <option value="">-- Select Invoice --</option>
          {invoices.map((inv) => (
            <option key={inv._id} value={inv._id}>
              {inv.invoiceNumber}
            </option>
          ))}
        </select>

        <ul className="bg-gray-50 border rounded p-2">
          {selectedItems.map((item, idx) => (
            <li key={idx} className="py-1 text-sm">
              Item ID: {item.item}, Qty: {item.quantity}
            </li>
          ))}
        </ul>

        <input
          type="text"
          className="w-full border p-2 rounded"
          placeholder="Return Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Submit Return
        </button>
      </form>
    </div>
  );
};

export default AddSalesReturn;
