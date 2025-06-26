import React, { useState } from "react";
import axios from "axios";

const AddWarehouse = () => {
  const [form, setForm] = useState({ name: "", location: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/warehouses", form);
    alert("Warehouse added!");
    setForm({ name: "", location: "" });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Add Warehouse</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          name="name"
          placeholder="Warehouse Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />
        <button type="submit" className="bg-green-600 text-white p-2">
          Add Warehouse
        </button>
      </form>
    </div>
  );
};

export default AddWarehouse;
