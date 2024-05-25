// components/ItemModal.js
import React, { useState, useEffect } from "react";

const mainCategories = ["Food", "Drinks"];
const subCategories = {
  Drinks: ["Liquor", "Beer", "Soft Drink", "Wine", "Bitters", "Others"],
  Food: ["Carbohydrate", "Protein", "Side"],
};

export const ItemModal = ({ isOpen, onClose, onSave, item, mode }) => {
  const [name, setName] = useState("");
  const [storeQuantity, setQuantity] = useState(0);
  const [barQuantity, setBarQuantity] = useState(0);
  const [costPrice, setCostPrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [mainCategory, setMainCategory] = useState(mainCategories[0]);
  const [subCategory, setSubCategory] = useState("");

  useEffect(() => {
    if (mode === "edit" && item) {
      item.storeQuantity = Number(item.storeQuantity);
      setName(item.name);
      setQuantity(item.storeQuantity);
      setBarQuantity(item.BarModalQuantity || 0);
      setMainCategory(item.mainCategory);
      setCostPrice(item.costPrice);
      setSellingPrice(item.sellingPrice);
    } else {
      setName("");
      setQuantity(0);
      setBarQuantity(0);
      setCostPrice(0);
      setSellingPrice(0);
      setMainCategory(mainCategories[0]);
      setSubCategory("");
    }
  }, [mode, item]);

  useEffect(() => {
    if (mainCategory) {
      setSubCategory(subCategories[mainCategory][0]);
    }
  }, [mainCategory]);

  const handleSave = () => {
    const newItem = {
      _id: item ? item._id : null,
      name,
      storeQuantity: mainCategory === "Food" ? null : storeQuantity,
      barQuantity: barQuantity != null ? barQuantity : null,
      costPrice,
      sellingPrice,
      mainCategory,
      subCategory,
    };
    onSave(newItem);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">
          {mode === "add" ? "Add Item" : "Edit Item"}
        </h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          {mode === "add" && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Main Category
                </label>
                <select
                  value={mainCategory}
                  onChange={(e) => setMainCategory(e.target.value)}
                  className="border p-2 w-full"
                >
                  {mainCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Subcategory</label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="border p-2 w-full"
                >
                  {subCategories[mainCategory].map((subCat) => (
                    <option key={subCat} value={subCat}>
                      {subCat}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {mainCategory !== "Food" && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                value={storeQuantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="border p-2 w-full"
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Cost Price</label>
            <input
              type="number"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Selling Price</label>
            <input
              type="number"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              className="border p-2 w-full"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const UserModal = ({
  isOpen,
  onClose,
  onSave,
  user,
  setUser,
  mode,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  const handleSave = () => {
    console.log("New user data:", user);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className={`bg-white p-6 rounded shadow-lg w-96 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">
          {mode === "add" ? "Add User" : "Edit User"}
        </h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="w-full px-4 py-2 border rounded mb-2 text-black"
          />
          <input
            type="text"
            placeholder="Username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            className="w-full px-4 py-2 border rounded mb-2 text-black"
          />
          <input
            type="text"
            placeholder="Password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="w-full px-4 py-2 border rounded mb-2 text-black"
          />

          <select
            value={user.position}
            onChange={(e) => setUser({ ...user, position: e.target.value })}
            className="w-full px-4 py-2 border rounded text-black"
          >
            {/* Default "Select Position" option */}
            <option value="" className="text-gray">
              Select Position
            </option>
            <option value="manager">Manager</option>
            <option value="bar-man">Bar man</option>
            <option value="staff">Staff</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export const BarModal = ({ isOpen, onClose, onSave, item }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (item) {
      setName(item.name || "");
    }
  }, [item]);

  const handleSave = () => {
    const newItem = {
      _id: item._id,
      name,
      quantity: Number(quantity), // Ensure quantity is a number
    };
    onSave(newItem);
    onClose(); // Close the modal after saving
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">Add to bar</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full"
            readOnly // Make it read-only since we're just displaying the name
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border p-2 w-full"
            min="1" // Ensure quantity is greater than 0
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
