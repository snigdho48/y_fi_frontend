import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { isAdminLoggedIn, clearAdminSession, getAdminUser } from "@/lib/auth";

export default function AdminLayout() {
  const location = useLocation();
  const isLogin = location.pathname === "/admin/login";

  if (!isLogin && !isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }

  if (isLogin) {
    return <Outlet />;
  }

  const user = getAdminUser();

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/90 px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">FreeYFi Admin</p>
            <h1 className="text-lg font-semibold text-white">Theme Studio</h1>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <Link
              to="/admin/theme"
              className="rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Editor
            </Link>
            <Link
              to="/"
              className="rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              Public site
            </Link>
            <span className="hidden text-slate-500 sm:inline">{user?.email}</span>
            <button
              type="button"
              className="rounded-lg bg-slate-800 px-3 py-2 text-slate-200 hover:bg-slate-700"
              onClick={() => {
                clearAdminSession();
                window.location.href = "/admin/login";
              }}
            >
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
