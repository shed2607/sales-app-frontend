"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArchiveBoxIcon,
  ShoppingBagIcon,
  UserIcon,
  HomeIcon,
  DocumentIcon,
} from "@heroicons/react/24/solid";
import { validateUser } from "../api/auth";

const navItems = [
  {
    link: "/screens/dashboard/dashboard",
    name: "Dashboard",
    icon: <HomeIcon className="h-6 w-6" />,
  },
  {
    link: "/screens/dashboard/inventory",
    name: "Inventory",
    icon: <ArchiveBoxIcon className="h-6 w-6" />,
  },
  {
    link: "/screens/dashboard/sales",
    name: "Sales",
    icon: <ShoppingBagIcon className="h-6 w-6" />,
  },
  {
    link: "/screens/dashboard/logs",
    name: "Sales Log",
    icon: <DocumentIcon className="h-6 w-6" />,
  },
  {
    link: "/screens/dashboard/users",
    name: "Users",
    icon: <UserIcon className="h-6 w-6" />,
  },
];

export function DefaultSidebar() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const response = await validateUser();

        setAuthorized(response.authorizedUser);
      } catch (error) {
        console.error("Failed to validate user:", error);
      }
    };
    checkAuthorization();
  }, []);

  const handleSignOut = async () => {
    try {
      sessionStorage.removeItem("userToken");
      router.push("/screens/sign-in");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-full px-5 w-56 items-center justify-center pt-10 border-r bg-gray-900 text-white border-gray-700">
      <div className="mb-10 flex items-center justify-between w-full">
        <h1 className="text-2xl font-semibold">Sales Manager</h1>
      </div>
      <div className="w-full">
        {navItems.map((item, index) => {
          // If not authorized, only show Dashboard and Sales Log
          if (
            !authorized &&
            (item.name === "Users" || item.name === "Sales Log")
          ) {
            return null;
          }
          return (
            <NavItems
              key={index}
              link={item.link}
              name={item.name}
              icon={item.icon}
            />
          );
        })}
      </div>
      <div className="mt-auto mb-10 w-full">
        <NavBtn func={handleSignOut} name={"Sign Out"} />
      </div>
    </div>
  );
}

const NavItems = ({ link, name, icon }) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(link);

  return (
    <Link
      href={link}
      className={`flex mx-2 my-4 px-3 py-2 rounded-lg justify-start items-center ${
        isActive ? "bg-gray-800 text-white" : "hover:bg-gray-800 text-gray-400"
      }`}
    >
      <div className="mr-2">{icon}</div>
      <div className="text-lg">{name}</div>
    </Link>
  );
};

const NavBtn = ({ func, name }) => {
  return (
    <button
      onClick={() => func()}
      className="flex w-full mx-2 my-4 px-3 py-2 rounded-lg justify-center items-center bg-red-600 text-white hover:bg-red-700"
    >
      {name}
    </button>
  );
};
