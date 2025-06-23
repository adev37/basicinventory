import React, { useEffect, useState } from "react";
import axios from "axios";

const DeliveryChallanList = () => {
  const [challans, setChallans] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/delivery-challans")
      .then((res) => setChallans(res.data))
      .catch((err) => console.error("Error loading challans:", err));
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Delivery Challans</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Client</th>
            <th className="border p-2">Items</th>
            <th className="border p-2">Transport</th>
            <th className="border p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {challans.map((dc) => (
            <tr key={dc._id}>
              <td className="border p-2">{dc.client?.name || "Unnamed"}</td>
              <td className="border p-2">
                <ul>
                  {dc.items.map((i) => (
                    <li key={i.item?._id}>
                      {i.item?.name} x {i.quantity}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="border p-2">{dc.transportDetails}</td>
              <td className="border p-2">
                {new Date(dc.date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryChallanList;
