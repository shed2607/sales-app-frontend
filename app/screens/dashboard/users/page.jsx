"use client";
import React, { useState, useEffect } from "react";
import { UserModal } from "@/app/components/model";
import {
  getAllUsers,
  editUser,
  deleteUser,
  editStatusUser,
} from "@/app/api/user";
import { createUser, validateUser } from "@/app/api/auth";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const NoUserPage = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <h2 className="text-xl font-semibold">No users found!</h2>
    <p className="text-gray-600">Please add users to view them here.</p>
  </div>
);

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    password: "",
    position: "",
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        // Add your logic to validate user here
        const isAuthorized = await validateUser();
        if (!isAuthorized.authorizedUser) {
          toast.error("You are not authorized to view this page");
          router.push("/screens/dashboard/dashboard"); // Redirect to the dashboard if unauthorized
          return;
        }
      } catch (error) {
        toast.error("Failed to validate user");
        router.push("/screens/dashboard/dashboard"); // Redirect to the dashboard if there's an error
      }
    };

    const fetchData = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
    fetchData();
  }, [router]);

  const openAddUserModal = () => {
    setNewUser({ name: "", username: "", password: "", position: "" });
    setModalMode("add");
    setIsModalOpen(true);
  };

  const openEditUserModal = (user) => {
    setNewUser({
      name: user.name,
      username: user.username,
      password: "",
      position: user.position,
    });
    setEditingUserId(user._id);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleSaveUser = async () => {
    if (modalMode === "add") {
      try {
        const createdUser = await createUser(newUser);
        setUsers([...users, { ...createdUser }]);
        toast.success("User created successfully!");
      } catch (error) {
        toast.error(error.message || "Failed to create user");
      }
    } else if (modalMode === "edit") {
      try {
        console.log(newUser);
        newUser.id = editingUserId;
        await editUser(newUser);
        setUsers(
          users.map((user) =>
            user._id === editingUserId ? { ...user, ...newUser } : user
          )
        );
        toast.success("User updated successfully!");
      } catch (error) {
        toast.error(error.message || "Failed to update user");
      }
    }
    setIsModalOpen(false);
  };

  const handleDisableUser = async (id) => {
    const user = users.find((user) => user._id === id);
    const newStatus = !user.active;

    try {
      await editStatusUser(id, newStatus);
      setUsers(
        users.map((user) =>
          user._id === id ? { ...user, active: newStatus } : user
        )
      );
      toast.success(`User ${newStatus ? "enabled" : "disabled"} successfully!`);
    } catch (error) {
      toast.error(error.message || "Failed to update user status");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user._id !== id));
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to delete user");
    }
  };

  return (
    <div className="flex flex-col pt-4 items-center min-h-screen">
      <div className="w-full max-w-4xl p-4">
        <div className="w-full flex justify-between">
          <h1 className="text-3xl font-bold mb-4">Users</h1>
          <button
            onClick={openAddUserModal}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          >
            Add User
          </button>
        </div>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Username</th>
              <th className="border px-4 py-2">Position</th>
              <th className="border px-4 py-2">Actions</th>
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
              </tr>
            </tbody>
          ) : users.length === 0 ? (
            <NoUserPage />
          ) : (
            <tbody>
              {users.map(
                (user) =>
                  user.position !== "admin" && (
                    <tr key={user._id}>
                      <td
                        className={`border px-4 py-2 ${
                          user.active ? "bg-green-400" : "bg-red-400"
                        }`}
                      >
                        {user.active ? "Active" : "Inactive"}
                      </td>
                      <td className="border px-4 py-2">{user.name}</td>
                      <td className="border px-4 py-2">{user.username}</td>
                      <td className="border px-4 py-2">{user.position}</td>
                      <td className="flex border px-4 py-2 justify-evenly">
                        <button
                          onClick={() => handleDisableUser(user._id)}
                          className={`px-2 py-1 rounded ${
                            user.active
                              ? "bg-yellow-500 text-white"
                              : "bg-green-500 text-white"
                          }`}
                        >
                          {user.active ? "Disable" : "Enable"}
                        </button>
                        <button
                          onClick={() => openEditUserModal(user)}
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          )}
        </table>
      </div>
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        user={newUser}
        setUser={setNewUser}
        mode={modalMode}
      />
      <Toaster />
    </div>
  );
};

export default UserPage;
