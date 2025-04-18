"use client";

import clsx from "clsx";
import {
  HomeIcon,
  User,
  Settings,
  Calendar,
  Menu,
  X,
  Receipt,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaCertificate, FaHouseUser } from "react-icons/fa";
import SignOutButton from "@/components/SignOutButton";
import { useState } from "react";

interface DashboardSideBarProps {
  role?: string;
}

export default function DashboardSideBar({ role }: DashboardSideBarProps) {
  const pathname = usePathname();
  const isAdmin = role === "ADMIN";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="block lg:hidden">
        <button
          onClick={toggleMobileMenu}
          className="rounded-md bg-gray-100 p-2 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden h-full bg-gray-50 dark:bg-gray-900 lg:block">
        <div className="flex h-full max-h-screen flex-col">
        
          <div className="flex-1 overflow-auto py-6">
            <nav className="grid items-start gap-2 px-4 text-sm font-medium">
              {/* Common or role-specific navigation links */}
              <Link
                className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                  "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard",
                })}
                href="/dashboard"
              >
                <div className="text-primary dark:text-white">
                  <HomeIcon className="h-5 w-5" />
                </div>
                {isAdmin ? "Dashboard" : "Overview"}
              </Link>
            
              {isAdmin ? (
              // Admin-specific links
                <>
                  <Link
                    className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                      "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/users",
                    })}
                    href="/dashboard/users"
                  >
                    <div className="text-primary dark:text-white">
                      <User className="h-5 w-5" />
                    </div>
                  Users
                  </Link>
                
                  <Link
                    className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                      "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/residents",
                    })}
                    href="/dashboard/residents"
                  >
                    <div className="text-primary dark:text-white">
                      <FaHouseUser className="h-5 w-5" />
                    </div>
                  Residents
                  </Link>

                  <Link
                    className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                      "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/certificates",
                    })}
                    href="/dashboard/certificates"
                  >
                    <div className="text-primary dark:text-white">
                      <FaCertificate className="h-5 w-5" />
                    </div>
                  Certificates
                  </Link>

                  <Link
                    className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                      "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/payments",
                    })}
                    href="/dashboard/payments"
                  >
                    <div className="text-primary dark:text-white">
                      <Receipt className="h-5 w-5" />
                    </div>
                  Payments
                  </Link>

                  <Link
                    className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                      "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/appointments",
                    })}
                    href="/dashboard/appointments"
                  >
                    <div className="text-primary dark:text-white">
                      <Calendar className="h-5 w-5" />
                    </div>
                  Appointments
                  </Link>
                </>
              ) : (
              // User-specific links
                <>
                  <Link
                    className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                      "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/appointments",
                    })}
                    href="/dashboard/appointments"
                  >
                    <div className="text-primary dark:text-white">
                      <Calendar className="h-5 w-5" />
                    </div>
                  My Appointments
                  </Link>

                  <Link
                    className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                      "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/residents",
                    })}
                    href="/dashboard/residents"
                  >
                    <div className="text-primary dark:text-white">
                      <FaHouseUser className="h-5 w-5" />
                    </div>
                  My Resident Profiles
                  </Link>

                
                  <Link
                    className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                      "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/certificates",
                    })}
                    href="/dashboard/certificates"
                  >
                    <div className="text-primary dark:text-white">
                      <FaCertificate className="h-5 w-5" />
                    </div>
                  My Certificates
                  </Link>

                  <Link
                    className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                      "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/settings",
                    })}
                    href="/dashboard/settings"
                  >
                    <div className="text-primary dark:text-white">
                      <Settings className="h-5 w-5" />
                    </div>
                  Settings
                  </Link>
                </>
              )}
            
              {/* Sign Out Button */}
              <div className="mt-8 px-3">
                <SignOutButton />
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-gray-50 transition-transform duration-300 ease-in-out dark:bg-gray-900 lg:hidden ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full max-h-screen flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold">{isAdmin ? "Admin Dashboard" : "My Account"}</h2>
            <button onClick={toggleMobileMenu} className="p-2">
              <X className="h-5 w-5" />
            </button>
          </div>
        
          <div className="flex-1 overflow-auto py-6">
            <nav className="grid items-start gap-2 px-4 text-sm font-medium">
              {/* Common or role-specific navigation links - same as desktop */}
              <Link
                className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                  "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard",
                })}
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="text-primary dark:text-white">
                  <HomeIcon className="h-5 w-5" />
                </div>
                {isAdmin ? "Dashboard" : "Overview"}
              </Link>
            
              {isAdmin ? (
              // Admin-specific links
                <>
                  <Link
                    className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                      "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/users",
                    })}
                    href="/dashboard/users"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="text-primary dark:text-white">
                      <User className="h-5 w-5" />
                    </div>
                  Users
                  </Link>
                  
                  <Link
                    className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                      "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/residents",
                    })}
                    href="/dashboard/residents"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="text-primary dark:text-white">
                      <FaHouseUser className="h-5 w-5" />
                    </div>
                  Residents
                  </Link>
                
                  <Link
                    className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                      "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/certificates",
                    })}
                    href="/dashboard/certificates"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="text-primary dark:text-white">
                      <FaCertificate className="h-5 w-5" />
                    </div>
                  Certificates
                  </Link>

                  <Link
                    className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                      "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/payments",
                    })}
                    href="/dashboard/payments"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="text-primary dark:text-white">
                      <Receipt className="h-5 w-5" />
                    </div>
                  Payments
                  </Link>

                  <Link
                    className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                      "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/appointments",
                    })}
                    href="/dashboard/appointments"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="text-primary dark:text-white">
                      <Calendar className="h-5 w-5" />
                    </div>
                  Appointments
                  </Link>
                </>
              ) : (
              // User-specific links
                <>
                  <Link
                    className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                      "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/appointments",
                    })}
                    href="/dashboard/appointments"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="text-primary dark:text-white">
                      <Calendar className="h-5 w-5" />
                    </div>
                  My Appointments
                  </Link>

                  <Link
                    className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                      "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/residents",
                    })}
                    href="/dashboard/residents"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="text-primary dark:text-white">
                      <FaHouseUser className="h-5 w-5" />
                    </div>
                  My Resident Profiles
                  </Link>
                
                  <Link
                    className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                      "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/certificates",
                    })}
                    href="/dashboard/certificates"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="text-primary dark:text-white">
                      <FaCertificate className="h-5 w-5" />
                    </div>
                  My Certificates
                  </Link>

                  <Link
                    className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                      "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/settings",
                    })}
                    href="/dashboard/settings"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="text-primary dark:text-white">
                      <Settings className="h-5 w-5" />
                    </div>
                  Settings
                  </Link>
                </>
              )}
            
              {/* Sign Out Button */}
              <div className="mt-8 px-3">
                <SignOutButton />
              </div>
            </nav>
          </div>
        </div>
      </div>
    
      {/* Overlay when mobile menu is open */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}
    </>
    
  );
}