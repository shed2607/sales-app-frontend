import React from "react";

const DrinkCard = ({ item }) => {
  return (
    <div className="rounded-lg shadow-md p-4 m-2 bg-white text-gray-900">
      <h2 className="text-xl font-bold">{item.name}</h2>
      <div className="flex justify-evenly">
        <div className="mr-4 border-r-2 pr-4">
          <p>Quantity: {item.storeQuantity + item.barQuantity}</p>
          <p>Price: &#8358; {item.sellingPrice}</p>
        </div>
        <div className="mr-4 border-r-2 pr-4">
          <p>Store: {item.storeQuantity}</p>
          <p>Bar: {item.barQuantity}</p>
        </div>
      </div>
    </div>
  );
};

const FoodCard = ({ item }) => {
  return (
    <div className="rounded-lg shadow-md p-4 m-2 bg-white text-gray-900">
      <h2 className="text-xl font-bold">{item.name}</h2>
      <p>Price: &#8358; {item.sellingPrice}</p>
    </div>
  );
};

export { FoodCard, DrinkCard };
