import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ role }) {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-white/10 text-white"
      : "text-gray-400 hover:text-white hover:bg-white/5";

  return (
    <div className="h-screen w-64 bg-black/30 border-r border-white/10 p-5">
      <h1 className="text-white font-bold text-xl">Workload System</h1>
      <p className="text-gray-400 text-sm mt-1">Dark Dashboard</p>

      <div className="mt-8 space-y-2">
        <Link
          to={role === "ADMIN" ? "/admin" : "/faculty"}
          className={`block px-4 py-3 rounded-xl transition ${isActive(
            role === "ADMIN" ? "/admin" : "/faculty"
          )}`}
        >
          Dashboard
        </Link>

        {role === "ADMIN" && (
          <Link
            to="/allocate"
            className={`block px-4 py-3 rounded-xl transition ${isActive(
              "/allocate"
            )}`}
          >
            Allocate Workload
          </Link>
        )}

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="w-full text-left px-4 py-3 rounded-xl transition text-gray-400 hover:text-white hover:bg-red-500/10"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
