import { useEffect, useState } from "react";
import api from "../api/api";
import DashboardLayout from "../components/DashboardLayout";

export default function ManageFaculty() {
  const [faculty, setFaculty] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    designation: "",
    max_hours: 18,
  });

  useEffect(() => {
    loadFaculty();
  }, []);

  const loadFaculty = async () => {
    const res = await api.get("/faculty");
    setFaculty(res.data);
  };

  const addFaculty = async () => {
    await api.post("/faculty", form);
    setForm({
      name: "",
      email: "",
      password: "",
      department: "",
      designation: "",
      max_hours: 18,
    });
    loadFaculty();
  };

  return (
    <DashboardLayout title="Manage Faculty">
      <div className="grid md:grid-cols-2 gap-6">

        {/* Add Faculty */}
        <div className="bg-card p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-4">Add Faculty</h3>

          {["name", "email", "password", "department", "designation"].map(
            (field) => (
              <input
                key={field}
                placeholder={field}
                type={field === "password" ? "password" : "text"}
                value={form[field]}
                className="w-full mb-3 p-2 rounded bg-black/30 border border-white/10"
                onChange={(e) =>
                  setForm({ ...form, [field]: e.target.value })
                }
              />
            )
          )}

          <input
            type="number"
            placeholder="Max Hours"
            value={form.max_hours}
            className="w-full mb-3 p-2 rounded bg-black/30 border border-white/10"
            onChange={(e) =>
              setForm({ ...form, max_hours: e.target.value })
            }
          />

          <button
            onClick={addFaculty}
            className="bg-blue-600 px-4 py-2 rounded-lg"
          >
            Add Faculty
          </button>
        </div>

        {/* Faculty List */}
        <div className="bg-card p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-4">Faculty List</h3>

          {faculty.map((f, i) => (
            <div
              key={i}
              className="border-b border-white/10 py-2 flex justify-between"
            >
              <span>
                {f.name} ({f.department})
              </span>
              <span className="text-gray-400">
                Max: {f.max_hours}
              </span>
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}