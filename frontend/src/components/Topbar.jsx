export default function Topbar({ title }) {
  const role = localStorage.getItem("role");

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/20">
      <div>
        <h2 className="text-white text-xl font-bold">{title}</h2>
        <p className="text-gray-400 text-sm">Logged in as {role}</p>
      </div>

      <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm">
        Faculty Workload Management
      </div>
    </div>
  );
}
