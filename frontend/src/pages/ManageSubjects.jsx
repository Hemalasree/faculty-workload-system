import { useEffect, useState } from "react";
import api from "../api/api";
import DashboardLayout from "../components/DashboardLayout";

export default function ManageSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({
    subject_name: "",
    subject_code: "",
    semester: "",
    department: ""
  });

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    const res = await api.get("/subjects");
    setSubjects(res.data);
  };

  const addSubject = async () => {
    try {
      await api.post("/subjects", form);
      await loadSubjects();
      alert("Subject Added Successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Error adding subject");
    }
  };

  return (
    <DashboardLayout title="Manage Subjects">
      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-card p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-4">Add Subject</h3>

          <input
            placeholder="Subject Name"
            value={form.subject_name}
            onChange={(e) => setForm({ ...form, subject_name: e.target.value })}
          />

          <input
            placeholder="Subject Code"
            value={form.subject_code}
            onChange={(e) => setForm({ ...form, subject_code: e.target.value })}
          />

          <input
            type="number"
            placeholder="Semester"
            value={form.semester}
            onChange={(e) => setForm({ ...form, semester: e.target.value })}
          />

          <input
            placeholder="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
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