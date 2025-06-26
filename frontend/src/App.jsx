// src/App.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./components/layout/Layout";
import PrivateRoute from "./components/PrivateRoute";

// Auth Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Protected Pages
import Dashboard from "./pages/Dashboard";
import ItemList from "./pages/items/ItemList";
import AddItem from "./pages/items/AddItem";
import WarehouseList from "./pages/warehouses/WarehouseList";
import AddWarehouse from "./pages/warehouses/AddWarehouse";
import StockIn from "./pages/stock/AddStockIn";
import StockOut from "./pages/stock/AddStockOut";
import CurrentStock from "./pages/reports/CurrentStock";
import StockLedger from "./pages/reports/StockLedger";
import DemoReturns from "./pages/demo/ViewDemoReturns";
import AddDemoItems from "./pages/demo/AddDemoItems";
import ViewDemoReturns from "./pages/demo/ViewDemoReturns";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token) setIsAuthenticated(true);
    if (userData) setUser(JSON.parse(userData));
    setLoading(false);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <p className="text-blue-500 text-lg animate-pulse">Loading app...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={<Layout handleLogout={handleLogout} user={user} />}
            />
          }>
          <Route index element={<Dashboard />} />
          <Route path="items" element={<ItemList />} />
          <Route path="add-item" element={<AddItem />} />
          <Route path="warehouses" element={<WarehouseList />} />
          <Route path="add-warehouse" element={<AddWarehouse />} />
          <Route path="stock-in" element={<StockIn />} />
          <Route path="stock-out" element={<StockOut />} />
          <Route path="stock" element={<CurrentStock />} />
          <Route path="ledger" element={<StockLedger />} />
          <Route path="demo-returns" element={<ViewDemoReturns />} />
          <Route path="Add-demo-returns" element={<AddDemoItems />} />{" "}
          {/* ✅ FIXED */}
        </Route>

        {/* Catch-All */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
