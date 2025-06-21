//localhost:5000

// src/pages/stock/StockList.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

const CurrentStock = () => {
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/stocks")
      .then((res) => setStockData(res.data))
      .catch((err) => console.error("Stock fetch failed:", err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">📦 Current Stock</h2>
      <table className="w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Item Name</th>
            <th className="border p-2">SKU</th>
            <th className="border p-2">Available Qty</th>
            <th className="border p-2">Unit</th>
            <th className="border p-2">Low Alert</th>
          </tr>
        </thead>
        <tbody>
          {stockData.map((s) => (
            <tr key={s._id}>
              <td className="border p-2">{s.item?.name}</td>
              <td className="border p-2">{s.item?.sku}</td>
              <td
                className={`border p-2 font-bold ${
                  s.quantity <= (s.item?.lowAlert || 0) ? "text-red-600" : ""
                }`}>
                {s.quantity}
              </td>
              <td className="border p-2">{s.item?.unit}</td>
              <td className="border p-2">{s.item?.lowAlert}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CurrentStock;
