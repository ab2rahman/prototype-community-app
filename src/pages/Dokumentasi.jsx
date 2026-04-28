const doks = [
  {
    title: "2026 Community Clean-Up Day",
    desc: "Kegiatan kerja bakti warga 2026, mempererat solidaritas melalui gotong royong menjaga kebersihan dan kenyamanan lingkungan.",
    link: "#",
    thumb: null,
  },
  {
    title: "2025 Independence Day Celebration",
    desc: "Kemeriahan perayaan Hari Kemerdekaan, penuh kebersamaan, tawa, dan semangat persatuan.",
    link: "#",
    thumb: null,
  },
  {
    title: "2025 Community Gathering",
    desc: "Momen kebersamaan dalam acara Gathering 2025, mempererat tali silaturahmi antar warga.",
    link: "#",
    thumb: null,
  },
  {
    title: "2024 Independence Day Celebration",
    desc: "Kemeriahan perayaan Hari Kemerdekaan, penuh kebersamaan, tawa, dan semangat persatuan.",
    link: "#",
    thumb: null,
  },
];

export default function Dokumentasi() {
  return (
    <main className="flex-1 h-full w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center px-4 py-12">
      <section className="w-full max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold mb-2 text-center text-gray-800 drop-shadow">
          Event Documentation
        </h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto text-lg">
          Kumpulan momen kebersamaan, keceriaan, dan semangat kekeluargaan dari
          berbagai acara yang telah diselenggarakan. Setiap dokumentasi adalah bukti nyata eratnya persaudaraan dan kekompakan warga.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {doks.map((d, i) => (
            <a
              key={i}
              href={d.link}
              target="_blank"
              rel="noopener"
              className="group block rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white hover:shadow-2xl hover:border-blue-300 transition-all duration-300"
            >
              <div className="relative w-full h-40 overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <span className="text-4xl">📸</span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-80 pointer-events-none" />
              </div>
              <div className="p-4">
                <div className="font-bold text-gray-800 text-base mb-1 group-hover:text-blue-700 transition">
                  {d.title}
                </div>
                {d.desc && (
                  <div className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {d.desc}
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
