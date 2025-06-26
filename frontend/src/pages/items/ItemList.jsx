import React, { useEffect, useState } from "react";
import axios from "axios";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/items")
      .then((res) => {
        setItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch items", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📋 Item Master List</h2>

      {loading ? (
        <p className="text-blue-600 animate-pulse">Loading items...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-600">No items found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr className="bg-blue-100 text-left">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Item Name</th>
                <th className="px-4 py-2">Model No.</th>
                <th className="px-4 py-2">Company</th>

                <th className="px-4 py-2">Min Stock Alert</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item._id} className="border-t">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.modelNo || "-"}</td>
                  <td className="px-4 py-2">{item.companyName}</td>

                  <td className="px-4 py-2">
                    {item.minStockAlert ? item.minStockAlert : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ItemList;
