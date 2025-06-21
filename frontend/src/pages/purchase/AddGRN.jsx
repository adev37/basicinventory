import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddGRN = () => {
  const [pos, setPOs] = useState([]);
  const [selectedPO, setSelectedPO] = useState(null);
  const [receivedItems, setReceivedItems] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 🔁 Fetch pending/partial POs
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/purchase-orders")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.poList || [];

        const filtered = data.filter(
          (po) => po.status === "Pending" || po.status === "Partially Received"
        );

        setPOs(filtered);
      })
      .catch((err) => {
        console.error("❌ Error loading POs:", err);
        toast.error("Failed to load purchase orders.");
      });
  }, []);

  // 🔄 Select PO handler
  const handleSelectPO = (poId) => {
    const po = pos.find((p) => p._id === poId);
    if (!po) return;

    setSelectedPO(po);

    const formatted = po.items.map((i) => ({
      item: typeof i.item === "object" ? i.item._id : i.item,
      receivedQty: i.quantity,
    }));

    setReceivedItems(formatted);
    setRemarks("");
  };

  // 📝 Qty update
  const handleQtyChange = (index, value) => {
    const updated = [...receivedItems];
    updated[index].receivedQty = Number(value);
    setReceivedItems(updated);
  };

  // ✅ Submit GRN
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPO) {
      toast.warn("Please select a Purchase Order.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await axios.post("http://localhost:5000/api/goods-receipts", {
        purchaseOrder: selectedPO._id,
        receivedItems,
        remarks,
        createdBy: localStorage.getItem("userId") || null,
      });

      toast.success("✅ GRN created successfully");
      setSelectedPO(null);
      setReceivedItems([]);
      setRemarks("");
    } catch (err) {
      console.error("❌ GRN error:", err);
      const msg =
        err.response?.data?.message || err.message || "Failed to submit GRN";
      toast.error("❌ " + msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">📥 Goods Receipt</h2>

      {/* PO Dropdown */}
      <label className="block mb-2 font-medium">Select Purchase Order:</label>
      <select
        onChange={(e) => handleSelectPO(e.target.value)}
        className="border px-4 py-2 rounded w-full mb-4"
        required>
        <option value="">-- Select PO --</option>
        {pos.map((po) => (
          <option key={po._id} value={po._id}>
            {po.poNumber}
          </option>
        ))}
      </select>

      {/* Form for items */}
      {selectedPO && (
        <form onSubmit={handleSubmit}>
          <h4 className="text-md font-medium mb-2">Items to Receive:</h4>
          {selectedPO.items.map((i, idx) => (
            <div key={idx} className="flex items-center mb-3">
              <span className="w-1/3">{i.item?.name || "Item"}</span>
              <input
                type="number"
                value={receivedItems[idx]?.receivedQty || 0}
                onChange={(e) => handleQtyChange(idx, e.target.value)}
                className="border px-2 py-1 rounded w-1/3 ml-4"
                min="0"
                max={i.quantity}
                required
              />
              <span className="ml-2 text-sm text-gray-500">
                / {i.quantity} ordered
              </span>
            </div>
          ))}

          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="border p-2 rounded w-full mt-4"
            rows="2"
            placeholder="Any remarks (optional)"
          />

          <button
            type="submit"
            className={`bg-blue-600 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700 ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Goods Receipt"}
          </button>
        </form>
      )}
    </div>
  );
};

export default AddGRN;
