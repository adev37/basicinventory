import React, { useEffect, useState } from "react";
import API from "../../utils/axiosInstance";
import { toast } from "react-toastify"; // ✅ Import Toastify

const StockTransfer = () => {
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [availableQty, setAvailableQty] = useState(null);

  const [form, setForm] = useState({
    item: "",
    fromWarehouse: "",
    toWarehouse: "",
    quantity: "",
    note: "",
  });

  useEffect(() => {
    fetchItems();
    fetchWarehouses();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await API.get("/items");
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
      toast.error("❌ Failed to fetch items.");
    }
  };

  const fetchWarehouses = async () => {
    try {
      const res = await API.get("/warehouses");
      setWarehouses(res.data);
    } catch (err) {
      console.error("Error fetching warehouses:", err);
      toast.error("❌ Failed to fetch warehouses.");
    }
  };

  const fetchAvailableQty = async () => {
    if (form.item && form.fromWarehouse) {
      try {
        const res = await API.get("/current-stock");
        const entry = res.data.find(
          (s) => s.itemId === form.item && s.warehouseId === form.fromWarehouse
        );
        setAvailableQty(entry?.quantity || 0);
      } catch (err) {
        console.error("Error fetching quantity:", err);
        toast.error("❌ Failed to fetch available stock.");
        setAvailableQty(null);
      }
    } else {
      setAvailableQty(null);
    }
  };

  useEffect(() => {
    fetchAvailableQty();
  }, [form.item, form.fromWarehouse]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.fromWarehouse === form.toWarehouse) {
      toast.error("❌ From and To warehouses cannot be the same.");
      return;
    }

    if (availableQty === null) {
      toast.error("❌ Please select item and source warehouse.");
      return;
    }

    if (parseInt(form.quantity) > availableQty) {
      toast.error(`❌ Only ${availableQty} units available.`);
      return;
    }

    try {
      await API.post("/stock-transfers", form);
      toast.success("✅ Stock transfer successful");

      setForm({
        item: "",
        fromWarehouse: "",
        toWarehouse: "",
        quantity: "",
        note: "",
      });
      setAvailableQty(null);
    } catch (err) {
      console.error("Transfer failed:", err);
      toast.error(err.response?.data?.message || "❌ Transfer failed");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">🔁 Stock Transfer</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-4 shadow rounded">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="item"
            value={form.item}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded">
            <option value="">Select Item</option>
            {items.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name} ({item.modelNo})
              </option>
            ))}
          </select>

          <select
            name="fromWarehouse"
            value={form.fromWarehouse}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded">
            <option value="">From Warehouse</option>
            {warehouses.map((wh) => (
              <option key={wh._id} value={wh._id}>
                {wh.name}
              </option>
            ))}
          </select>

          <select
            name="toWarehouse"
            value={form.toWarehouse}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded">
            <option value="">To Warehouse</option>
            {warehouses.map((wh) => (
              <option key={wh._id} value={wh._id}>
                {wh.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="quantity"
            placeholder={`Quantity (Available: ${
              availableQty !== null ? availableQty : "-"
            })`}
            value={form.quantity}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded"
          />
        </div>

        <input
          type="text"
          name="note"
          placeholder="Remarks"
          value={form.note}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded w-full hover:bg-blue-700">
          Transfer Stock
        </button>
      </form>
    </div>
  );
};

export default StockTransfer;
