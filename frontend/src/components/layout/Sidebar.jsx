import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import SidebarDropdown from "./SidebarDropdown";

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const linkStyle =
    "block px-4 py-2 rounded hover:bg-blue-100 transition-colors";
  const activeStyle = "bg-blue-500 text-white";

  return (
    <div className="w-64 h-screen bg-white border-r shadow-sm flex flex-col justify-between">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-6 text-blue-800">
          📊 Inventory App
        </h2>

        <nav className="space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkStyle} ${isActive ? activeStyle : ""}`
            }>
            🏠 Dashboard
          </NavLink>

          {/* 📦 Inventory */}
          <SidebarDropdown icon="📦" title="Inventory">
            <NavLink to="/items" className="block px-4 py-2 hover:bg-gray-100">
              📋 Item Master
            </NavLink>
            <NavLink
              to="/add-item"
              className="block px-4 py-2 hover:bg-gray-100">
              ➕ Add Item
            </NavLink>
            <NavLink
              to="/stock-adjustments"
              className="block px-4 py-2 hover:bg-gray-100">
              🛠️ Adjustment Report
            </NavLink>
            <NavLink
              to="/stock-adjustments/add"
              className="block px-4 py-2 hover:bg-gray-100">
              ⚙️ Stock Adjustments
            </NavLink>
            <NavLink to="/stock" className="block px-4 py-2 hover:bg-gray-100">
              📦 Current Stock
            </NavLink>
          </SidebarDropdown>

          {/* 👥 Masters */}
          <SidebarDropdown icon="👥" title="Masters">
            <NavLink
              to="/clients"
              className="block px-4 py-2 hover:bg-gray-100">
              👤 Clients
            </NavLink>
            <NavLink
              to="/vendors"
              className="block px-4 py-2 hover:bg-gray-100">
              🏢 Vendors
            </NavLink>
            <NavLink
              to="/add-unit"
              className="block px-4 py-2 hover:bg-gray-100">
              📏 Units
            </NavLink>
            <NavLink
              to="/add-category"
              className="block px-4 py-2 hover:bg-gray-100">
              📂 Categories
            </NavLink>
            {user?.role === "admin" && (
              <NavLink
                to="/admin/users"
                className="block px-4 py-2 hover:bg-gray-100">
                👁 Users
              </NavLink>
            )}
          </SidebarDropdown>

          {/* 📁 Purchase */}
          <SidebarDropdown icon="📁" title="Purchase">
            <NavLink
              to="/purchase-orders"
              className="block px-4 py-2 hover:bg-gray-100">
              📋 Purchase Orders
            </NavLink>
            <NavLink
              to="/purchase-orders/create"
              className="block px-4 py-2 hover:bg-gray-100">
              ➕ Create PO
            </NavLink>
            <NavLink
              to="/goods-receipt"
              className="block px-4 py-2 hover:bg-gray-100">
              📥 GRN / Goods Receipt
            </NavLink>
            <NavLink
              to="/goods-receipt/list"
              className="block px-4 py-2 hover:bg-gray-100">
              📋 GRN List
            </NavLink>
            <NavLink
              to="/purchase-returns/create"
              className="block px-4 py-2 hover:bg-gray-100">
              🔁 Purchase Returns
            </NavLink>
            <NavLink
              to="/purchase-returns"
              className="block px-4 py-2 hover:bg-gray-100">
              📋 Purchase Return List
            </NavLink>
            <NavLink
              to="/vendor-quotations"
              className="block px-4 py-2 hover:bg-gray-100">
              📄 Vendor Quotations
            </NavLink>
          </SidebarDropdown>

          {/* 📏 Sales */}
          <SidebarDropdown icon="📏" title="Sales">
            <NavLink
              to="/sales-orders"
              className="block px-4 py-2 hover:bg-gray-100">
              📃 Sales Orders
            </NavLink>
            <NavLink
              to="/sales-orders/create"
              className="block px-4 py-2 hover:bg-gray-100">
              ➕ Create Sales Order
            </NavLink>
            <NavLink
              to="/delivery-challans"
              className="block px-4 py-2 hover:bg-gray-100">
              🚚 Delivery Challans
            </NavLink>
            <NavLink
              to="/delivery-challans/create"
              className="block px-4 py-2 hover:bg-gray-100">
              ➕ Create Challan
            </NavLink>
            <NavLink
              to="/sales-invoices/add"
              className="block px-4 py-2 hover:bg-gray-100">
              📟 Sales Invoice
            </NavLink>
            <NavLink
              to="/sales-invoices"
              className="block px-4 py-2 hover:bg-gray-100">
              📋 Sales Invoice List
            </NavLink>
            <NavLink
              to="/sales-returns/create"
              className="block px-4 py-2 hover:bg-gray-100">
              🔁 Sales Returns
            </NavLink>
            <NavLink
              to="/sales-returns"
              className="block px-4 py-2 hover:bg-gray-100">
              📋 Sales Return List
            </NavLink>
          </SidebarDropdown>

          {/* 📊 Reports */}
          <SidebarDropdown icon="📊" title="Reports">
            <NavLink
              to="/reports/stock"
              className="block px-4 py-2 hover:bg-gray-100">
              📦 Stock Report
            </NavLink>
            <NavLink
              to="/reports/sales"
              className="block px-4 py-2 hover:bg-gray-100">
              📟 Sales Report
            </NavLink>
            <NavLink
              to="/reports/returns"
              className="block px-4 py-2 hover:bg-gray-100">
              🔁 Returns Report
            </NavLink>
          </SidebarDropdown>
        </nav>
      </div>

      {/* Logout */}
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
