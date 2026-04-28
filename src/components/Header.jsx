import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../useAuth";
import { getUserRoleFromLocal } from "../mocks/firebase";
import { useState } from "react";

export default function Header() {
  const { user, userRole } = useAuth();
  const local = getUserRoleFromLocal();
  const effectiveRole = local.role || userRole;
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Tentang", exact: true },
    { to: "/dokumentasi", label: "Dokumentasi" },
    { to: "/paguyuban", label: "Paguyuban" },
    { to: "/pengurus", label: "Pengurus", show: user && effectiveRole === 'pengurus' },
    { to: "/warga", label: "Warga", show: user },
  ];

  const isActive = (to, exact) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to) && to !== "/";
  };

  return (
    <header className="sticky top-4 z-50 w-full flex justify-center pointer-events-none">
      <div className="pointer-events-auto bg-white/90 backdrop-blur-lg shadow-lg rounded-2xl border border-gray-100 max-w-5xl w-[95%] mx-auto flex items-center justify-between px-4 md:px-8 h-16 mt-2">
        <Link
          to={user ? (effectiveRole === 'pengurus' ? '/pengurus' : '/warga') : '/'}
          className="flex items-center flex-shrink-0 gap-2"
        >
          <span className="text-2xl">🏘️</span>
          <span className="font-bold text-gray-800 text-lg">PrototypeApp</span>
        </Link>

        <button
          className="lg:hidden ml-2 p-2 rounded-md hover:bg-blue-100 transition focus:outline-none"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 8h16M4 16h16"} />
          </svg>
        </button>

        <nav className="hidden lg:flex items-center gap-2 lg:gap-4 mx-auto">
          {navLinks.map(
            ({ to, label, exact, show }) =>
              (show === undefined || show) && (
                <Link
                  key={to}
                  to={to}
                  className={
                    `px-4 py-2 rounded-lg font-semibold text-base text-gray-700 transition ` +
                    `hover:bg-blue-100 ` +
                    (isActive(to, exact) ? 'bg-blue-100' : '')
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              )
          )}
        </nav>

        {menuOpen && (
          <nav className="flex flex-col items-start gap-2 absolute top-20 left-0 w-full bg-white/95 shadow-lg rounded-xl p-4 z-50 lg:hidden">
            {navLinks.map(
              ({ to, label, exact, show }) =>
                (show === undefined || show) && (
                  <Link
                    key={to}
                    to={to}
                    className={
                      `w-full px-4 py-2 rounded-lg font-semibold text-base text-gray-700 transition ` +
                      `hover:bg-blue-100 ` +
                      (isActive(to, exact) ? 'bg-blue-100' : '')
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                )
            )}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {user ? (
            <Link to="/logout" className="px-5 py-2 bg-gray-900 text-white rounded-full font-bold shadow hover:bg-gray-800 transition text-base">Logout</Link>
          ) : (
            <Link to="/login" className="px-5 py-2 bg-blue-600 text-white rounded-full font-bold shadow hover:bg-blue-700 transition text-base">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}
