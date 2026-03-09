import { useEffect, useState } from "react";
import { Bell, Send } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../api/api";
import React from "react";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [depts, setDepts]   = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [form, setForm] = useState({ title: "", message: "", target_type: "ALL", target_id: "", priority: "NORMAL" });

  useEffect(() => {
    load();
    api.get("/departments").then(r => setDepts(r.data.data || []));
    api.get("/faculty").then(r => setFaculty(r.data.data || []));
  }, []);

  const load = () => api.get("/notifications").then(r => setNotifications(r.data.data || []));

  const handleSend = async () => {
    if (!form.title || !form.message) return toast.error("Title and message required");
    try {
      await api.post("/notifications", form);
      toast.success("Notification sent!");
      setForm({ title: "", message: "", target_type: "ALL", target_id: "", priority: "NORMAL" });
      load();
    } catch { toast.error("Failed to send"); }
  };

  return (
    <DashboardLayout title="Notifications">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Compose */}
        <div className="lg:col-span-2 card h-fit">
          <h3 className="text-base font-semibold text-textMain dark:text-white mb-5 flex items-center gap-2">
            <Send size={16} className="text-primary" /> New Announcement
          </h3>
          <div className="space-y-3">
            <div className="form-group">
              <label className="label">Title</label>
              <input className="input" placeholder="Announcement title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="label">Message</label>
              <textarea className="input min-h-[100px] resize-none" placeholder="Message content..."
                value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="label">Target</label>
                <select className="select" value={form.target_type} onChange={e => setForm({ ...form, target_type: e.target.value, target_id: "" })}>
                  <option value="ALL">All Faculty</option>
                  <option value="DEPARTMENT">Department</option>
                  <option value="FACULTY">Specific Faculty</option>
                </select>
              </div>
              <div className="form-group">
                <label className="label">Priority</label>
                <select className="select" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                  <option value="NORMAL">Normal</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>
            {form.target_type === "DEPARTMENT" && (
              <div className="form-group">
                <label className="label">Department</label>
                <select className="select" value={form.target_id} onChange={e => setForm({ ...form, target_id: e.target.value })}>
                  <option value="">Select...</option>
                  {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            )}
            {form.target_type === "FACULTY" && (
              <div className="form-group">
                <label className="label">Faculty</label>
                <select className="select" value={form.target_id} onChange={e => setForm({ ...form, target_id: e.target.value })}>
                  <option value="">Select...</option>
                  {faculty.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
            )}
            <button onClick={handleSend} className="btn-primary w-full flex items-center justify-center gap-2">
              <Send size={14}/> Send Notification
            </button>
          </div>
        </div>

        {/* History */}
        <div className="lg:col-span-3 card">
          <h3 className="text-base font-semibold text-textMain dark:text-white mb-4">Sent Notifications</h3>
          <div className="space-y-3">
            {notifications.map(n => (
              <div key={n.id} className="p-4 rounded-xl border border-border dark:border-borderDark hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Bell size={14} className={n.priority === "URGENT" ? "text-red-500" : "text-primary"} />
                    <p className="text-sm font-semibold text-textMain dark:text-white">{n.title}</p>
                    {n.priority === "URGENT" && <span className="badge-red">Urgent</span>}
                  </div>
                  <span className="text-xs text-textMuted flex-shrink-0">{new Date(n.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-textMuted mt-1">{n.message}</p>
                <p className="text-[10px] text-textMuted mt-1.5">→ {n.target_type}{n.target_id ? ` #${n.target_id}` : ""}</p>
              </div>
            ))}
            {!notifications.length && <div className="text-center py-12 text-textMuted text-sm">No notifications sent</div>}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}