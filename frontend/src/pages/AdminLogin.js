import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { API, setToken } from "../lib/api";
import axios from "axios";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatErr = (detail) => {
    if (!detail) return "Login failed. Please try again.";
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) return detail.map((e) => e.msg || JSON.stringify(e)).join(" ");
    return String(detail);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(`${API}/auth/login`, { email, password });
      setToken(data.token);
      navigate("/admin");
    } catch (err) {
      setError(formatErr(err.response?.data?.detail));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A1E3F] flex items-center justify-center p-4" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={26} className="text-[#0284C7]" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-white/60 text-sm mt-1">Junagadh CPE Study Chapter</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-2xl space-y-5" data-testid="admin-login-form">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                data-testid="admin-login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@junagadhcpe.org"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                data-testid="admin-login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent"
                required
              />
            </div>
          </div>
          {error && <p data-testid="admin-login-error" className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg p-3">{error}</p>}
          <button
            type="submit"
            data-testid="admin-login-submit"
            disabled={loading}
            className="w-full py-3 bg-[#0A1E3F] text-white font-semibold rounded-lg hover:bg-[#173059] transition-colors disabled:opacity-60 text-sm"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
