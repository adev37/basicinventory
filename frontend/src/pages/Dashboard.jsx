import React, { useEffect, useState } from "react";
import API from "../utils/axiosInstance";
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
  const [user, setUser] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [stockOut, setStockOut] = useState([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalStock: 0,
    lowStockItems: 0,
  });
  const [saleOutCount, setSaleOutCount] = useState(0);
  const [demoPendingCount, setDemoPendingCount] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
    fetchDashboardStats();
    fetchStocks();
    fetchStockOuts();
    fetchDemoPendingReturns();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await API.get("/current-stock/summary");
      setStats((prev) => ({
        ...prev,
        totalItems: res.data.totalItems,
        totalStock: res.data.totalStock,
      }));
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    }
  };

  const fetchStocks = async () => {
    try {
      const res = await API.get("/current-stock");
      setStocks(res.data);

      // ✅ Low Stock Logic: any item < 5 units
      const low = res.data.filter((s) => s.quantity < 5).length;
      setStats((prev) => ({
        ...prev,
        lowStockItems: low,
      }));
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  };

  const fetchStockOuts = async () => {
    try {
      const res = await API.get("/stock-out");
      setStockOut(res.data);
      const saleCount = res.data.filter((s) => s.purpose === "Sale").length;
      setSaleOutCount(saleCount);
    } catch (error) {
      console.error("Error fetching stock out:", error);
    }
  };

  const fetchDemoPendingReturns = async () => {
    try {
      const res = await API.get("/demo-returns");
      setDemoPendingCount(res.data.length);
    } catch (error) {
      console.error("Error fetching demo pending returns:", error);
    }
  };

  const barData = stocks.map((s) => ({
    name:
      s.item && s.item.name ? `${s.item.name} (${s.item.modelNo})` : "Unnamed",
    quantity: s.quantity,
  }));

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

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <StatCard title="Total Items" value={stats.totalItems} />
        <StatCard title="Total Stock" value={stats.totalStock} />
        <StatCard title="Low Stock Items" value={stats.lowStockItems} />
        <StatCard title="Stock Out (Sale)" value={saleOutCount} />
        <StatCard title="Demo Pending Return" value={demoPendingCount} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
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

const StatCard = ({ title, value }) => (
  <div className="bg-white rounded shadow p-4">
    <p className="text-gray-500 text-sm">{title}</p>
    <h3 className="text-3xl font-bold text-blue-600">{value}</h3>
  </div>
);
