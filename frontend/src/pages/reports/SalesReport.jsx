// File: /src/pages/reports/SalesReport.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const SalesReport = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/sales-invoices", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSales(res.data);
    };
    fetchSales();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Sales Report</h2>
      <table className="w-full table-auto border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Invoice No</th>
            <th className="p-2 border">Client</th>
            <th className="p-2 border">Item Count</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((inv, idx) => (
            <tr key={idx}>
              <td className="p-2 border">{inv.invoiceNumber}</td>
              <td className="p-2 border">{inv.client?.companyName}</td>
              <td className="p-2 border">{inv.items?.length}</td>
              <td className="p-2 border">{inv.totalAmount}</td>
              <td className="p-2 border">
                {new Date(inv.invoiceDate).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesReport;
