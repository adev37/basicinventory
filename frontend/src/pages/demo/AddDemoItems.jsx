import React, { useEffect, useState } from "react";
import API from "../../utils/axiosInstance";
import { toast } from "react-toastify"; // ✅ Import toast

const AddDemoItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDemoItems = async () => {
    try {
      const res = await API.get("/demo-returns");
      setItems(res.data);
    } catch (error) {
      console.error("Error fetching demo returns:", error);
      toast.error("❌ Failed to fetch demo returns.");
    } finally {
      setLoading(false);
    }
  };

  const markAsReturned = async (id) => {
    try {
      await API.post(`/demo-returns/return/${id}`);
      toast.success("✅ Item marked as returned!");
      fetchDemoItems(); // Refresh list
    } catch (err) {
      console.error("❌ Return failed:", err);
      toast.error("❌ Failed to mark item as returned.");
    }
  };

  useEffect(() => {
    fetchDemoItems();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <span role="img" aria-label="icon" className="mr-2">
          📦
        </span>
        Pending Demo Returns
      </h2>

      <div className="overflow-x-auto shadow rounded">
        <table className="w-full table-auto border border-gray-300">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="p-2 border">Item</th>
              <th className="p-2 border">Model No</th>
              <th className="p-2 border">Warehouse</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Out Date</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  ⏳ Loading...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No pending demo returns.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{item.item?.name}</td>
                  <td className="p-2 border">{item.item?.modelNo}</td>
                  <td className="p-2 border">{item.warehouse?.name}</td>
                  <td className="p-2 border">{item.quantity}</td>
                  <td className="p-2 border">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => markAsReturned(item._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">
                      Return
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
