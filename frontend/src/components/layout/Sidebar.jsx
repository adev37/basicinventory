import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import SidebarDropdown from "./SidebarDropdown";

// Lucide icons
import {
  LayoutDashboard,
  PackageSearch,
  Warehouse,
  PackagePlus,
  MoveHorizontal,
  History,
  CornerDownLeft,
  BarChart2,
  LogOut,
  List,
  PlusCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  Repeat,
  FileText,
  FilePlus2,
  Undo2,
  Boxes,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const linkStyle =
    "flex items-center gap-2 px-4 py-2 hover:bg-blue-100 transition-colors rounded";
  const activeStyle = "bg-blue-500 text-white";

  return (
    <div className="w-64 h-screen bg-white border-r shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-6 text-blue-800 flex items-center gap-2">
          <PackageSearch className="w-6 h-6 text-blue-600" />
          Inventory App
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

          {/* Inventory */}
          <SidebarDropdown
            icon={<PackagePlus className="w-5 h-5" />}
            title="Inventory">
            <NavLink
              to="/items"
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? activeStyle : ""}`
              }>
              <List className="w-4 h-4" />
              Item List
            </NavLink>
            <NavLink
              to="/add-item"
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? activeStyle : ""}`
              }>
              <PlusCircle className="w-4 h-4" />
              Add Item
            </NavLink>
            <NavLink
              to="/warehouses"
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? activeStyle : ""}`
              }>
              <Boxes className="w-4 h-4" />
              Warehouses
            </NavLink>
            <NavLink
              to="/add-warehouse"
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? activeStyle : ""}`
              }>
              <PlusCircle className="w-4 h-4" />
              Add Warehouse
            </NavLink>
          </SidebarDropdown>

          {/* Stock Movement */}
          <SidebarDropdown
            icon={<MoveHorizontal className="w-5 h-5" />}
            title="Stock Movement">
            <NavLink
              to="/stock-in"
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? activeStyle : ""}`
              }>
              <ArrowDownCircle className="w-4 h-4" />
              Stock In
            </NavLink>
            <NavLink
              to="/stock-out"
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? activeStyle : ""}`
              }>
              <ArrowUpCircle className="w-4 h-4" />
              Stock Out
            </NavLink>
          </SidebarDropdown>

          {/* Transfers */}
          <SidebarDropdown
            icon={<History className="w-5 h-5" />}
            title="Transfers">
            <NavLink
              to="/stock-transfer"
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? activeStyle : ""}`
              }>
              <Repeat className="w-4 h-4" />
              Initiate Transfer
            </NavLink>
            <NavLink
              to="/transfer-report"
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? activeStyle : ""}`
              }>
              <FileText className="w-4 h-4" />
              Transfer History
            </NavLink>
          </SidebarDropdown>

          {/* Returns */}
          <SidebarDropdown
            icon={<CornerDownLeft className="w-5 h-5" />}
            title="Returns">
            <NavLink
              to="/Add-demo-returns"
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? activeStyle : ""}`
              }>
              <FilePlus2 className="w-4 h-4" />
              Add Demo Return
            </NavLink>
            <NavLink
              to="/demo-returns"
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? activeStyle : ""}`
              }>
              <Undo2 className="w-4 h-4" />
              View Demo Returns
            </NavLink>
          </SidebarDropdown>

          {/* Reports */}
          <SidebarDropdown
            icon={<BarChart2 className="w-5 h-5" />}
            title="Reports">
            <NavLink
              to="/stock"
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? activeStyle : ""}`
              }>
              <Warehouse className="w-4 h-4" />
              Current Stock
            </NavLink>
            <NavLink
              to="/ledger"
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? activeStyle : ""}`
              }>
              <FileText className="w-4 h-4" />
              Stock Ledger
            </NavLink>
          </SidebarDropdown>
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4">
        <button
          onClick={logout}
          className="w-full text-left px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center gap-2">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
