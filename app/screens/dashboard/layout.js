"use client";
import { DefaultSidebar } from "@/app/components/navbar";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import toast, { Toaster } from "react-hot-toast";

const Layout = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    if (!token) {
      router.push("/screens/sign-in"); // Redirect to the login page if no token
      toast.error("Not logged in");
    }
  }, [children, router]);

  return (
    <div className="flex">
      <aside className="h-screen fixed top-0 left-0 bottom-0 w-64 overflow-y-auto bg-gray-100 ">
        <DefaultSidebar />
      </aside>
      <main className="flex-grow overflow-y-auto ml-64">{children}</main>
    </div>
  );
};

export default Layout;
