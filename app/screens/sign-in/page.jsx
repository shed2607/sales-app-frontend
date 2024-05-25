"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/api/auth";
import toast, { Toaster } from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    sessionStorage.removeItem("userToken");
  }, []); // Executes only once when the component is mounted

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser(username, password);
      console.log("Login successful", data);
      if (data.status) {
        sessionStorage.setItem("userToken", data.token);

        toast.success("Login successful!");
        router.push("/screens/dashboard");
      } else {
        toast.error("Account disabled");
      }
    } catch (err) {
      console.error("Login error", err);
      toast.error(err.message);
    } finally {
      setLoading(false); // Reset the loading state upon completion of the operation
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-700 text-white">
      <div className="w-96 p-8 rounded-lg shadow-lg bg-gray-900">
        <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 rounded border focus:outline-none focus:border-blue-500 text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded border focus:outline-none focus:border-blue-500 text-black"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 py-2 text-sm font-medium text-black bg-transparent rounded-r transition duration-300"
              >
                {showPassword ? (
                  <EyeIcon className="h-5 w-5" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign In"}{" "}
            {/* Conditional rendering based on loading state */}
          </button>
        </form>
      </div>
      <Toaster /> {/* Add Toaster to render toasts */}
    </div>
  );
};

export default SignIn;
