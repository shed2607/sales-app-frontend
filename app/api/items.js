const url = "https://us-central1-sales-app-3753e.cloudfunctions.net/api";
const getToken = () => sessionStorage.getItem("userToken");

export const getAllItems = async () => {
  const token = getToken();
  try {
    const response = await fetch(url + "/items/get", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(error);
      throw new Error(error.error);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createItem = async (itemData) => {
  const token = getToken();
  try {
    const response = await fetch(url + "/items/additem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(error);
      throw new Error(error.error || "Failed to add items");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const editItem = async (itemdata) => {
  const token = getToken();
  try {
    const response = await fetch(url + "/items/edititem", {
      method: "PUT", // Assuming your server expects a PUT request for editing user
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(itemdata),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(error);
      throw new Error(error.error);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteItem = async (id) => {
  const token = getToken();
  try {
    console.log(`deleting ${id}`);
    const response = await fetch(url + "/items/deleteItem", {
      method: "DELETE", // Assuming your server expects a DELETE request for deleting
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete user");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to delete user");
  }
};

export const getItemById = async ({ id }) => {
  const token = getToken();
  try {
    const response = await fetch(url + "/items/getItemByID", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: id }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(error);
      throw new Error(error.error || "Failed to add items");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};
