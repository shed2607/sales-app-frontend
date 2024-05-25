"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSales, deleteSales } from "@/app/api/sales";
import toast, { Toaster } from "react-hot-toast";
import { validateUser } from "@/app/api/auth";

// Function to format the date
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return date.toLocaleString("en-US", options);
};

const SalesLogPage = () => {
  const router = useRouter();
  const [sales, setSalesLog] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const isAuthorized = await validateUser();
        if (!isAuthorized.authorizedUser) {
          toast.error("You are not authorized to view this page");
          router.push("/screens/dashboard/dashboard");
          return;
        }
      } catch (error) {
        toast.error("Failed to validate user");
        router.push("/screens/dashboard/dashboard");
      }
    };

    const fetchData = async () => {
      try {
        const fetchLogs = await getSales();
        setSalesLog(fetchLogs.sales);
      } catch (error) {
        toast.error(error.message);
      }
    };

    checkAuthorization();
    fetchData();
  }, [router]);

  // Function to filter sales by date range
  const filterSalesByDate = () => {
    return sales.filter((sale) => {
      const saleDate = new Date(sale.time_added);
      return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
    });
  };

  // Handle delete sale
  const handleDeleteSale = async (saleId) => {
    try {
      await deleteSales(saleId);
      setSalesLog(sales.filter((sale) => sale._id !== saleId));
      toast.success("Sale deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete sale:", error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Sales Log</h1>
      <div className="mb-4">
        <label htmlFor="startDate" className="mr-2">
          Start Date:
        </label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="endDate" className="mr-2">
          End Date:
        </label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
      </div>
      <table className="w-full border-collapse border border-gray-300 mb-4">
        <thead>
          <tr>
            <th className="p-3 border border-gray-300">User</th>
            <th className="p-3 border border-gray-300">Total</th>
            <th className="p-3 border border-gray-300">Time Added</th>
            <th className="p-3 border border-gray-300">Action</th>
          </tr>
        </thead>
        <tbody>
          {filterSalesByDate().map((sale) => (
            <tr key={sale._id} className="cursor-pointer">
              <td
                className="p-3 border border-gray-300"
                onClick={() =>
                  (window.location.href = `/screens/dashboard/logs/${sale._id}`)
                }
              >
                {sale.user}
              </td>
              <td className="p-3 border border-gray-300">{sale.total}</td>
              <td className="p-3 border border-gray-300">
                {formatDate(sale.time_added)}
              </td>
              <td className="p-3 border border-gray-300">
                <button
                  onClick={() => handleDeleteSale(sale._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Toaster />
    </div>
  );
};

export default SalesLogPage;
