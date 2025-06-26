import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewDemoReturns = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDemoReport = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/demo-returns/report"
      );
      setEntries(res.data);
    } catch (error) {
      console.error("Error fetching demo report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemoReport();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="inline-block w-3 h-3 bg-blue-400 rounded-full"></span>
        Demo Returns Report
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : entries.length === 0 ? (
        <p>No demo return records found.</p>
      ) : (
        <table className="w-full table-auto border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Item</th>
              <th className="p-2 border">Model</th>
              <th className="p-2 border">Warehouse</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Return Date</th>
              <th className="p-2 border">Returned On</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry._id}>
                <td className="p-2 border">{entry.item?.name}</td>
                <td className="p-2 border">{entry.item?.modelNo}</td>
                <td className="p-2 border">{entry.warehouse?.name}</td>
                <td className="p-2 border">{entry.quantity}</td>
                <td className="p-2 border">
                  {entry.returnDate
                    ? new Date(entry.returnDate).toLocaleDateString()
                    : "-"}
                </td>
                <td className="p-2 border">
                  {entry.returned
                    ? new Date(entry.date).toLocaleDateString()
                    : "-"}
                </td>
                <td className="p-2 border">
                  <span
                    className={`font-semibold px-2 py-1 rounded ${
                      entry.returned
                        ? "text-green-700 bg-green-100"
                        : "text-red-700 bg-red-100"
                    }`}>
                    {entry.returned ? "Returned" : "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewDemoReturns;
