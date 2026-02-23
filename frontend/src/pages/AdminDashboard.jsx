import { useEffect, useState } from "react";
import api from "../api/api";
import DashboardLayout from "../components/DashboardLayout";

export default function AdminDashboard() {
  const [summary, setSummary] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/workload/summary").then((res) => setSummary(res.data));
  }, []);

  const filtered = summary.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalFaculty = summary.length;
  const overloadedCount = summary.filter(
    (f) => Number(f.total_hours) > Number(f.max_hours)
  ).length;

  return (
    <DashboardLayout title="Admin Dashboard">
      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-white/10 rounded-2xl p-5">
          <p className="text-gray-400 text-sm">Total Faculty</p>
          <h2 className="text-white text-3xl font-bold mt-2">{totalFaculty}</h2>
        </div>

        <div className="bg-card border border-white/10 rounded-2xl p-5">
          <p className="text-gray-400 text-sm">Overloaded Faculty</p>
          <h2 className="text-red-400 text-3xl font-bold mt-2">
            {overloadedCount}
          </h2>
        </div>

        <div className="bg-card border border-white/10 rounded-2xl p-5">
          <p className="text-gray-400 text-sm">System Status</p>
          <h2 className="text-green-400 text-2xl font-bold mt-2">
            Running ✅
          </h2>
        </div>
      </div>

      {/* search + table */}
      <div className="bg-card border border-white/10 rounded-2xl p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h3 className="text-white text-lg font-bold">Workload Summary</h3>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search faculty..."
            className="px-4 py-2 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-white/10">
                <th className="text-left p-3">Faculty</th>
                <th className="text-left p-3">Department</th>
                <th className="text-left p-3">Total Hours</th>
                <th className="text-left p-3">Max Hours</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((f, i) => {
                const overloaded = Number(f.total_hours) > Number(f.max_hours);

                return (
                  <tr
                    key={i}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="p-3 text-white font-semibold">{f.name}</td>
                    <td className="p-3 text-gray-300">{f.department}</td>
                    <td className="p-3 text-white font-bold">{f.total_hours}</td>
                    <td className="p-3 text-gray-300">{f.max_hours}</td>
                    <td className="p-3">
                      {overloaded ? (
                        <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 font-semibold">
                          Overloaded
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-300 font-semibold">
                          Balanced
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td className="p-4 text-gray-400" colSpan="5">
                    No faculty found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
