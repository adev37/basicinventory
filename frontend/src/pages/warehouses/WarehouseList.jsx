// src/pages/warehouses/WarehouseList.jsx
import React, { useEffect, useState } from "react";
import API from "../../utils/axiosInstance"; // ✅ uses token with headers

const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await API.get("/warehouses");
        setWarehouses(res.data);
      } catch (err) {
        console.error("❌ Error fetching warehouses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouses();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🏬 Warehouse List</h2>

      {loading ? (
        <p className="text-blue-500">Loading warehouses...</p>
      ) : warehouses.length === 0 ? (
        <p className="text-gray-500">No warehouses found.</p>
      ) : (
        <table className="w-full table-auto border border-gray-300 shadow text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Warehouse Name</th>
              <th className="p-2 border">Location</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((w, idx) => (
              <tr key={w._id}>
                <td className="p-2 border">{idx + 1}</td>
                <td className="p-2 border">{w.name}</td>
                <td className="p-2 border">{w.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WarehouseList;
