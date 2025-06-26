import React, { useEffect, useState } from "react";
import axios from "axios";

const AddDemoItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDemoItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/demo-returns");
      setItems(res.data);
    } catch (error) {
      console.error("Error fetching demo returns:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsReturned = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/demo-returns/return/${id}`);
      alert("Item marked as returned!");
      fetchDemoItems(); // Refresh
    } catch (err) {
      console.error("Return failed", err);
    }
  };

  useEffect(() => {
    fetchDemoItems();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <span role="img" aria-label="icon" className="mr-2">
          📘
        </span>
        Demo Items to Return
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-300">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="p-2 border">Item</th>
              <th className="p-2 border">Model</th>
              <th className="p-2 border">Warehouse</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Out Date</th>
              <th className="p-2 border">Return</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-600">
                  No pending demo returns.
                </td>
              </tr>
            ) : (
              items.map((i) => (
                <tr key={i._id}>
                  <td className="p-2 border">{i.item?.name}</td>
                  <td className="p-2 border">{i.item?.modelNo}</td>
                  <td className="p-2 border">{i.warehouse?.name}</td>
                  <td className="p-2 border">{i.quantity}</td>
                  <td className="p-2 border">
                    {new Date(i.date).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">
                    <button
                      onClick={() => markAsReturned(i._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                      Mark as Returned
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddDemoItems;
