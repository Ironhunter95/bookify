"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { RiMenu5Fill } from "react-icons/ri";

const Navbar = () => {
  const userDropDown = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userDropDown.current &&
        !userDropDown.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userDropDown]);
  return (
    <>
      <nav className="border-b-2 border-gray-200 bg-white dark:bg-gray-900 ">
        <div className="flex w-full flex-wrap items-center justify-between p-4">
          <a
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <Image
              src="/Bookify.png"
              className="h-8"
              alt="Bookify Logo"
              height={32}
              width={22}
              unoptimized
            />
            <span
              className="self-center whitespace-nowrap pt-1 text-2xl font-semibold"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #c306bd, #22c9a2, #543cb1, #5721a5)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Bookify
            </span>
          </a>
          <div className="relative mr-4 flex items-center rtl:space-x-reverse">
            <span
              aria-expanded={isDropdownOpen}
              onClick={handleDropdownClick}
              className="cursor-pointer hover:scale-110"
            >
              <RiMenu5Fill size={24} />
            </span>
            <div
              ref={userDropDown}
              className={`dark:!bg-navy-700  ${
                isDropdownOpen ? "block" : "hidden"
              }  absolute -right-2 top-5 z-10 h-max w-56 flex-col rounded-[20px] border-2 bg-white bg-cover bg-no-repeat pb-4 dark:text-white dark:shadow-none`}
            >
              <div className="ml-4 mt-3">
                <div className="flex items-center gap-2">
                  <p className="text-navy-700 text-sm font-bold dark:text-white">
                    👋 Hey, {"User"}
                  </p>
                </div>
              </div>
              <div className="mt-3 h-px w-full bg-gray-200 dark:bg-white/20 " />

              <div className="ml-4 mt-3 flex flex-col">
                <Link
                  href="/"
                  className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
                >
                  Home
                </Link>
                <div className="mt-1 h-px w-[85%] bg-gray-200 dark:bg-white/20 " />
                <Link
                  href="/guests"
                  className="mt-3 text-sm text-gray-800 dark:text-white hover:dark:text-white"
                >
                  Manage Guests
                </Link>
                <div className="mt-1 h-px w-[85%] bg-gray-200 dark:bg-white/20 " />
                <a
                  href=" "
                  className="mt-3 text-sm font-medium text-red-500 hover:text-red-500"
                >
                  Log Out
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
