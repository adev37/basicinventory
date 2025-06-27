import React, { useEffect, useState } from "react";
import API from "../../utils/axiosInstance";
import moment from "moment";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const StockLedger = () => {
  const [ledger, setLedger] = useState([]);
  const [filteredLedger, setFilteredLedger] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [warehouses, setWarehouses] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11;

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const res = await API.get("/stock-ledger");
        setLedger(res.data);
        setFilteredLedger(res.data);
      } catch (err) {
        console.error("Failed to load stock ledger:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchWarehouses = async () => {
      try {
        const res = await API.get("/warehouses");
        setWarehouses(res.data);
      } catch (err) {
        console.error("Error loading warehouses:", err);
      }
    };

    fetchLedger();
    fetchWarehouses();
  }, []);

  useEffect(() => {
    let filtered = [...ledger];

    if (searchText.trim()) {
      filtered = filtered.filter(
        (e) =>
          e.item?.name.toLowerCase().includes(searchText.toLowerCase()) ||
          e.item?.modelNo.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedWarehouse) {
      filtered = filtered.filter((e) => e.warehouse?._id === selectedWarehouse);
    }

    if (selectedAction) {
      filtered = filtered.filter((e) => e.action === selectedAction);
    }

    if (selectedPurpose) {
      filtered = filtered.filter((e) => e.purpose === selectedPurpose);
    }

    setFilteredLedger(filtered);
    setCurrentPage(1);
  }, [searchText, selectedWarehouse, selectedAction, selectedPurpose, ledger]);

  const resetFilters = () => {
    setSearchText("");
    setSelectedWarehouse("");
    setSelectedAction("");
    setSelectedPurpose("");
    setCurrentPage(1);
  };

  const exportToExcel = () => {
    const dataToExport = filteredLedger.map((entry) => ({
      Date: moment(entry.date).format("DD-MM-YYYY"),
      Item: entry.item?.name || "-",
      "Model No.": entry.item?.modelNo || "-",
      Warehouse: entry.warehouse?.name || "-",
      Quantity: entry.quantity,
      Action: entry.action,
      Purpose: entry.purpose || "-",
      Remarks: entry.remarks || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Ledger");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "Stock_Ledger_Report.xlsx");
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredLedger.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredLedger.length / itemsPerPage);

  return (
    <div className="p-6 min-h-screen relative pb-24">
      <h2 className="text-2xl font-bold mb-4">
        📒 Stock Ledger (IN/OUT History)
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="🔍 Search Item or Model No."
          className="border px-3 py-2 rounded w-60"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          value={selectedWarehouse}
          onChange={(e) => setSelectedWarehouse(e.target.value)}
          className="border px-3 py-2 rounded w-60">
          <option value="">🏬 All Warehouses</option>
          {warehouses.map((wh) => (
            <option key={wh._id} value={wh._id}>
              {wh.name}
            </option>
          ))}
        </select>

        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="border px-3 py-2 rounded w-40">
          <option value="">🔃 All Actions</option>
          <option value="IN">IN</option>
          <option value="OUT">OUT</option>
        </select>

        <select
          value={selectedPurpose}
          onChange={(e) => setSelectedPurpose(e.target.value)}
          className="border px-3 py-2 rounded w-48">
          <option value="">🎯 All Purposes</option>
          <option value="Sale">Sale</option>
          <option value="Demo">Demo</option>
          <option value="Demo Return">Demo Return</option>
        </select>

        <button
          onClick={resetFilters}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded">
          🔄 Reset
        </button>

        <button
          onClick={exportToExcel}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          📄 Export to Excel
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow min-h-[400px]">
        {loading ? (
          <p className="p-6 text-blue-600">Loading stock ledger...</p>
        ) : currentItems.length === 0 ? (
          <p className="p-6 text-gray-500">No entries found.</p>
        ) : (
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Item</th>
                <th className="p-2 border">Model No.</th>
                <th className="p-2 border">Warehouse</th>
                <th className="p-2 border">Qty (+/-)</th>
                <th className="p-2 border">Action</th>
                <th className="p-2 border">Purpose</th>
                <th className="p-2 border">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((entry, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2 border">
                    {moment(entry.date).format("DD-MM-YYYY")}
                  </td>
                  <td className="p-2 border">{entry.item?.name || "-"}</td>
                  <td className="p-2 border">{entry.item?.modelNo || "-"}</td>
                  <td className="p-2 border">{entry.warehouse?.name || "-"}</td>
                  <td
                    className={`p-2 border font-semibold ${
                      entry.action === "OUT" ? "text-red-600" : "text-green-600"
                    }`}>
                    {entry.quantity}
                  </td>
                  <td className="p-2 border">{entry.action}</td>
                  <td className="p-2 border">{entry.purpose || "-"}</td>
                  <td className="p-2 border">{entry.remarks || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-50 bg-white px-4 py-2 shadow rounded">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}>
            ◀️ Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}>
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}>
            Next ▶️
          </button>
        </div>
      )}
    </div>
  );
};

export default StockLedger;
