import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddDeliveryChallan = () => {
  const navigate = useNavigate();
  const [salesOrders, setSalesOrders] = useState([]);
  const [selectedSOId, setSelectedSOId] = useState("");
  const [items, setItems] = useState([]);
  const [transportDetails, setTransportDetails] = useState("");

  // Fetch Undelivered Sales Orders
  useEffect(() => {
    const fetchUndeliveredSOs = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/sales-orders/undelivered",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSalesOrders(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch SOs:", err);
      }
    };

    fetchUndeliveredSOs();
  }, []);

  const handleSOChange = (e) => {
    const soId = e.target.value;
    setSelectedSOId(soId);
    const selected = salesOrders.find((so) => so._id === soId);
    if (selected) {
      const mappedItems = selected.items.map((i) => ({
        item: i.item._id,
        name: i.item.name,
        quantity: i.remaining,
      }));
      setItems(mappedItems);
    } else {
      setItems([]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedSOId || items.length === 0) {
      alert("❌ Please select a Sales Order and ensure items exist.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/delivery-challans",
        {
          salesOrderId: selectedSOId,
          items: items.map(({ item, quantity }) => ({ item, quantity })),
          transportDetails,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("✅ Delivery Challan Created");
      navigate("/delivery-challans");
    } catch (err) {
      console.error("❌ Error creating DC:", err);
      alert("❌ Failed to create Delivery Challan");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🚚 Create Delivery Challan</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Select Sales Order</label>
        <select
          className="w-full border p-2 rounded"
          value={selectedSOId}
          onChange={handleSOChange}>
          <option value="">-- Select Sales Order --</option>
          {salesOrders.map((so) => (
            <option key={so._id} value={so._id}>
              {so.orderNumber || so.soNumber} – {so.client?.name}
            </option>
          ))}
        </select>
      </div>

      {items.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Items to Deliver</h4>
          <ul className="list-disc pl-5">
            {items.map((i, index) => (
              <li key={index}>
                {i.name} – Qty: {i.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-4">
        <label className="block font-medium mb-1">Transport Details</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={transportDetails}
          onChange={(e) => setTransportDetails(e.target.value)}
          placeholder="e.g., UP32-A-1234 / Blue Dart"
        />
      </div>

      <button
        className="bg-green-600 text-white px-6 py-2 rounded"
        onClick={handleSubmit}>
        Submit Delivery Challan
      </button>
    </div>
  );
};

export default AddDeliveryChallan;
