import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SalesReturnList = () => {
  const [returns, setReturns] = useState([]);

  useEffect(() => {
    fetchSalesReturns();
  }, []);

  const fetchSalesReturns = async () => {
    try {
      const response = await axios.get("/api/sales-returns"); // Adjust API route as needed
      setReturns(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch sales returns");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">
        🔁 Sales Returns
      </h2>

      <div className="overflow-x-auto border shadow rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 border">Return No.</th>
              <th className="px-4 py-3 border">Client</th>
              <th className="px-4 py-3 border">Return Date</th>
              <th className="px-4 py-3 border">Items</th>
              <th className="px-4 py-3 border">Reason</th>
            </tr>
          </thead>
          <tbody>
            {returns.map((ret) => (
              <tr key={ret._id} className="border-t">
                <td className="px-4 py-2 border">{ret.returnNumber}</td>
                <td className="px-4 py-2 border">{ret.clientName}</td>
                <td className="px-4 py-2 border">
                  {new Date(ret.returnDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border">
                  {ret.items?.length} item(s)
                </td>
                <td className="px-4 py-2 border">{ret.reason || "N/A"}</td>
              </tr>
            ))}
            {returns.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                  No returns found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReturnList;
