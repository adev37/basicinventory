import React, { useState } from "react";
import axios from "axios";

const AddItem = () => {
  const [form, setForm] = useState({
    name: "",
    modelNo: "",
    companyName: "",
    minStockAlert: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // clear error on input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/items", form);
      alert("✅ Item added successfully.");
      setForm({
        name: "",
        modelNo: "",
        companyName: "",
        minStockAlert: "",
      });
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        🧾 <span className="ml-2">Add New Item</span>
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 max-w-2xl">
        <div>
          <label className="block mb-1 text-sm font-medium">Item Name</label>
          <input
            name="name"
            placeholder="e.g. Electric Table"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Model No.</label>
          <input
            name="modelNo"
            placeholder="e.g. EL-001"
            value={form.modelNo}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Company Name</label>
          <input
            name="companyName"
            placeholder="e.g. BR Biomedical"
            value={form.companyName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">
            Min Stock Alert
          </label>
          <input
            name="minStockAlert"
            type="number"
            placeholder="e.g. 5"
            value={form.minStockAlert}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {error && (
          <div className="col-span-2 text-red-600 font-medium">{error}</div>
        )}

        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700">
          Add Item
        </button>
      </form>
    </div>
  );
};

export default AddItem;
