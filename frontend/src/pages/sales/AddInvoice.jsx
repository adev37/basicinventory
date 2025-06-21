import React, { useState, useEffect } from "react";
import axios from "axios";

const AddInvoice = () => {
  const [clients, setClients] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [clientRes, itemRes] = await Promise.all([
          axios.get("http://localhost:5000/api/clients", { headers }),
          axios.get("http://localhost:5000/api/items", { headers }),
        ]);
        setClients(clientRes.data);
        setItems(itemRes.data);
      } catch (err) {
        console.error("Fetch error:", err.message);
      }
    };
    fetchData();
  }, []);

  const handleAddItem = () => {
    setInvoiceItems([...invoiceItems, { item: "", quantity: 1, price: 0 }]);
  };

  const handleItemChange = (idx, field, value) => {
    const updatedItems = [...invoiceItems];
    updatedItems[idx][field] = value;
    setInvoiceItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedItems = invoiceItems.map(({ item, quantity, price }) => ({
      item,
      quantity: Number(quantity),
      price: Number(price),
    }));

    await axios.post(
      "http://localhost:5000/api/sales-invoices",
      {
        invoiceNumber,
        client: selectedClient,
        items: formattedItems,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Invoice created ✅");
    setInvoiceNumber("");
    setSelectedClient("");
    setInvoiceItems([]);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add Sales Invoice</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Invoice Number"
          className="w-full border p-2 rounded"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          required
        />

        {/* ✅ Updated: Correct client name display */}
        <select
          className="w-full border p-2 rounded"
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          required>
          <option value="">-- Select Client --</option>
          {clients.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} {c.gstin ? `(${c.gstin})` : ""}
            </option>
          ))}
        </select>

        {/* ✅ Dynamic item entries */}
        {invoiceItems.map((invItem, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <select
              className="flex-1 border p-2 rounded"
              value={invItem.item}
              onChange={(e) => handleItemChange(idx, "item", e.target.value)}
              required>
              <option value="">-- Item --</option>
              {items.map((it) => (
                <option key={it._id} value={it._id}>
                  {it.name} ({it.sku})
                </option>
              ))}
            </select>
            <input
              type="number"
              className="w-24 border p-2 rounded"
              value={invItem.quantity}
              onChange={(e) =>
                handleItemChange(idx, "quantity", e.target.value)
              }
              placeholder="Qty"
              required
            />
            <input
              type="number"
              className="w-24 border p-2 rounded"
              value={invItem.price}
              onChange={(e) => handleItemChange(idx, "price", e.target.value)}
              placeholder="Price"
              required
            />
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddItem}
          className="bg-gray-200 px-3 py-1 rounded">
          ➕ Add Item
        </button>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create Invoice
        </button>
      </form>
    </div>
  );
};

export default AddInvoice;
