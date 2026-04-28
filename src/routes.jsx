import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/Login";
import Pengurus from "./pages/Pengurus";
import Warga from "./pages/Warga";
import ChangePassword from "./pages/ChangePassword";
import LinkGoogle from "./pages/LinkGoogle";
import Tentang from "./pages/Tentang";
import Dokumentasi from "./pages/Dokumentasi";
import Paguyuban from "./pages/Paguyuban";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useAuth } from "./useAuth";
import { auth } from "./mocks/firebase";
import { getUserRoleFromLocal } from "./mocks/firebase";

function ProtectedRoute({ children, role }) {
  const { user, userRole, loading, mustChangePassword } = useAuth();
  const local = getUserRoleFromLocal();
  const effectiveRole = local.role || userRole;
  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-500">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (mustChangePassword) return <Navigate to="/change-password" />;
  if (role && effectiveRole !== role) return <Navigate to="/" />;
  return children;
}

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Router basename="/prototype/community-app">
      <div className="flex flex-col min-h-screen font-[Inter,ui-sans-serif,system-ui,sans-serif]">
        <Header />
        <main className="flex-1 pb-16">
          <Routes>
            <Route path="/" element={<Tentang />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/tentang" element={<Tentang />} />
            <Route path="/dokumentasi" element={<Dokumentasi />} />
            <Route path="/paguyuban" element={<Paguyuban />} />
            <Route path="/change-password" element={
              <ProtectedRoute>
                <ChangePassword force={true} />
              </ProtectedRoute>
            } />
            <Route path="/pengurus" element={
              <ProtectedRoute role="pengurus">
                <Pengurus />
              </ProtectedRoute>
            } />
            <Route path="/warga" element={
              <ProtectedRoute>
                <Warga />
              </ProtectedRoute>
            } />
            <Route path="/link-google" element={
              <ProtectedRoute>
                <LinkGoogle />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    auth.signOut();
    navigate('/');
  }, [navigate]);
  return null;
}
