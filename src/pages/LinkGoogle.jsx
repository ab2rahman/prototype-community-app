import { useState } from "react";
import { updateMockUserData } from "../mocks/auth";

export default function LinkGoogle() {
  const [status, setStatus] = useState("");

  const handleLink = async () => {
    setStatus("");
    try {
      updateMockUserData({ googleLinked: true });
      setStatus("Akun Google berhasil di-link-kan! (Demo)");
    } catch (err) {
      setStatus("Gagal link akun Google: " + err.message);
    }
  };

  return (
    <main className="flex-1 h-full w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center px-4 py-12">
      <section className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Link Google ke Akun</h2>
          <button onClick={handleLink} className="bg-green-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-green-700 transition w-full">
            Link dengan Google (Mock)
          </button>
          {status && <div className={`mt-4 text-center text-sm ${status.includes('berhasil') ? 'text-green-600' : 'text-red-600'}`}>{status}</div>}
        </div>
      </section>
    </main>
  );
}
