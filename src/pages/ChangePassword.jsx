import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateMockUserData } from "../mocks/auth";
import { auth } from "../mocks/firebase";

export default function ChangePassword({ force }) {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      updateMockUserData({ mustChangePassword: false });
      setSuccess("Password berhasil diganti! (Demo)");
      setTimeout(() => {
        if (force) navigate("/login");
        else navigate("/");
      }, 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="flex-1 h-full w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center px-4 py-12">
      <section className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Ganti Password</h2>
          <form onSubmit={handleChange} className="flex flex-col gap-4">
            <input type="password" placeholder="Password baru" value={newPassword} onChange={e => setNewPassword(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" required />
            <button type="submit" className="bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 transition">Ganti Password</button>
          </form>
          {error && <div className="text-red-500 text-sm text-center mt-4">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center mt-4">{success}</div>}
          {!force && (
            <button onClick={async () => { await auth.signOut(); navigate('/login'); }}
              className="mt-4 bg-gray-300 text-gray-700 rounded-lg px-4 py-2 font-semibold hover:bg-gray-400 transition w-full">Logout</button>
          )}
        </div>
      </section>
    </main>
  );
}
