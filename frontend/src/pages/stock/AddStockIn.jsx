import React, { useEffect, useState } from "react";
import axios from "axios";

const AddStockIn = () => {
  const [form, setForm] = useState({
    item: "",
    warehouse: "",
    quantity: "",
    date: "",
    remarks: "",
  });

  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [itemRes, warehouseRes] = await Promise.all([
        axios.get("http://localhost:5000/api/items"),
        axios.get("http://localhost:5000/api/warehouses"),
      ]);
      setItems(itemRes.data);
      setWarehouses(warehouseRes.data);
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/stock-in", form);
      alert("✅ Stock In recorded!");
      setForm({
        item: "",
        warehouse: "",
        quantity: "",
        date: "",
        remarks: "",
      });
    } catch (err) {
      alert(
        "❌ Failed to record stock in. Please check the form and try again."
      );
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📥 Stock In</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 max-w-2xl bg-white p-4 rounded shadow">
        <select
          name="item"
          value={form.item}
          onChange={handleChange}
          required
          className="border p-2 rounded">
          <option value="">Select Item</option>
          {items.map((i) => (
            <option key={i._id} value={i._id}>
              {i.name} ({i.modelNo})
            </option>
          ))}
        </select>

        <select
          name="warehouse"
          value={form.warehouse}
          onChange={handleChange}
          required
          className="border p-2 rounded">
          <option value="">Select Warehouse</option>
          {warehouses.map((w) => (
            <option key={w._id} value={w._id}>
              {w.name}
            </option>
          ))}
        </select>

        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />

        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />

        <input
          name="remarks"
          placeholder="Remarks"
          value={form.remarks}
          onChange={handleChange}
          className="col-span-2 border p-2 rounded"
        />

        <button
          type="submit"
          className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
          Save Stock In
        </button>
      </form>
    </div>
  );
};

export default AddStockIn;
