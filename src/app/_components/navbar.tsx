import Image from "next/image";
import React from "react";

const Navbar = () => {
  return (
    <>
      <nav className="border-b-2 border-gray-200 bg-white dark:bg-gray-900 ">
        <div className="flex w-full flex-wrap items-center justify-between p-4">
          <a
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src="/Bookify.png" className="h-8" alt="Bookify Logo" />
            <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
              Bookify
            </span>
          </a>
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            <a
              href="#"
              className="text-sm  text-blue-600 hover:underline dark:text-blue-500"
            >
              Logout
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
