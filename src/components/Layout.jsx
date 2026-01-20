import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Box, Upload, LogOut, Menu, X, User } from "lucide-react";
import { useUser, useClerk } from "@clerk/clerk-react";
import DashboardNavbar from "./DashboardNavbar";

const Layout = ({ children }) => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Products", path: "/dashboard/products", icon: <Box size={20} /> },
    { label: "Upload Media", path: "/dashboard/upload", icon: <Upload size={20} /> },
    { label: "Profile", path: "/dashboard/profile", icon: <User size={20} /> },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Dashboard Top Navigation */}
      <DashboardNavbar onMenuToggle={() => setIsMobileOpen(!isMobileOpen)} />

      <div className="flex flex-1">
        {/* Mobile Menu Overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:shadow-none ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden shadow-md">
                <img
                  src="/src/assets/pi_global_logo.jpeg"
                  alt="PI Global Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-indigo-600">PI Global</h1>
                <p className="text-xs text-gray-500 -mt-1">Purchase Inventory</p>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1 rounded-md hover:bg-gray-100 md:hidden"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Welcome, {user?.firstName || "User"}</p>
          </div>
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-indigo-50 text-indigo-600 font-medium shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:shadow-sm"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <div className="border-t pt-4 mt-8">
              <button
                onClick={() => signOut()}
                className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg w-full transition-colors"
              >
                <LogOut size={20} /> Logout
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;