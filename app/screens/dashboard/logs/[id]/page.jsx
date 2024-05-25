"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useRouter
import Head from "next/head";
import { getSalesById } from "@/app/api/sales";
import { getItemById } from "@/app/api/items";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import { RevolvingDot } from "react-loader-spinner"; // Import RevolvingDot

// Function to format the date
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
  };
  return date.toLocaleString("en-US", options);
};

const formatTime = (timeStr) => {
  const date = new Date(timeStr);
  const options = {
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return date.toLocaleString("en-US", options);
};

export default function Page() {
  const params = useParams();
  const { id } = params;
  const router = useRouter(); // Initialize useRouter
  const [sale, setSale] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(null);

  useEffect(() => {
    const fetchSaleData = async () => {
      try {
        const fetchedSale = await getSalesById({ id });
        setSale(fetchedSale.sale);
        setDate(fetchedSale.sale.time_added);

        const itemIds = fetchedSale.sale.sales.map((saleItem) => saleItem.item);

        const fetchedItems = await Promise.all(
          itemIds.map((itemId) => getItemById({ id: itemId }))
        );

        setItems(fetchedItems);
        setLoading(false);
      } catch (error) {
        toast.error("Error");
        setLoading(false);
      }
    };

    fetchSaleData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <RevolvingDot height="100" width="100" color="#4CAF50" />
      </div>
    );
  }

  if (!sale) {
    return <p>No data available</p>;
  }

  return (
    <div className="flex flex-col p-4 items-start h-screen overflow-y-auto">
      <Head>
        <title>Welcome to Next.js</title>
        <meta
          name="description"
          content="Welcome to Next.js - A framework for building modern web applications"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex w-full justify-between mb-4">
        <div className="flex items-center">
          <button
            onClick={() => router.back()} // Go back to the previous page
            className="mr-2"
          >
            <ArrowLeftCircleIcon className="h-8 w-8 text-blue-500" />
          </button>
          <h1 className="text-4xl font-bold">Sales Details</h1>
        </div>
      </div>

      <div className="user-info mb-6 w-full">
        <h2 className="text-2xl font-semibold">User: {sale.user}</h2>
        <p>Total Sales: {sale.total}</p>
        <p className="font-bold">
          Day: <span className="font-thin">{formatDate(date)}</span>
        </p>
        <p className="font-bold">
          Time: <span className="font-thin">{formatTime(date)}</span>
        </p>
      </div>

      <div className="sales-data w-full mb-8">
        <h3 className="text-xl font-semibold mb-4">Sales Data:</h3>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Item Name</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Cost</th>
            </tr>
          </thead>
          <tbody>
            {sale.sales.map((saleItem, index) => {
              const item = items[index].item;
              return (
                <tr key={saleItem._id}>
                  <td className="border px-4 py-2">{item.name}</td>
                  <td className="border px-4 py-2">{saleItem.quantity}</td>
                  <td className="border px-4 py-2">{item.sellingPrice}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className="w-full">
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Next.js Example
        </p>
      </footer>
      <Toaster />
    </div>
  );
}
