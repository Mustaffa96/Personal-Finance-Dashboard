"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface HeaderProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  onMobileMenuToggle?: () => void;
}

export default function Header({ user, onMobileMenuToggle }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
      <div className="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
        {/* Brand */}
        <a
          className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
          href="#"
          onClick={(e) => e.preventDefault()}
        >
          Dashboard
        </a>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => {
            if (onMobileMenuToggle) onMobileMenuToggle();
          }}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-300 transition-all duration-200 shadow-md active:scale-95"
          aria-controls="mobile-menu"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="block h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Form */}
        <form className="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3">
          <div className="relative flex w-full flex-wrap items-stretch">
            <span className="z-10 h-full leading-snug font-normal absolute text-center text-slate-300  bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search"
              className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white  rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
            />
          </div>
        </form>

        {/* User */}
        <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
          <li className="relative">
            <button className="text-slate-500 block" onClick={toggleDropdown}>
              <div className="items-center flex">
                <span className="w-10 h-10 text-sm text-white bg-slate-600 inline-flex items-center justify-center rounded-full">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
                <span className="ml-2 text-white hidden lg:inline-block">
                  {user.name || user.email}
                </span>
              </div>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link
                  href="/dashboard/profile"
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Your Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Settings
                </Link>
                <hr className="my-1" />
                <button
                  onClick={handleSignOut}
                  className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Sign out
                </button>
              </div>
            )}
          </li>
        </ul>

        {/* Mobile profile dropdown */}
        <div className="md:hidden relative">
          <button
            type="button"
            className="flex items-center text-sm rounded-full focus:outline-none"
            onClick={toggleDropdown}
          >
            <div className="h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center text-white">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          </button>

          {isDropdownOpen && (
            <div
              className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
              role="menu"
            >
              <Link
                href="/dashboard/profile"
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                Your Profile
              </Link>
              <Link
                href="/dashboard/settings"
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
