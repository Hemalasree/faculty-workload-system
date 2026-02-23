import { useEffect, useState } from "react";
import api from "../api/api";
import DashboardLayout from "../components/DashboardLayout";

export default function ManageSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({
    subject_name: "",
    semester: "",
    class_name: "",
    credits: 3,
    hours_per_week: 3,
  });

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    const res = await api.get("/subjects");
    setSubjects(res.data);
  };

  const addSubject = async () => {
    await api.post("/subjects", form);
    setForm({
      subject_name: "",
      semester: "",
      class_name: "",
      credits: 3,
      hours_per_week: 3,
    });
    loadSubjects();
  };

  return (
    <DashboardLayout title="Manage Subjects">
      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-card p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-4">Add Subject</h3>

          <input
            placeholder="Subject Name"
            className="w-full mb-3 p-2 rounded bg-black/30 border border-white/10"
            value={form.subject_name}
            onChange={(e) =>
              setForm({ ...form, subject_name: e.target.value })
            }
          />

          <input
            placeholder="Semester"
            type="number"
            className="w-full mb-3 p-2 rounded bg-black/30 border border-white/10"
            value={form.semester}
            onChange={(e) =>
              setForm({ ...form, semester: e.target.value })
            }
          />

          <input
            placeholder="Class Name"
            className="w-full mb-3 p-2 rounded bg-black/30 border border-white/10"
            value={form.class_name}
            onChange={(e) =>
              setForm({ ...form, class_name: e.target.value })
            }
          />

          <button
            onClick={addSubject}
            className="bg-blue-600 px-4 py-2 rounded-lg"
          >
            Add Subject
          </button>
        </div>

        <div className="bg-card p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-4">Subject List</h3>

          {subjects.map((s, i) => (
            <div key={i} className="border-b border-white/10 py-2">
              {s.subject_name} - Sem {s.semester} ({s.class_name})
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}