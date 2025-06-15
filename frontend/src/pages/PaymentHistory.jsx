// src/pages/PaymentHistory.jsx
import { useState, useEffect } from "react";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch("http://localhost:5005/api/payments");
        const data = await response.json();
        setPayments(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payment history:", error);
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-lg mt-8">Loading payment records...</div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Payment Records</h2>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Order ID or User ID"
          className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="success">Success</option>
        </select>
        <select className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">All Methods</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-200 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">User ID</th>
              <th className="px-4 py-2 text-left">Amount (LKR)</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Method</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="border-t">
                <td className="px-4 py-2">{payment.orderId}</td>
                <td className="px-4 py-2">{payment.userId}</td>
                <td className="px-4 py-2">{payment.amount}</td>
                <td
                  className={`px-4 py-2 font-medium ${
                    payment.status === "success"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {payment.status}
                </td>
                <td className="px-4 py-2 capitalize">{payment.method}</td>
                <td className="px-4 py-2">
                  {new Date(payment.date).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
