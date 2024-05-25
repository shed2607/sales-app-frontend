"use client";
import React, { useState, useEffect } from "react";
import { ItemModal, BarModal } from "@/app/components/model"; // Ensure the correct import path for the modal component
import { getAllItems, createItem, editItem, deleteItem } from "@/app/api/items";
import toast, { Toaster } from "react-hot-toast";
import { validateUser } from "@/app/api/auth"; // Ensure correct import path for the validateUser function

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentItem, setCurrentItem] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [sortCriteria, setSortCriteria] = useState(""); // Sort criteria state
  const [sortOrder, setSortOrder] = useState("asc"); // Sort order state
  const [barModelOpen, setBarModelOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedItems = await getAllItems();
        setItems(fetchedItems);
      } catch (error) {
        toast.error("Items", error);
        // Handle error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const response = await validateUser();
        setAuthorized(response.authorizedUser);
      } catch (error) {
        console.error("Failed to validate user:", error);
      }
    };
    checkAuthorization();
  }, []);

  const handleAddItem = () => {
    setCurrentItem(null);
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleEditItem = (item) => {
    setCurrentItem(item);
    console.log(item);
    setEditId(item._id);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleBar = (item) => {
    setCurrentItem(item);
    setEditId(item._id);
    setModalMode("bar");
    setBarModelOpen(true);
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteItem(id);
      setItems(items.filter((i) => i._id !== id));
      toast.success("Item deleted successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSaveItem = async (item) => {
    if (modalMode === "add") {
      try {
        const createdItem = await createItem(item);
        setItems([...items, { ...createdItem }]);
        toast.success("Item added successfully!");
      } catch (error) {
        toast.error(error.message);
      }
    } else if (modalMode === "edit") {
      try {
        item._id = editId;
        await editItem(item);
        setItems(items.map((i) => (i._id === editId ? { ...i, ...item } : i)));
        toast.success("Item edited");
      } catch (error) {
        toast.error(error.message);
      }
    } else if (modalMode === "bar") {
      try {
        const updatedItem = { ...items.find((i) => i._id === editId) }; // Find the item to update
        item.quantity = Number(item.quantity);
        if (updatedItem.storeQuantity === 0) {
          toast.error("Cannot add to bar. Store quantity is 0.");
          return;
        }
        if (item.quantity > updatedItem.storeQuantity) {
          toast.error("Not enough items in store to add to bar.");
          return;
        }
        updatedItem.storeQuantity -= item.quantity;
        updatedItem.barQuantity += item.quantity; // Only update barQuantity
        await editItem(updatedItem);
        setItems(items.map((i) => (i._id === editId ? updatedItem : i)));
        toast.success("Bar quantity edited");
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while editing the bar quantity.");
      }
    }
    setIsModalOpen(false);
    setBarModelOpen(false);
  };

  // Filter and sort items based on search query and sorting criteria
  const filteredItems = items
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subCategory.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortCriteria === "name") {
        if (sortOrder === "asc") {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      } else if (sortCriteria === "cost-price") {
        if (sortOrder === "asc") {
          return a.costPrice - b.costPrice;
        } else {
          return b.costPrice - a.costPrice;
        }
      } else if (sortCriteria === "selling-price") {
        if (sortOrder === "asc") {
          return a.sellingPrice - b.sellingPrice;
        } else {
          return b.sellingPrice - a.sellingPrice;
        }
      }
      return 0;
    });

  const drinkItems = filteredItems.filter(
    (item) => item.mainCategory === "Drinks"
  );
  const foodItems = filteredItems.filter(
    (item) => item.mainCategory === "Food"
  );

  return (
    <div className="flex flex-col p-4 items-start h-screen overflow-y-auto">
      <div className="flex w-full justify-between mb-4">
        <h1 className="text-4xl font-bold">Inventory</h1>
        {authorized && (
          <button
            onClick={handleAddItem}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Item
          </button>
        )}
      </div>

      <div className="w-full mb-8">
        <input
          type="text"
          placeholder="Search by name or subcategory"
          className="w-full p-2 border rounded mb-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex justify-between mb-4">
          <div>
            <label htmlFor="sortCriteria" className="mr-2">
              Sort By:
            </label>
            <select
              id="sortCriteria"
              value={sortCriteria}
              onChange={(e) => setSortCriteria(e.target.value)}
              className="p-2 border rounded mr-2"
            >
              <option value="">Select</option>
              <option value="name">Name</option>
              <option value="cost-price">Cost Price</option>
              <option value="selling-price">Selling Price</option>
            </select>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <h2 className="text-4xl font-bold mb-2">Drinks</h2>
        <table className="min-w-full bg-white border">
          <thead className="border px-4 py-2">
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Store</th>
              <th className="border px-4 py-2">Bar</th>
              <th className="border px-4 py-2">Cost Price</th>
              <th className="border px-4 py-2">Selling Price</th>
              <th className="border px-4 py-2">Subcategory</th>
              {authorized && <th className="border px-4 py-2">Actions</th>}
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td>Loading....</td>
                <td>Loading....</td>
                <td>Loading....</td>
                <td>Loading....</td>
                <td>Loading....</td>
                <td>Loading....</td>
                {authorized && <td>Loading....</td>}
              </tr>
            </tbody>
          ) : (
            <tbody>
              {drinkItems.map((item) => (
                <tr key={item._id}>
                  <td className="border px-4 py-2">{item.name}</td>
                  <td className="border px-4 py-2">{item.storeQuantity}</td>
                  <td className="border px-4 py-2">{item.barQuantity || 0}</td>
                  <td className="border px-4 py-2">&#8358; {item.costPrice}</td>
                  <td className="border px-4 py-2">
                    &#8358; {item.sellingPrice}
                  </td>
                  <td className="border px-4 py-2">{item.subCategory}</td>
                  {authorized && (
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          handleBar(item);
                        }}
                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Add to bar
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      <div className="w-full">
        <h2 className="text-4xl font-bold mb-2">Food</h2>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Cost Price</th>
              <th className="border px-4 py-2">Selling Price</th>
              <th className="border px-4 py-2">Subcategory</th>
              {authorized && <th className="border px-4 py-2">Actions</th>}
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td>Loading....</td>
                <td>Loading....</td>
                <td>Loading....</td>
                <td>Loading....</td>
                {authorized && <td>Loading....</td>}
              </tr>
            </tbody>
          ) : (
            <tbody>
              {foodItems.map((item) => (
                <tr key={item._id}>
                  <td className="border px-4 py-2">{item.name}</td>
                  <td className="border px-4 py-2">&#8358; {item.costPrice}</td>
                  <td className="border px-4 py-2">
                    &#8358; {item.sellingPrice}
                  </td>
                  <td className="border px-4 py-2">{item.subCategory}</td>
                  {authorized && (
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {isModalOpen && (
        <ItemModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveItem}
          item={currentItem}
          mode={modalMode}
        />
      )}
      {barModelOpen && (
        <BarModal
          isOpen={barModelOpen}
          onClose={() => setBarModelOpen(false)}
          onSave={handleSaveItem}
          item={currentItem}
        />
      )}
      <Toaster />
    </div>
  );
};

export default Inventory;
