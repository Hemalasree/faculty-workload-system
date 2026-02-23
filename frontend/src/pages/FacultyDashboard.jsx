import { useEffect, useState } from "react";
import api from "../api/api";
import DashboardLayout from "../components/DashboardLayout";

export default function FacultyDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/workload/faculty").then((res) => setData(res.data));
  }, []);

  const totalHours = data.reduce((sum, x) => sum + Number(x.hours), 0);

  return (
    <DashboardLayout title="Faculty Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-card border border-white/10 rounded-2xl p-5">
          <p className="text-gray-400 text-sm">My Total Workload</p>
          <h2 className="text-white text-3xl font-bold mt-2">{totalHours}</h2>
        </div>

        <div className="bg-card border border-white/10 rounded-2xl p-5">
          <p className="text-gray-400 text-sm">Assigned Duties</p>
          <h2 className="text-blue-400 text-3xl font-bold mt-2">
            {data.length}
          </h2>
        </div>
      </div>

      <div className="bg-card border border-white/10 rounded-2xl p-5">
        <h3 className="text-white text-lg font-bold mb-4">My Workload</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-white/10">
                <th className="text-left p-3">Subject</th>
                <th className="text-left p-3">Code</th>
                <th className="text-left p-3">Class</th>
                <th className="text-left p-3">Hours</th>
                <th className="text-left p-3">Duty</th>
              </tr>
            </thead>

            <tbody>
              {data.map((w) => (
                <tr
                  key={w.id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="p-3 text-white font-semibold">
                    {w.subject_name}
                  </td>
                  <td className="p-3 text-gray-300">{w.subject_code}</td>
                  <td className="p-3 text-gray-300">{w.class_name}</td>
                  <td className="p-3 text-white font-bold">{w.hours}</td>
                  <td className="p-3 text-gray-300">{w.duty_type}</td>
                </tr>
              ))}

              {data.length === 0 && (
                <tr>
                  <td className="p-4 text-gray-400" colSpan="5">
                    No workload assigned yet.
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
