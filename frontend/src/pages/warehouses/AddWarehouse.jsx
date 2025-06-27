import React, { useState } from "react";
import API from "../../utils/axiosInstance";
import { toast } from "react-toastify"; // ✅ Import toast

const AddWarehouse = () => {
  const [form, setForm] = useState({ name: "", location: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/warehouses", form);
      toast.success("✅ Warehouse added successfully!");
      setForm({ name: "", location: "" });
    } catch (err) {
      console.error("❌ Failed to add warehouse:", err);
      toast.error("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🏢 Add Warehouse</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-md bg-white p-4 rounded shadow">
        <input
          name="name"
          placeholder="Warehouse Name"
          value={form.name}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded">
          ➕ Add Warehouse
        </button>
      </form>
    </div>
  );
};

export default AddWarehouse;
