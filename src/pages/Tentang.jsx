export default function Tentang() {
  return (
    <main className="flex-1 h-full w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center px-4 py-12">
      <section className="w-full max-w-5xl flex flex-col md:flex-row items-center gap-12 mx-auto">
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-1 leading-tight text-center drop-shadow-sm">
            Bersama, Membangun Kebersamaan<br />
            <span className="text-blue-600">Prototype Community</span>
          </h1>
        </div>
      </section>
      <section className="w-full max-w-5xl mx-auto mt-6 text-center text-gray-700 text-lg bg-white/60 rounded-2xl shadow p-6 border border-blue-50">
        <p className="mb-2 font-semibold text-blue-900">PrototypeApp adalah lingkungan yang hangat, penuh semangat gotong royong dan kekeluargaan.</p>
        <p className="text-gray-500">Aplikasi ini hadir untuk memudahkan komunikasi, berbagi dokumentasi, dan mempererat kolaborasi antar warga serta pengurus. Mari bersama-sama menciptakan suasana yang nyaman, aktif, dan saling mendukung.</p>
      </section>
      <section className="w-full flex flex-col items-center justify-center mt-12">
        <div className="w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-lg border border-blue-100 bg-gray-100 flex items-center justify-center mx-auto">
          <div className="text-center text-gray-400">
            <span className="text-6xl block mb-4">🎬</span>
            <p className="text-lg">Video placeholder</p>
          </div>
        </div>
      </section>
    </main>
  );
}
