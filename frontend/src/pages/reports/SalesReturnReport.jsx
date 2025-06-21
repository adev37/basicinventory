// File: /src/pages/reports/SalesReturnReport.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const SalesReturnReport = () => {
  const [returns, setReturns] = useState([]);

  useEffect(() => {
    const fetchReturns = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/sales-returns", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReturns(res.data);
    };
    fetchReturns();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Sales Return Report</h2>
      <table className="w-full table-auto border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Return ID</th>
            <th className="p-2 border">Invoice</th>
            <th className="p-2 border">Client</th>
            <th className="p-2 border">Item Count</th>
            <th className="p-2 border">Reason</th>
            <th className="p-2 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {returns.map((ret, idx) => (
            <tr key={idx}>
              <td className="p-2 border">{ret._id}</td>
              <td className="p-2 border">{ret.referenceId}</td>
              <td className="p-2 border">{ret.client?.companyName || "-"}</td>
              <td className="p-2 border">{ret.items?.length}</td>
              <td className="p-2 border">
                <span
                  className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                    ret.reason?.toLowerCase().includes("damage")
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}>
                  {ret.reason}
                </span>
              </td>
              <td className="p-2 border">
                {new Date(ret.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesReturnReport;
