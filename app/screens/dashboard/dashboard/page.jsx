"use client";
import React, { useState, useEffect } from "react";
import { DrinkCard, FoodCard } from "@/app/components/card";
import { PieChart } from "react-minimal-pie-chart";
import { getAllItems } from "@/app/api/items";
import { getAllUsers } from "@/app/api/user";
import Link from "next/link";
import { RevolvingDot } from "react-loader-spinner";

const Page = () => {
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const pieColors = [
    "#E38627",
    "#C13C37",
    "#6A2135",
    "#4CAF50",
    "#2196F3",
    "#8A2BE2",
    "#00FF00",
  ];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    console.log(token);
    const fetchData = async () => {
      try {
        const fetchedUsers = await getAllUsers(token);
        const fetchedItems = await getAllItems(token);

        setUsers(fetchedUsers);
        setItems(fetchedItems);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getActiveUsersCount = () => {
    return users.filter((user) => user.active).length;
  };

  const getInActiveUsersCount = () => {
    return users.filter((user) => !user.active).length;
  };

  const getTotalDrinkItemsCount = () => {
    return items
      .filter((item) => item.mainCategory === "Drinks")
      .reduce(
        (total, item) => total + (item.storeQuantity + item.barQuantity || 0),
        0
      );
  };

  const getDrinkSubCategories = () => {
    const subCategories = items
      .filter((item) => item.mainCategory === "Drinks")
      .map((item) => item.subCategory);
    return [...new Set(subCategories)];
  };

  const getFoodSubCategories = () => {
    const subCategories = items
      .filter((item) => item.mainCategory === "Food")
      .map((item) => item.subCategory);
    return [...new Set(subCategories)];
  };

  const getTotalItemsPerSubCategory = (subCategory) => {
    return items
      .filter((item) => item.subCategory === subCategory)
      .reduce(
        (total, item) => total + (item.storeQuantity + item.barQuantity || 0),
        0
      );
  };

  const getPieChartData = (subCategories) => {
    const colors = pieColors;
    return subCategories.map((subCategory, index) => {
      return {
        title: getTotalItemsPerSubCategory(subCategory),
        value: getTotalItemsPerSubCategory(subCategory),
        color: colors[index % colors.length],
      };
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <RevolvingDot height="100" width="100" color="#4CAF50" />
      </div>
    );
  }

  return (
    <div className="flex flex-col pt-4 items-center min-h-screen bg-gray-100 text-gray-900">
      <div className="w-full max-w-4xl p-4">
        <div className="w-full flex justify-between mb-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>

        <div className="w-full mb-4">
          <h2 className="text-2xl font-bold mb-2">Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded shadow-md bg-white">
              <h3 className="text-xl font-bold">Total Enabled Users</h3>
              <p>{getActiveUsersCount()}</p>
            </div>
            <div className="p-4 rounded shadow-md bg-white">
              <h3 className="text-xl font-bold">Total Drinks</h3>
              <p>{getTotalDrinkItemsCount()}</p>
            </div>
            {getInActiveUsersCount() > 0 && (
              <div className="p-4 rounded shadow-md bg-white">
                <h3 className="text-xl font-bold">Total Disabled Users</h3>
                <p>{getInActiveUsersCount()}</p>
              </div>
            )}

            <div className="col-span-2 p-4 rounded shadow-md bg-white">
              <h3 className="text-xl font-bold">Drink Distribution</h3>
              <div className="flex justify-evenly">
                <div>
                  <PieChart
                    className="size-40"
                    data={getPieChartData(getDrinkSubCategories())}
                    label={({ dataEntry }) => `${dataEntry.title}`}
                    labelStyle={{
                      fontSize: "10px",
                      fontFamily: "sans-serif",
                      fill: "white",
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  {getDrinkSubCategories().map((subCategory) => (
                    <div key={subCategory} className="w-full mb-4">
                      <p className="text-lg font-semibold">
                        {subCategory}:{" "}
                        {getTotalItemsPerSubCategory(subCategory)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mb-4">
          <Link href="/screens/dashboard/inventory">
            <h2 className="text-4xl font-bold mb-2">Drinks</h2>
          </Link>
          <div className="flex flex-wrap">
            {getDrinkSubCategories().map((subCategory) => (
              <div key={subCategory} className="w-full mb-4">
                <h3 className="text-xl font-bold">{subCategory}</h3>
                <div className="flex flex-wrap">
                  {items
                    .filter((item) => item.subCategory === subCategory)
                    .map((item) => (
                      <DrinkCard key={item._id} item={item} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full mb-4">
          <Link href="/screens/dashboard/inventory">
            <h2 className="text-4xl font-bold mb-2">Food</h2>
          </Link>
          <div className="flex flex-wrap">
            {getFoodSubCategories().map((subCategory) => (
              <div key={subCategory} className="w-full mb-4">
                <h3 className="text-xl font-bold">{subCategory}</h3>
                <div className="flex flex-wrap">
                  {items
                    .filter((item) => item.subCategory === subCategory)
                    .map((item) => (
                      <FoodCard key={item._id} item={item} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
