import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SalesOrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchSalesOrders();
  }, []);

  const fetchSalesOrders = async () => {
    try {
      const response = await axios.get("/api/sales-orders"); // Update path as per your backend
      setOrders(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load sales orders");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">📃 Sales Orders</h2>

      <div className="overflow-x-auto border shadow rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 border">Order No.</th>
              <th className="px-4 py-3 border">Client</th>
              <th className="px-4 py-3 border">Order Date</th>
              <th className="px-4 py-3 border">Total Amount</th>
              <th className="px-4 py-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="px-4 py-2 border">{order.orderNumber}</td>
                <td className="px-4 py-2 border">{order.clientName}</td>
                <td className="px-4 py-2 border">
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border">₹{order.totalAmount}</td>
                <td className="px-4 py-2 border">
                  <span
                    className={`px-2 py-1 text-xs rounded font-medium ${
                      order.status === "Confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                  No sales orders available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesOrderList;
