const url = "https://us-central1-sales-app-3753e.cloudfunctions.net/api";
const getToken = () => sessionStorage.getItem("userToken");

export const enterSales = async (salesData) => {
  const token = getToken();
  try {
    const response = await fetch(url + "/sales/enterSales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(salesData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(error);
      throw new Error(error.error || "Failed to add items");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error entering:", error);
    throw error;
  }
};

export const getSales = async () => {
  const token = getToken();
  try {
    const response = await fetch(url + "/sales/getSales", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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

export const getSalesById = async ({ id }) => {
  const token = getToken();
  try {
    const response = await fetch(url + "/sales/getSalesById", {
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

export const deleteSales = async (id) => {
  const token = getToken();
  try {
    const response = await fetch(url + "/sales/deleteSales", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete Sales");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to delete Sales");
  }
};
