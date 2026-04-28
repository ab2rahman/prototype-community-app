import { useState } from "react";
import { auth } from "../mocks/firebase";
import { getMockUserData } from "../mocks/auth";
import { saveUserRoleToLocal } from "../mocks/firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const result = await auth.signInWithEmailAndPassword(email || "demo@prototype.local", password || "demo");
      const userData = getMockUserData();
      if (userData) {
        saveUserRoleToLocal(userData.role, userData.roleType);
        if (userData.mustChangePassword) {
          navigate("/change-password");
        } else {
          if (userData.role === "pengurus") navigate("/pengurus");
          else navigate("/warga");
        }
      } else {
        setError("User data not found.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await auth.signInWithPopup();
      const userData = getMockUserData();
      if (userData) {
        saveUserRoleToLocal(userData.role, userData.roleType);
        navigate("/warga");
      }
    } catch (err) {
      setError("Google login failed.");
    }
  };

  return (
    <main className="flex-1 h-full w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center px-4 py-12">
      <section className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full">
          <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Login PrototypeApp</h2>
          <p className="text-sm text-gray-500 text-center mb-6">Use any email & password to login (demo)</p>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email (any email works)"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password (anything works)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button type="submit" className="bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 transition">Login</button>
          </form>
          <div className="mt-4 flex flex-col gap-2">
            <button onClick={handleGoogle} className="bg-red-500 text-white rounded-lg px-4 py-2 font-semibold hover:bg-red-600 transition">Login dengan Google (Mock)</button>
          </div>
          <div className="mt-6 text-xs text-gray-400 text-center">
            <p>Demo accounts:</p>
            <p><strong>pengurus@prototype.local</strong> → Admin view</p>
            <p><strong>warga@prototype.local</strong> → Member view</p>
            <p>Or just type any email + any password</p>
          </div>
        </div>
      </section>
    </main>
  );
}
