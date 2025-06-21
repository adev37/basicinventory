import React, { useState, useEffect } from "react";
import axios from "axios";

const AddDeliveryChallan = () => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [clientName, setClientName] = useState("");
  const [transportDetails, setTransportDetails] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/items")
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Error fetching items:", err));
  }, []);

  const handleAddItem = () => {
    setSelectedItems([...selectedItems, { item: "", quantity: 1 }]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...selectedItems];
    updatedItems[index][field] = value;
    setSelectedItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/delivery-challans", {
      clientName,
      transportDetails,
      items: selectedItems,
    });
    alert("Delivery Challan Created");
    setClientName("");
    setTransportDetails("");
    setSelectedItems([]);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create Delivery Challan</h2>
      <input
        className="w-full border p-2 mb-3"
        placeholder="Client Name"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
      />
      <input
        className="w-full border p-2 mb-3"
        placeholder="Transport Details"
        value={transportDetails}
        onChange={(e) => setTransportDetails(e.target.value)}
      />
      <button
        type="button"
        className="bg-blue-500 text-white px-3 py-1 rounded mb-3"
        onClick={handleAddItem}>
        + Add Item
      </button>

      {selectedItems.map((row, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <select
            className="flex-1 border p-2"
            value={row.item}
            onChange={(e) => handleItemChange(idx, "item", e.target.value)}>
            <option value="">Select Item</option>
            {items.map((itm) => (
              <option key={itm._id} value={itm._id}>
                {itm.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="w-24 border p-2"
            min={1}
            value={row.quantity}
            onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
          />
        </div>
      ))}

      <button
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleSubmit}>
        Submit Delivery Challan
      </button>
    </div>
  );
};

export default AddDeliveryChallan;
