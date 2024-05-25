"use client";
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { getAllItems } from "@/app/api/items";
import { getAllUsers } from "@/app/api/user";
import { enterSales } from "@/app/api/sales";

const Loading = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <h2 className="text-xl font-semibold">Loading....</h2>
  </div>
);

const Sales = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Placeholder data for available items
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        const fetchedItems = await getAllItems();

        setUsers(fetchedUsers);
        setAvailableItems(fetchedItems);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  });

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleItemChange = (index, e) => {
    const selectedItem = availableItems.find(
      (item) => item._id === e.target.value
    );
    const updatedSelectedItems = [...selectedItems];
    updatedSelectedItems[index] = { ...selectedItem, quantity: 0 }; // Initialize quantity to 0
    setSelectedItems(updatedSelectedItems);
  };

  const handleQuantityChange = (index, e) => {
    const updatedSelectedItems = [...selectedItems];
    updatedSelectedItems[index].quantity = parseInt(e.target.value) || 0; // Ensure quantity is at least 0
    setSelectedItems(updatedSelectedItems);
  };

  const handleAddItem = () => {
    const newItem = { ...availableItems[0], quantity: 0 }; // Add the first available item with quantity 0
    setSelectedItems([...selectedItems, newItem]);
  };

  const handleRemoveItem = (index) => {
    const updatedSelectedItems = [...selectedItems];
    updatedSelectedItems.splice(index, 1);
    setSelectedItems(updatedSelectedItems);
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => {
      return total + (item.quantity * item.sellingPrice || 0);
    }, 0);
  };

  const handleSubmit = async () => {
    try {
      // Check if user is selected
      if (!selectedUser) {
        toast.error("Please select a user");
        return;
      }

      // Check if any sale quantity is less than zero
      if (selectedItems.some((item) => item.quantity < 0)) {
        toast.error("Sale quantity cannot be negative");
        return;
      }

      // Check if there are any items selected for sale
      if (selectedItems.length === 0) {
        toast.error("Please select at least one item for sale");
        return;
      }

      // Calculate total for each item
      const updatedSales = selectedItems.map((item) => ({
        item,
        quantity: item.quantity,
        total: item.quantity * item.sellingPrice,
      }));

      // Calculate the final total sales
      const finalTotal = updatedSales.reduce(
        (acc, sale) => acc + sale.total,
        0
      );

      const logData = {
        user:
          users.find((user) => user._id === selectedUser)?.name || "Unknown",
        sales: updatedSales.map(({ item, quantity }) => ({
          item: { _id: item._id, name: item.name },
          quantity,
        })),
        total: finalTotal,
      };

      await enterSales(logData);

      // Log the user name and sales information
      console.log(logData);
      toast.success("Sales saved");

      // Reset selected items
      setSelectedItems([]);
      setSelectedUser("");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Enter Sales</h1>
      <div className="flex mb-4">
        <label htmlFor="user" className="mr-2">
          Select User:
        </label>
        {loading ? (
          <Loading />
        ) : (
          <select
            id="user"
            value={selectedUser}
            onChange={handleUserChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <table className="w-full border-collapse border border-gray-300 mb-4">
        <thead>
          <tr>
            <th className="p-3 border border-gray-300">Item Name</th>
            <th className="p-3 border border-gray-300">Quantity</th>
            <th className="p-3 border border-gray-300">Price</th>
            <th className="p-3 border border-gray-300">Total</th>
            <th className="p-3 border border-gray-300">Action</th>
          </tr>
        </thead>
        <tbody>
          {selectedItems.map((item, index) => (
            <tr key={index}>
              <td className="p-3 border border-gray-300">
                <select
                  value={item._id}
                  onChange={(e) => handleItemChange(index, e)}
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Item</option>
                  {availableItems.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-3 border border-gray-300">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </td>
              <td className="p-3 border border-gray-300">
                {item.sellingPrice || 0}
              </td>
              <td className="p-3 border border-gray-300">
                {item.quantity * item.sellingPrice || 0}
              </td>
              <td className="p-3 border border-gray-300">
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td className="p-3 border border-gray-300">Total Sales</td>
            <td className="p-3 border border-gray-300"></td>
            <td className="p-3 border border-gray-300"></td>
            <td className="p-3 border border-gray-300">
              {calculateTotal(selectedItems)}
            </td>
            <td className="p-3 border border-gray-300"></td>
          </tr>
        </tbody>
      </table>
      <button
        onClick={handleAddItem}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
      >
        Add Item
      </button>
      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
      <Toaster />
    </div>
  );
};

export default Sales;
