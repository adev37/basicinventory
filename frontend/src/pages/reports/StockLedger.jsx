import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

const StockLedger = () => {
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/stock-ledger");
        setLedger(res.data);
      } catch (err) {
        console.error("Failed to load stock ledger:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLedger();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        📒 Stock Ledger (IN/OUT History)
      </h2>

      {loading ? (
        <p className="text-blue-500">Loading ledger...</p>
      ) : ledger.length === 0 ? (
        <p className="text-gray-500">No ledger entries found.</p>
      ) : (
        <table className="w-full table-auto border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Item</th>
              <th className="p-2 border">Model No.</th>
              <th className="p-2 border">Warehouse</th>
              <th className="p-2 border">Qty (+/-)</th>
              <th className="p-2 border">Action</th>
              <th className="p-2 border">Purpose</th>
              <th className="p-2 border">Remarks / Reason</th>
            </tr>
          </thead>
          <tbody>
            {ledger.map((entry, index) => (
              <tr key={index}>
                <td className="p-2 border">
                  {moment(entry.date).format("DD-MM-YYYY")}
                </td>
                <td className="p-2 border">{entry.item?.name || "-"}</td>
                <td className="p-2 border">{entry.item?.modelNo || "-"}</td>
                <td className="p-2 border">{entry.warehouse?.name || "-"}</td>
                <td
                  className={`p-2 border font-semibold ${
                    entry.action === "OUT" ? "text-red-600" : "text-green-600"
                  }`}>
                  {entry.quantity}
                </td>
                <td className="p-2 border">{entry.action}</td>
                <td className="p-2 border">{entry.purpose || "-"}</td>
                <td className="p-2 border">
                  {entry.action === "OUT"
                    ? entry.remarks || "-"
                    : entry.remarks || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StockLedger;
