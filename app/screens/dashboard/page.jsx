// pages/index.jsx
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("userToken");

    if (!token) {
      console.log("User not logged in");
      router.push("/screens/sign-in");
    } else {
      router.push("/screens/dashboard/dashboard");
    }
  }, [router]);
};

export default Page;
