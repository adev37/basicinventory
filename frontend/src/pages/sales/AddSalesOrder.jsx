import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateSalesOrder = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [salesItems, setSalesItems] = useState([]);
  const [orderNote, setOrderNote] = useState("");

  useEffect(() => {
    axios.get("/api/clients").then((res) => setClients(res.data));
    axios.get("/api/items").then((res) => setItems(res.data));
  }, []);

  const handleAddItem = () => {
    setSalesItems([...salesItems, { item: "", quantity: 1 }]);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...salesItems];
    updated[index][field] = value;
    setSalesItems(updated);
  };

  const handleRemoveItem = (index) => {
    const updated = salesItems.filter((_, i) => i !== index);
    setSalesItems(updated);
  };

  const handleSubmit = async () => {
    const payload = {
      client: selectedClient,
      items: salesItems,
      note: orderNote,
    };

    try {
      await axios.post("/api/sales-orders", payload);
      alert("Sales Order Created");
      navigate("/sales-orders");
    } catch (error) {
      console.error(error);
      alert("Failed to create sales order");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Sales Order</h2>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Select Client:</label>
        <select
          className="w-full border p-2 rounded"
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}>
          <option value="">-- Select Client --</option>
          {clients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Items</h4>
        {salesItems.map((si, index) => (
          <div
            key={index}
            className="flex gap-2 items-center mb-2 border p-2 rounded">
            <select
              className="flex-1 border p-1 rounded"
              value={si.item}
              onChange={(e) => handleItemChange(index, "item", e.target.value)}>
              <option value="">-- Select Item --</option>
              {items.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              className="w-24 border p-1 rounded"
              value={si.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
            />
            <button
              className="text-red-600 hover:underline"
              onClick={() => handleRemoveItem(index)}>
              Remove
            </button>
          </div>
        ))}

        <button
          className="bg-blue-500 text-white px-4 py-1 rounded"
          onClick={handleAddItem}>
          + Add Item
        </button>
      </div>

      <div className="mt-4">
        <label className="block font-semibold mb-1">Order Note:</label>
        <textarea
          className="w-full border p-2 rounded"
          rows="3"
          value={orderNote}
          onChange={(e) => setOrderNote(e.target.value)}
        />
      </div>

      <button
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded"
        onClick={handleSubmit}>
        Submit Sales Order
      </button>
    </div>
  );
};

export default CreateSalesOrder;
