// api.js
const url = "https://us-central1-sales-app-3753e.cloudfunctions.net/api";
const getToken = () => sessionStorage.getItem("userToken");
export const loginUser = async (username, password) => {
  try {
    const response = await fetch(url + "/auth/loginUser", {
      // mode: "no-cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
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

export const createUser = async (userData) => {
  const token = getToken();
  try {
    const response = await fetch(url + "/auth/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(error);
      throw new Error(error.error || "Failed to create user");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const validateUser = async () => {
  const token = getToken();
  try {
    const response = await fetch(url + "/auth/userType", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(error);
      throw new Error(error.error || "Failed to validate user");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error validating user:", error);
    throw error;
  }
};
