import React, { useEffect, useState } from "react";
import axios from "axios";

const VendorQuotationList = () => {
  const [quotations, setQuotations] = useState([]);

  const fetchQuotations = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/vendor-quotations"
      );
      setQuotations(res.data);
    } catch (err) {
      alert("❌ Failed to fetch quotations");
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const convertToPO = async (quotationId) => {
    const deliveryDate = prompt("📅 Enter delivery date (yyyy-mm-dd):");
    if (!deliveryDate) return;

    try {
      await axios.post(
        "http://localhost:5000/api/purchase-orders/from-quotation",
        {
          quotationId,
          deliveryDate,
          createdBy: JSON.parse(localStorage.getItem("user"))?._id,
        }
      );

      alert("✅ PO created from quotation");
      fetchQuotations(); // Refresh list after update
    } catch (err) {
      console.error(err);
      alert("❌ Failed to convert to PO");
    }
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, i) => sum + i.quantity * i.price, 0);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📋 Vendor Quotations</h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-sm">
            <th className="border p-2">Vendor</th>
            <th className="border p-2">Valid Until</th>
            <th className="border p-2">Terms</th>
            <th className="border p-2">Total Price</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {quotations.map((q) => (
            <tr key={q._id} className="text-center text-sm">
              <td className="border p-2">{q.vendor?.name || "N/A"}</td>
              <td className="border p-2">{q.validUntil?.substring(0, 10)}</td>
              <td className="border p-2">{q.terms}</td>
              <td className="border p-2 font-semibold text-green-700">
                ₹ {calculateTotal(q.items).toFixed(2)}
              </td>
              <td className="border p-2">{q.status}</td>
              <td className="border p-2">
                {q.status === "Pending" ? (
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => convertToPO(q._id)}>
                    Convert to PO
                  </button>
                ) : q.status === "Converted" ? (
                  q.poStatus === "Received" ? (
                    <button
                      className="bg-gray-300 text-gray-700 px-3 py-1 rounded cursor-not-allowed"
                      disabled>
                      Unavailable
                    </button>
                  ) : (
                    <span className="text-green-600 font-semibold">
                      Converted
                    </span>
                  )
                ) : (
                  <button
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded cursor-not-allowed"
                    disabled>
                    Unavailable
                  </button>
                )}
              </td>
            </tr>
          ))}
          {quotations.length === 0 && (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                No quotations found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VendorQuotationList;
