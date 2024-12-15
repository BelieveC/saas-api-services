"use client";

import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <main
        className={`flex-1 p-8 transition-all duration-200 ease-in-out ${
          isSidebarOpen ? "lg:ml-60" : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
}
