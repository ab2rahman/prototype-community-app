const struktur = [
  { title: "Ketua", names: ["John Doe A1"] },
  { title: "Wakil Ketua", names: ["Mike Johnson A9"] },
  { title: "Sekretaris", names: ["David Chen AC6"] },
  { title: "Bendahara Umum", names: ["Robert Brown AB5"] },
  { title: "Bendahara Acara", names: ["Tom Wilson AB12"] },
  {
    title: "Acara & Informasi",
    names: [
      "Steve Park AE10",
      "Chris Lee AC2",
      "James Kim A2",
      "Andy Wu AD8",
      "Kevin Yang AE4",
      "Brian Tan AB3",
    ],
  },
  {
    title: "Keamanan, Ketertiban & Sarana",
    names: ["Rianto Manurung A1", "Agus Sugiarto R1"],
  },
  {
    title: "Kepemudaan & Olahraga",
    names: ["Ryan Park AE6", "Daniel Aziz AE7"],
  },
  { title: "Kebersihan", names: ["Irvan Fajri AB1", "Bayu Santana B4"] },
  { title: "PJ Row A1 (AA & A)", names: ["James Kim A2"] },
  { title: "PJ Row A2 (A)", names: ["Mike Johnson A9"] },
  { title: "PJ Row B", names: ["Bayu Santana B4"] },
  { title: "PJ Row AB", names: ["Robert Brown AB5"] },
  { title: "PJ Row AC", names: ["Chris Lee AC2"] },
  { title: "PJ Row AD", names: ["Andy Wu AD8"] },
  { title: "PJ Row AE + R", names: ["Ryan Park AE6"] },
];

export default function Paguyuban() {
  return (
    <main className="flex-1 h-full w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center px-4 py-12">
      <section className="w-full max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center text-gray-800">
            Community Organization
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-2">
            Organization ini adalah wadah kebersamaan, gotong royong, dan
            kolaborasi seluruh warga. Bersama, kita
            membangun lingkungan yang nyaman, aman, dan penuh kegiatan positif
            untuk seluruh keluarga. Setiap pengurus dan bidang berperan aktif
            dalam menjaga keharmonisan, keamanan, kebersihan, serta menyukseskan
            berbagai acara dan kegiatan di lingkungan kita.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold mb-6 text-center text-gray-800">
            Organization Structure
          </h3>
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col md:flex-row md:justify-center gap-4 w-full">
              <OrgCard title={struktur[0].title} names={struktur[0].names} />
            </div>
            <div className="flex flex-col md:flex-row md:justify-center gap-4 w-full">
              <OrgCard title={struktur[1].title} names={struktur[1].names} />
            </div>
            <div className="flex flex-col md:flex-row md:justify-center gap-4 w-full">
              <OrgCard title={struktur[2].title} names={struktur[2].names} />
              <OrgCard title={struktur[3].title} names={struktur[3].names} />
              <OrgCard title={struktur[4].title} names={struktur[4].names} />
            </div>
            <div className="flex flex-col md:flex-row md:justify-center gap-4 w-full">
              <OrgCard title={struktur[5].title} names={struktur[5].names} />
            </div>
            <div className="flex flex-col md:flex-row md:justify-center gap-4 w-full">
              <OrgCard title={struktur[6].title} names={struktur[6].names} />
              <OrgCard title={struktur[7].title} names={struktur[7].names} />
              <OrgCard title={struktur[8].title} names={struktur[8].names} />
            </div>
            <div className="w-full mt-8">
              <h4 className="text-lg font-bold mb-4 text-center text-blue-700">
                PJ Row Block
              </h4>
              <p className="text-gray-600 text-center max-w-3xl mx-auto mb-6">
                Penanggung jawab (PJ) masing-masing blok berperan sebagai
                penghubung antara warga blok dan pengurus pusat, penyambung
                informasi penting, serta membantu koordinasi iuran, keluhan, dan
                kebutuhan warga di lingkungannya.
              </p>
              <div className="flex flex-col md:flex-row md:justify-center gap-4 w-full">
                {struktur.slice(9, 12).map((s, i) => (
                  <OrgCard key={i} title={s.title} names={s.names} />
                ))}
              </div>
              <br />
              <div className="flex flex-col md:flex-row md:justify-center gap-4 w-full">
                {struktur.slice(12).map((s, i) => (
                  <OrgCard key={i} title={s.title} names={s.names} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function OrgCard({ title, names }) {
  return (
    <div className="flex-1 min-w-[180px] max-w-xs bg-blue-50 border border-blue-200 rounded-xl shadow p-4 flex flex-col items-center">
      <div className="font-semibold text-blue-900 text-center mb-1">{title}</div>
      <div className="text-gray-700 text-center text-sm">
        {names.map((n, i) => (
          <div key={i}>{n}</div>
        ))}
      </div>
    </div>
  );
}
