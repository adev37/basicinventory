import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddSalesInvoice = ({ fetchInvoices }) => {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [deliveryChallans, setDeliveryChallans] = useState([]);
  const [selectedDC, setSelectedDC] = useState("");
  const [client, setClient] = useState(null);
  const [transport, setTransport] = useState("");
  const [items, setItems] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDeliveryChallans();
  }, []);

  const fetchDeliveryChallans = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/delivery-challans",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDeliveryChallans(res.data);
    } catch (err) {
      toast.error("❌ Failed to fetch Delivery Challans");
    }
  };

  const handleDCChange = (e) => {
    const dcId = e.target.value;
    setSelectedDC(dcId);

    const dc = deliveryChallans.find((d) => d._id === dcId);
    if (dc) {
      setClient(dc.client);
      setTransport(dc.transportDetails);
      const mappedItems = dc.items.map((i) => ({
        item: i.item._id,
        name: i.item.name,
        quantity: i.quantity,
        price: i.item.pricePerUnit || 0,
      }));
      setItems(mappedItems);
    } else {
      setClient(null);
      setTransport("");
      setItems([]);
    }
  };

  const handleSubmit = async () => {
    if (!invoiceNumber || !selectedDC || items.length === 0) {
      return toast.error("❌ All fields are required");
    }

    try {
      const payload = {
        invoiceNumber,
        deliveryChallan: selectedDC,
      };

      await axios.post("http://localhost:5000/api/sales-invoices", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ Sales Invoice Created");
      setInvoiceNumber("");
      setSelectedDC("");
      setClient(null);
      setTransport("");
      setItems([]);
      fetchInvoices && fetchInvoices();
    } catch (err) {
      toast.error("❌ Error creating invoice");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        📄 Add Sales Invoice
      </h2>

      {/* Invoice Number */}
      <input
        type="text"
        className="w-full border p-2 mb-4 rounded"
        placeholder="Invoice Number"
        value={invoiceNumber}
        onChange={(e) => setInvoiceNumber(e.target.value)}
      />

      {/* Delivery Challan Dropdown */}
      <select
        className="w-full border p-2 mb-4 rounded"
        value={selectedDC}
        onChange={handleDCChange}>
        <option value="">-- Select Delivery Challan --</option>
        {deliveryChallans.map((dc) => (
          <option key={dc._id} value={dc._id}>
            {dc.dcNumber || dc._id.slice(0, 8)} – {dc.client?.companyName}
          </option>
        ))}
      </select>

      {/* Client Info */}
      {client && (
        <div className="mb-4">
          <p className="font-semibold text-gray-700">Client:</p>
          <p className="ml-2 text-gray-800">{client.companyName}</p>
        </div>
      )}

      {/* Transport Info */}
      {transport && (
        <div className="mb-4">
          <p className="font-semibold text-gray-700">Transport:</p>
          <p className="ml-2 text-gray-800">{transport}</p>
        </div>
      )}

      {/* Item Table */}
      {items.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Items</h4>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">Item</th>
                <th className="border p-2 text-left">Quantity</th>
                <th className="border p-2 text-left">Rate (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{i.name}</td>
                  <td className="border p-2">{i.quantity}</td>
                  <td className="border p-2">₹{i.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        Create Invoice
      </button>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddSalesInvoice;
