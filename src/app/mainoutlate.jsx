import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import navLinks from "@/navmenu";

function MainOutlate() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900/95 shadow-sm backdrop-blur">
        <div className="relative mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-3">
          <nav className="hidden items-center justify-center gap-1 md:flex" aria-label="Main">
            {navLinks.map(({ label, to }) => {
              const active = to === "/" ? location.pathname === "/" : location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-blue-950/80 text-blue-300"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white md:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>

        {open && (
          <nav
            className="flex flex-col border-t border-slate-700 bg-slate-900 px-4 py-3 md:hidden"
            aria-label="Mobile main"
          >
            {navLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="rounded-lg px-3 py-3 text-base font-medium text-slate-200 hover:bg-slate-800"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
        <Outlet />
      </main>

      <footer className="border-t border-slate-700 bg-slate-900 py-6 text-center text-sm text-slate-500">
        <p>© 2026 Adcelerate. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default MainOutlate;
