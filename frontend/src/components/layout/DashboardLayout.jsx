import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import React from "react";

export default function DashboardLayout({ children, title }) {
  return (
    <div className="h-screen flex overflow-hidden bg-bgLight dark:bg-bgDark">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}