import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { adminLogin } from "@/lib/theme-api";
import { setAdminSession } from "@/lib/auth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await adminLogin(email, password);
      setAdminSession({
        token: data.token,
        email: data.email,
        username: data.username,
      });
      navigate("/admin/theme", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl"
      >
        <p className="text-xs uppercase tracking-wide text-lime-400">Admin only</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">Theme Studio Login</h1>
        <p className="mt-2 text-sm text-slate-400">
          Sign in with an account in the <code className="text-slate-300">admin</code> group.
        </p>

        <label className="mt-6 block text-sm text-slate-300">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none ring-lime-500 focus:ring-2"
          />
        </label>

        <label className="mt-4 block text-sm text-slate-300">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none ring-lime-500 focus:ring-2"
          />
        </label>

        {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

        <Button type="submit" disabled={loading} className="mt-6 w-full">
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
