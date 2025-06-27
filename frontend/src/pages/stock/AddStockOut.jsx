import React, { useEffect, useState } from "react";
import API from "../../utils/axiosInstance";
import { toast } from "react-toastify"; // ✅ Toastify import

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
    const fetchData = async () => {
      try {
        const [itemRes, warehouseRes] = await Promise.all([
          API.get("/items"),
          API.get("/warehouses"),
        ]);
        setItems(itemRes.data);
        setWarehouses(warehouseRes.data);
      } catch (err) {
        console.error(
          "❌ Error fetching data:",
          err.response?.data || err.message
        );
        toast.error("❌ Failed to load items or warehouses");
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/stock-out", form);
      toast.success("✅ Stock Out recorded successfully.");
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
      console.error(
        "❌ Error submitting stock out:",
        error.response?.data || error.message
      );
      const msg = error?.response?.data?.message || "❌ Something went wrong.";
      toast.error(msg);
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

        {/* Date */}
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

        {/* Return Date (only for Demo) */}
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

        {/* Submit */}
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
