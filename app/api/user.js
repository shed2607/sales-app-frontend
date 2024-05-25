const url = "https://us-central1-sales-app-3753e.cloudfunctions.net/api";

const getToken = () => sessionStorage.getItem("userToken");

export const getAllUsers = async () => {
  const token = getToken();
  try {
    const response = await fetch(url + "/user/all", {
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

export const editUser = async (userdata) => {
  const token = getToken();
  try {
    console.log(userdata);
    const response = await fetch(url + "/user/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userdata),
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

export const deleteUser = async (id) => {
  const token = getToken();
  try {
    const response = await fetch(url + "/user/delete", {
      method: "DELETE",
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

export const editStatusUser = async (id, status) => {
  const token = getToken();
  try {
    console.log(id + status);
    const response = await fetch(url + "/user/edit-status", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user status");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to update user status");
  }
};
