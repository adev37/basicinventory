import React, { useEffect, useState } from "react";
import axios from "axios";

const AddStockOut = () => {
  const [form, setForm] = useState({
    item: "",
    warehouse: "",
    quantity: "",
    purpose: "",
    date: "",
    returnDate: "",
    reason: "",
    tenderNo: "",
  });

  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/items")
      .then((res) => setItems(res.data))
      .catch((err) => console.error("❌ Failed to fetch items", err));

    axios
      .get("http://localhost:5000/api/warehouses")
      .then((res) => setWarehouses(res.data))
      .catch((err) => console.error("❌ Failed to fetch warehouses", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/stock-out", form);
      alert("✅ Stock Out recorded successfully.");
      setForm({
        item: "",
        warehouse: "",
        quantity: "",
        purpose: "",
        date: "",
        returnDate: "",
        reason: "",
        tenderNo: "",
      });
    } catch (error) {
      console.error("❌ Error submitting stock out:", error);
      const msg = error?.response?.data?.message || "Something went wrong.";
      alert(`❌ ${msg}`);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        📤 <span className="ml-2">Stock Out</span>
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 max-w-3xl">
        {/* Item */}
        <div>
          <label className="block text-sm font-medium mb-1">Select Item</label>
          <select
            name="item"
            value={form.item}
            onChange={handleChange}
            required
            className="p-2 border rounded w-full">
            <option value="">Select Item</option>
            {items.map((i) => (
              <option key={i._id} value={i._id}>
                {i.name} ({i.modelNo})
              </option>
            ))}
          </select>
        </div>

        {/* Warehouse */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Select Warehouse
          </label>
          <select
            name="warehouse"
            value={form.warehouse}
            onChange={handleChange}
            required
            className="p-2 border rounded w-full">
            <option value="">Select Warehouse</option>
            {warehouses.map((w) => (
              <option key={w._id} value={w._id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            min={1}
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            required
            className="p-2 border rounded w-full"
          />
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-sm font-medium mb-1">Purpose</label>
          <select
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            required
            className="p-2 border rounded w-full">
            <option value="">Select Purpose</option>
            <option value="Sale">Sale</option>
            <option value="Demo">Demo</option>
          </select>
        </div>

        {/* Stock Out Date */}
        <div>
          <label className="block text-sm font-medium mb-1">
            📅 Stock Out Date
          </label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="p-2 border rounded w-full"
          />
        </div>

        {/* Return Date (Visible only for Demo) */}
        {form.purpose === "Demo" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              🕓 Expected Return Date
            </label>
            <input
              type="date"
              name="returnDate"
              value={form.returnDate}
              onChange={handleChange}
              min={form.date || undefined}
              required
              className="p-2 border rounded w-full"
            />
          </div>
        )}

        {/* Reason */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Reason</label>
          <input
            type="text"
            name="reason"
            placeholder="Reason"
            value={form.reason}
            onChange={handleChange}
            required
            className="p-2 border rounded w-full"
          />
        </div>

        {/* Tender No */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Tender No.</label>
          <input
            type="text"
            name="tenderNo"
            placeholder="Tender Number"
            value={form.tenderNo}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="col-span-2 bg-red-600 text-white font-semibold py-2 rounded hover:bg-red-700">
          Save Stock Out
        </button>
      </form>
    </div>
  );
};

export default AddStockOut;
