import { useEffect, useState } from "react";
import { Save, User } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../api/api";
import React from "react";

export default function FacultyProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ phone: "", email: "", password: "", confirm: "" });

  useEffect(() => {
    api.get("/auth/me").then(r => {
      setProfile(r.data.data);
      setForm(f => ({ ...f, phone: r.data.data.phone || "", email: r.data.data.email || "" }));
    });
  }, []);

  const handleSave = async () => {
    if (form.password && form.password !== form.confirm) return toast.error("Passwords don't match");
    try {
      const payload = { phone: form.phone, email: form.email };
      if (form.password) payload.password = form.password;
      await api.put("/auth/profile", payload);
      toast.success("Profile updated");
      setForm(f => ({ ...f, password: "", confirm: "" }));
    } catch (err) { toast.error(err.response?.data?.message || "Update failed"); }
  };

  if (!profile) return <DashboardLayout title="Profile"><div className="flex justify-center h-40 items-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"/></div></DashboardLayout>;

  return (
    <DashboardLayout title="My Profile">
      <div className="max-w-2xl space-y-6">
        {/* Info card */}
        <div className="card">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary text-xl font-bold">
              {profile.name?.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-textMain dark:text-white">{profile.name}</h2>
              <p className="text-sm text-textMuted">{profile.designation} • {profile.department_name}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              { label: "Employee ID", value: profile.employee_id || "—" },
              { label: "Department",  value: profile.department_name || "—" },
              { label: "Designation", value: profile.designation || "—" },
              { label: "Max Hours",   value: `${profile.max_hours} hrs/week` },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-textMuted mb-0.5">{label}</p>
                <p className="font-medium text-textMain dark:text-gray-200">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Edit form */}
        <div className="card">
          <h3 className="text-base font-semibold text-textMain dark:text-white mb-4">Edit Details</h3>
          <div className="space-y-3">
            <div className="form-group">
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="label">Phone</label>
              <input className="input" placeholder="Phone number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="label">New Password</label>
              <input type="password" className="input" placeholder="Leave blank to keep" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="label">Confirm Password</label>
              <input type="password" className="input" placeholder="Confirm" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} />
            </div>
            <button onClick={handleSave} className="btn-primary flex items-center gap-2">
              <Save size={14}/> Save Changes
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}