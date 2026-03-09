import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, Loader2, GraduationCap } from "lucide-react";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === "ADMIN" ? "/admin" : "/faculty", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === "admin") { setEmail("admin@college.edu"); setPassword("password"); }
    else { setEmail("anitha@college.edu"); setPassword("password"); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgLight dark:bg-bgDark p-4"
         style={{ background: "linear-gradient(135deg, #EDE9FE 0%, #F0F4FF 50%, #FEE2E2 100%)" }}>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary shadow-lg mb-4">
            <GraduationCap size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-textMain">Faculty Workload System</h1>
          <p className="text-textMuted text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-cardDark rounded-3xl shadow-xl border border-border dark:border-borderDark p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-group">
              <label className="label">Email address</label>
              <input
                type="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                className="input" placeholder="you@college.edu"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"} required
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="input pr-11" placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textMain transition-colors">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <div className="alert-error">{error}</div>}

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : "Sign In"}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-5 border-t border-border dark:border-borderDark">
            <p className="text-xs text-textMuted text-center mb-3">Demo accounts</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => fillDemo("admin")}
                className="py-2 px-3 text-xs rounded-xl border border-border dark:border-borderDark hover:bg-gray-50 dark:hover:bg-gray-700 text-textMuted hover:text-textMain transition-all">
                👤 Admin Login
              </button>
              <button onClick={() => fillDemo("faculty")}
                className="py-2 px-3 text-xs rounded-xl border border-border dark:border-borderDark hover:bg-gray-50 dark:hover:bg-gray-700 text-textMuted hover:text-textMain transition-all">
                🎓 Faculty Login
              </button>
            </div>
            <p className="text-[10px] text-textMuted text-center mt-2 opacity-60">
              Note: Update seed.sql with correct bcrypt hashes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}