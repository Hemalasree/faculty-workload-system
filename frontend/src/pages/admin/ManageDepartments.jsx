import { useEffect, useState } from "react";
import { Trash2, Pencil, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ConfirmModal from "../../components/ui/ConfirmModal";
import api from "../../api/api";
import React from "react";

export default function ManageDepartments() {
  const [depts, setDepts]     = useState([]);
  const [form, setForm]       = useState({ name: "", hod_name: "" });
  const [editId, setEditId]   = useState(null);
  const [confirm, setConfirm] = useState(null);

  useEffect(() => { load(); }, []);
  const load = () => api.get("/departments").then(r => setDepts(r.data.data || []));

  const handleSubmit = async () => {
    if (!form.name) return toast.error("Department name required");
    try {
      if (editId) { await api.put(`/departments/${editId}`, form); toast.success("Updated"); setEditId(null); }
      else        { await api.post("/departments", form);          toast.success("Added"); }
      setForm({ name: "", hod_name: "" });
      load();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const startEdit = (d) => { setEditId(d.id); setForm({ name: d.name, hod_name: d.hod_name || "" }); };
  const handleDelete = async () => {
    try { await api.delete(`/departments/${confirm}`); toast.success("Deleted"); load(); }
    catch { toast.error("Cannot delete: faculty are linked to this department"); }
    setConfirm(null);
  };

  return (
    <DashboardLayout title="Department Management">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 card h-fit">
          <h3 className="text-base font-semibold text-textMain dark:text-white mb-5">
            {editId ? "Edit Department" : "Add Department"}
          </h3>
          <div className="space-y-3">
            <div className="form-group">
              <label className="label">Department Name</label>
              <input className="input" placeholder="Computer Science" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="label">HOD Name</label>
              <input className="input" placeholder="Dr. Jane Smith" value={form.hod_name} onChange={e => setForm({ ...form, hod_name: e.target.value })} />
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={handleSubmit} className="btn-primary flex-1">{editId ? "Update" : "Add"}</button>
              {editId && <button onClick={() => { setEditId(null); setForm({ name: "", hod_name: "" }); }} className="btn-secondary">Cancel</button>}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 card">
          <h3 className="text-base font-semibold text-textMain dark:text-white mb-4">Departments</h3>
          <div className="table-wrapper">
            <table className="table">
              <thead><tr>{["Department", "HOD", "Faculty Count", ""].map(h => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {depts.map(d => (
                  <tr key={d.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <Building2 size={14} className="text-purple-600" />
                        </div>
                        <span className="font-medium text-sm text-textMain dark:text-white">{d.name}</span>
                      </div>
                    </td>
                    <td className="text-sm">{d.hod_name || "—"}</td>
                    <td>
                      <span className="badge-blue">{d.faculty_count} faculty</span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => startEdit(d)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500"><Pencil size={14}/></button>
                        <button onClick={() => setConfirm(d.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!depts.length && <tr><td colSpan={4} className="text-center py-8 text-textMuted text-sm">No departments yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ConfirmModal open={!!confirm} title="Delete Department" message="Are you sure? Faculty in this department will be unlinked."
        onConfirm={handleDelete} onCancel={() => setConfirm(null)} />
    </DashboardLayout>
  );
}