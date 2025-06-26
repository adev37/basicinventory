// components/CurrentStock.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const CurrentStock = () => {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentStock = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/current-stock");
        setStock(res.data);
      } catch (error) {
        console.error("Error fetching current stock:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentStock();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📊 Current Stock Report</h2>
      {loading ? (
        <p className="text-blue-500">Loading stock data...</p>
      ) : stock.length === 0 ? (
        <p className="text-gray-600">No stock data found.</p>
      ) : (
        <table className="w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Item</th>
              <th className="p-2 border">Model</th>
              <th className="p-2 border">Company</th> {/* 👈 New */}
              <th className="p-2 border">Warehouse</th>
              <th className="p-2 border">Qty Available</th>
            </tr>
          </thead>
          <tbody>
            {stock.map((entry, index) => (
              <tr key={index}>
                <td className="p-2 border">{entry.item}</td>
                <td className="p-2 border">{entry.modelNo}</td>
                <td className="p-2 border">{entry.companyName}</td>{" "}
                {/* 👈 New */}
                <td className="p-2 border">{entry.warehouse}</td>
                <td
                  className={`p-2 border font-semibold ${
                    entry.quantity < 0 ? "text-red-500" : "text-green-600"
                  }`}>
                  {entry.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CurrentStock;
