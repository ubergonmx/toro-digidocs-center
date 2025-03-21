"use client";

import Link from "next/link";
import Image from "next/image";
import Icon from "../app/icon.png";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useState } from "react";

interface NavigationMenuProps {
  isAuthenticated: boolean;
  userRole?: string;
}

const NavigationMenu = ({ isAuthenticated, userRole }: NavigationMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="w-full relative h-24 shadow-xl bg-white z-30">
      <div className="flex justify-between items-center h-full w-full px-4 2xl:px-16 container">
        <Link href="/">
          <Image
            src={Icon}
            alt="Icon"
            width="80"
            height="50"
            className="cursor-pointer rounded-full"
            priority
          />
        </Link>

        <div className="hidden sm:flex">
          <ul className="hidden sm:flex">
            <Link href="/">
              <li className="ml-10 hover:border-b hover:border-b-green-500 text-xl">
                Home
              </li>
            </Link>
            <Link href="/pages/about">
              <li className="ml-10 hover:border-b hover:border-b-green-500 text-xl">
                About
              </li>
            </Link>
            <Link href="/pages/services">
              <li className="ml-10 hover:border-b hover:border-b-green-500 text-xl">
                Services
              </li>
            </Link>
            <Link href="/pages/faq">
              <li className="ml-10 hover:border-b hover:border-b-green-500 text-xl">
                FAQ
              </li>
            </Link>
            {isAuthenticated ? (
              <Link href="/dashboard">
                <li className="ml-10 hover:border-b hover:border-b-green-500 text-xl">
                  {userRole === "ADMIN" ? "Dashboard" : "My Account"}
                </li>
              </Link>
            ) : (
              <Link href="/sign-in">
                <li className="ml-10 hover:border-b hover:border-b-green-500 text-xl">
                  Sign In
                </li>
              </Link>
            )}
          </ul>
        </div>
        <div onClick={handleNav} className="sm:hidden cursor-pointer pl-24">
          <AiOutlineMenu size={25} />
        </div>
      </div>
      <div
        className={`absolute top-0 left-0 w-[65%] sm:hidden h-screen bg-[#ecf0f3] p-10 transition-transform duration-500 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex w-full items-center justify-end">
          <div onClick={handleNav} className="cursor-pointer">
            <AiOutlineClose size={25} />
          </div>
        </div>
        <div className="flex-col py-4">
          <ul>
            <Link href="/">
              <li onClick={() => setMenuOpen(false)} className="py-4 cursor-pointer">
                Home
              </li>
            </Link>
            <Link href="/pages/about">
              <li onClick={() => setMenuOpen(false)} className="py-4 cursor-pointer">
                About
              </li>
            </Link>
            <Link href="/pages/services">
              <li onClick={() => setMenuOpen(false)} className="py-4 cursor-pointer">
                Services
              </li>
            </Link>
            <Link href="/pages/faq">
              <li onClick={() => setMenuOpen(false)} className="py-4 cursor-pointer">
                FAQ
              </li>
            </Link>
            {isAuthenticated && (
              <Link href="/dashboard">
                <li onClick={() => setMenuOpen(false)} className="py-4 cursor-pointer">
                  {userRole === "ADMIN" ? "Dashboard" : "My Account"}
                </li>
              </Link>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavigationMenu;