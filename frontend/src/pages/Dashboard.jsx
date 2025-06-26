import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE", "#A28EFF"];

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [stockOut, setStockOut] = useState([]);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

  // ✅ Fetch current stock
  const fetchStocks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/stocks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStocks(res.data);
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  };

  // ✅ Fetch stock out records
  const fetchStockOuts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/stock-out", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStockOut(res.data);
    } catch (error) {
      console.error("Error fetching stock out:", error);
    }
  };

  useEffect(() => {
    fetchStocks();
    fetchStockOuts();
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  // ✅ Total stock quantity
  const totalQty = stocks.reduce((sum, s) => sum + s.quantity, 0);

  // ✅ Low stock items (uses lowAlert from item)
  const lowStockItems = stocks.filter(
    (s) => s.quantity <= (s.item?.lowAlert || 0)
  );

  // ✅ Bar Chart Data: Item vs Quantity
  const barData = stocks.map((s) => ({
    name: s.item?.name || "Unnamed",
    quantity: s.quantity,
  }));

  // ✅ Pie Chart: Purpose-wise count
  const purposeCounts = stockOut.reduce((acc, s) => {
    const purpose = s.purpose || "Unknown";
    acc[purpose] = (acc[purpose] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(purposeCounts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-1">📊 Inventory Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Welcome <strong>{user?.name}</strong> ({user?.role})
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Items" value={stocks.length} />
        <StatCard title="Total Stock" value={totalQty} />
        <StatCard title="Low Stock Items" value={lowStockItems.length} />
        <StatCard title="Stock Out Purpose" value={pieData.length} />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2">📦 Stock by Item</h2>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 italic">No stock data available</p>
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2">
            ⚠️ Stock Out by Purpose
          </h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#FF8042"
                  label>
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 italic">No purpose data found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// ✅ Mini Stat Card
const StatCard = ({ title, value }) => (
  <div className="bg-white rounded shadow p-4">
    <p className="text-gray-500 text-sm">{title}</p>
    <h3 className="text-3xl font-bold text-blue-600">{value}</h3>
  </div>
);
