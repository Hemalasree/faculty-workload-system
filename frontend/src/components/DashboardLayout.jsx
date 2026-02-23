import { NavLink } from "react-router-dom";

export default function DashboardLayout({ title, children }) {
  return (
    <div className="flex min-h-screen bg-background text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-white/10 p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">Faculty System</h2>

        <NavLink to="/admin" className="block hover:text-blue-400">
          Dashboard
        </NavLink>

        <NavLink to="/admin/faculty" className="block hover:text-blue-400">
          Manage Faculty
        </NavLink>

        <NavLink to="/admin/subjects" className="block hover:text-blue-400">
          Manage Subjects
        </NavLink>

        <NavLink to="/admin/allocate" className="block hover:text-blue-400">
          Allocate Workload
        </NavLink>

        <NavLink to="/admin/reports" className="block hover:text-blue-400">
          Reports
        </NavLink>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="mt-6 text-red-400 hover:text-red-500"
        >
          Logout
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        {children}
      </main>
    </div>
  );
}