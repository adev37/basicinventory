import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import SidebarDropdown from "./SidebarDropdown";

// Lucide icons
import { LayoutDashboard, Boxes, MoveRight, Undo2, BarChart } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const linkStyle = "block px-4 py-2 hover:bg-blue-100 transition-colors";
  const activeStyle = "bg-blue-500 text-white";

  return (
    <div className="w-64 h-screen bg-white border-r shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-6 text-blue-800 flex items-center gap-2">
          <Boxes className="w-6 h-6 text-blue-600" />
          StockFlow Tracker
        </h2>

        <nav className="space-y-2">
          {/* Dashboard */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-100 transition-colors ${
                isActive ? activeStyle : ""
              }`
            }>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </NavLink>

          {/* Inventory Dropdown */}
          <SidebarDropdown icon={<Boxes className="w-5 h-5" />} title="Inventory">
            <NavLink to="/items" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ""}`}>
              📋 Items List
            </NavLink>
            <NavLink to="/add-item" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ""}`}>
              ➕ Add Item
            </NavLink>
            <NavLink to="/warehouses" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ""}`}>
              🏬 Warehouses
            </NavLink>
            <NavLink to="/add-warehouse" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ""}`}>
              ➕ Add Warehouse
            </NavLink>
          </SidebarDropdown>

          {/* Stock Movement Dropdown */}
          <SidebarDropdown icon={<MoveRight className="w-5 h-5" />} title="Stock Movement">
            <NavLink to="/stock-in" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ""}`}>
              📥 Stock In
            </NavLink>
            <NavLink to="/stock-out" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ""}`}>
              📤 Stock Out
            </NavLink>
          </SidebarDropdown>

          {/* Returns Dropdown */}
          <SidebarDropdown icon={<Undo2 className="w-5 h-5" />} title="Returns">
            <NavLink to="/Add-demo-returns" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ""}`}>
              🔁 Add Demo Return
            </NavLink>
            <NavLink to="/demo-returns" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ""}`}>
              🔁 View Returns
            </NavLink>
          </SidebarDropdown>

          {/* Reports Dropdown */}
          <SidebarDropdown icon={<BarChart className="w-5 h-5" />} title="Reports">
            <NavLink to="/stock" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ""}`}>
              📦 Current Stock
            </NavLink>
            <NavLink to="/ledger" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ""}`}>
              📜 Stock Ledger
            </NavLink>
          </SidebarDropdown>
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4">
        <button
          onClick={logout}
          className="w-full text-left px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200">
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
