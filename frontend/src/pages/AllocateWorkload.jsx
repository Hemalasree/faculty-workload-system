import { useEffect, useState } from "react";
import api from "../api/api";
import DashboardLayout from "../components/DashboardLayout";

export default function AllocateWorkload() {
  const [facultyList, setFacultyList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);

  const [faculty_id, setFacultyId] = useState("");
  const [subject_id, setSubjectId] = useState("");
  const [hours, setHours] = useState("");
  const [duty_type, setDutyType] = useState("TEACHING");

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load faculty & subjects on page load
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const facultyRes = await api.get("/faculty");
      const subjectRes = await api.get("/subjects");

      setFacultyList(facultyRes.data);
      setSubjectList(subjectRes.data);
    } catch (err) {
      console.error("Error loading data");
    }
  };

  const handleAllocate = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/workload/allocate", {
        faculty_id,
        subject_id,
        class_id: 1,
        hours: Number(hours),
        duty_type,
      });

      setMsg(res.data.message);

      // Clear form
      setFacultyId("");
      setSubjectId("");
      setHours("");
      setDutyType("TEACHING");
    } catch (err) {
      setError(err.response?.data?.message || "Allocation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Allocate Workload">
      <div className="max-w-3xl mx-auto bg-card border border-white/10 rounded-2xl p-6">
        <h2 className="text-white text-xl font-bold mb-2">
          Workload Allocation Form
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Assign subjects and workload hours to faculty.
          System automatically prevents overload.
        </p>

        <form
          onSubmit={handleAllocate}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Faculty Dropdown */}
          <div>
            <label className="text-sm font-semibold text-gray-300">
              Select Faculty
            </label>
            <select
              value={faculty_id}
              onChange={(e) => setFacultyId(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Choose Faculty --</option>
              {facultyList.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.department})
                </option>
              ))}
            </select>
          </div>

          {/* Subject Dropdown */}
          <div>
            <label className="text-sm font-semibold text-gray-300">
              Select Subject
            </label>
            <select
              value={subject_id}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Choose Subject --</option>
              {subjectList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.subject_name} (Sem {s.semester})
                </option>
              ))}
            </select>
          </div>

          {/* Hours */}
          <div>
            <label className="text-sm font-semibold text-gray-300">
              Hours
            </label>
            <input
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="Example: 4"
              type="number"
              min="1"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Duty Type */}
          <div>
            <label className="text-sm font-semibold text-gray-300">
              Duty Type
            </label>
            <select
              value={duty_type}
              onChange={(e) => setDutyType(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="TEACHING">Teaching</option>
              <option value="NON_TEACHING">Non Teaching</option>
            </select>
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              disabled={loading}
              className="w-full py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Allocating..." : "Allocate Workload"}
            </button>
          </div>
        </form>

        {/* Success Message */}
        {msg && (
          <div className="mt-5 bg-green-500/10 border border-green-500/30 text-green-300 p-4 rounded-xl text-sm">
            ✅ {msg}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-5 bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl text-sm">
            ❌ {error}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}