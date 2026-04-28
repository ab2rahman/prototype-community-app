import { useState, useEffect, useMemo } from "react";
import { auth } from "../mocks/firebase";
import { getMockUserData } from "../mocks/auth";
import { useNavigate } from "react-router-dom";
import { dummyInfoPenting, dummyUsers, dummyDokumen } from "../mocks/data";
import TabHistoryKas from "./TabHistoryKas";

const monthNames = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

function generateKasRows() {
  const rows = [];
  for (let year = 2026; year <= 2027; year++) {
    for (let m = 0; m < 12; m++) {
      const isPast = year === 2026 && m < 3; // Jan-Mar 2026 are "paid" for demo
      rows.push({
        bulan: `${monthNames[m]} ${year}`,
        status: isPast ? "Lunas" : "",
        auditStatus: isPast ? "Approved" : "",
        tanggal: isPast ? `2026-0${m+1}-15` : "",
        jumlah: isPast ? "200000" : "",
        bukti: isPast ? "demo-bukti.jpg" : "",
        buktiFileName: isPast ? "AB2-2026-bukti.jpg" : "",
      });
    }
  }
  return rows;
}

const getNominalForBlokByMonth = (blok, bulanLabel) => {
  if (!blok || !bulanLabel) return 200000;
  const parts = bulanLabel.split(" ");
  if (parts.length < 2) return 200000;
  const monthName = parts[0];
  const year = parseInt(parts[1], 10);
  const monthIndex = monthNames.indexOf(monthName);
  // Before April 2026: lower rates; After: unified 200k
  if (year < 2026 || (year === 2026 && monthIndex < 3)) {
    return 150000; // simplified old rate
  }
  return 200000;
};

export default function Warga() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(() => {
    const saved = localStorage.getItem('wargaTab');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => { localStorage.setItem('wargaTab', tab.toString()); }, [tab]);

  const tabClass = (idx) =>
    `px-4 py-2 font-semibold rounded-t-lg border-b-2 transition-all duration-200 ${
      tab === idx ? "border-blue-600 text-blue-700 bg-blue-50" : "border-transparent text-gray-500 hover:text-blue-600 hover:bg-blue-50"
    }`;

  // ─── Kas State (for TabHistoryKas) ───
  const [kasRows, setKasRows] = useState(generateKasRows);
  const [kasEditIdx, setKasEditIdx] = useState(null);
  const [kasLoading, setKasLoading] = useState(false);
  const [kasSuccess, setKasSuccess] = useState("");
  const [kasError, setKasError] = useState("");
  const [kasPage, setKasPage] = useState(0);
  const userData = getMockUserData();
  const userBlok = userData?.blok || "AB2";
  const defaultNominal = 200000;
  const initialBalance = 500000;

  const kasRowsPerPage = 12;
  const kasPageCount = Math.ceil(kasRows.length / kasRowsPerPage);
  const kasRowsToShow = kasRows.slice(kasPage * kasRowsPerPage, (kasPage + 1) * kasRowsPerPage);

  const handleKasCellChange = (idx, field, value) => {
    setKasRows(prev => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };

  const updateKasStatus = (idx, bukti, tanggal, jumlah) => {
    setKasRows(prev => prev.map((row, i) => {
      if (i !== idx) return row;
      const status = tanggal && jumlah && bukti ? "Lunas" : row.status;
      return { ...row, status };
    }));
  };

  const handleKasFileChange = async (idx, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setKasLoading(true);
    // Simulate upload delay
    await new Promise(r => setTimeout(r, 500));
    setKasRows(prev => prev.map((row, i) => {
      if (i !== idx) return row;
      return { ...row, buktiFileName: file.name, bukti: file.name, status: row.tanggal ? "Lunas" : row.status };
    }));
    setKasSuccess(`File ${file.name} berhasil diupload! (Demo)`);
    setKasLoading(false);
  };

  const handleKasSave = async (idx) => {
    setKasLoading(true);
    await new Promise(r => setTimeout(r, 300));
    const row = kasRows[idx];
    const status = row.buktiFileName && row.tanggal ? "Lunas" : "Belum";
    setKasRows(prev => prev.map((r, i) => i === idx ? { ...r, status } : r));
    setKasSuccess("Data kas berhasil disimpan! (Demo)");
    setKasLoading(false);
  };

  const handleKasMultiPay = async ({ startMonth, startYear, endMonth, endYear, tanggal, jumlah, file }) => {
    setKasLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const startKey = startYear * 12 + startMonth;
    const endKey = endYear * 12 + endMonth;
    const fileName = file?.name || "bukti-demo.jpg";
    setKasRows(prev => prev.map(row => {
      const [bulanStr, tahunStr] = row.bulan.split(" ");
      const bulanIdx = monthNames.findIndex(m => m === bulanStr);
      const tahun = parseInt(tahunStr, 10);
      const key = tahun * 12 + bulanIdx;
      if (key < startKey || key > endKey) return row;
      if (row.auditStatus === "Approved") return row;
      const isFirstMonth = key === startKey;
      return { ...row, tanggal, jumlah: isFirstMonth ? jumlah : 0, buktiFileName: fileName, bukti: fileName, status: "Lunas" };
    }));
    setKasSuccess("Pembayaran kas untuk beberapa bulan berhasil disimpan! (Demo)");
    setKasLoading(false);
  };

  return (
    <main className="flex-1 h-full w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center px-4 py-12">
      <section className="w-full max-w-5xl mx-auto min-h-screen">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col items-center w-full">
          <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Halaman Warga</h2>
          <p className="mb-4 text-gray-600 text-center">Selamat datang, warga Prototype Community!</p>
          <div className="flex w-full justify-center gap-2 mb-6 border-b border-gray-200 flex-wrap">
            <button className={tabClass(0)} onClick={() => setTab(0)}>Info Penting</button>
            <button className={tabClass(1)} onClick={() => setTab(1)}>Iuran Bulanan</button>
            <button className={tabClass(2)} onClick={() => setTab(2)}>Data Warga</button>
            <button className={tabClass(3)} onClick={() => setTab(3)}>Dokumen</button>
            <button className={tabClass(4)} onClick={() => setTab(4)}>Pengaturan</button>
          </div>
          <div className="w-full">
            {tab === 0 && <TabInfoPenting />}
            {tab === 1 && (
              <TabHistoryKas
                kasRowsToShow={kasRowsToShow}
                kasRows={kasRows}
                defaultNominalPerBulan={defaultNominal}
                initialBalance={initialBalance}
                kasEditIdx={kasEditIdx}
                kasLoading={kasLoading}
                kasSuccess={kasSuccess}
                kasError={kasError}
                kasPage={kasPage}
                kasPageCount={kasPageCount}
                handleKasCellChange={handleKasCellChange}
                updateKasStatus={updateKasStatus}
                handleKasFileChange={handleKasFileChange}
                handleKasSave={handleKasSave}
                handleKasMultiPay={handleKasMultiPay}
                setKasEditIdx={setKasEditIdx}
                setKasPage={setKasPage}
                monthNames={monthNames}
                blok={userBlok}
                getNominalForBlokByMonth={getNominalForBlokByMonth}
              />
            )}
            {tab === 2 && <TabDataWarga />}
            {tab === 3 && <TabDokumenWarga />}
            {tab === 4 && <TabPengaturan navigate={navigate} />}
          </div>
        </div>
      </section>
    </main>
  );
}

function TabInfoPenting() {
  const [saran, setSaran] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setSaran("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div>
      <h3 className="font-bold text-lg mb-4 text-gray-700">Info Penting</h3>
      <div className="space-y-4 mb-8">
        {dummyInfoPenting.map((info) => (
          <div key={info.id} className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-semibold text-gray-800">{info.judul}</h4>
              <span className="text-xs text-gray-500">{info.tanggal}</span>
            </div>
            <p className="text-gray-600 text-sm">{info.isi}</p>
            <div className="text-xs text-gray-400 mt-1">oleh {info.penulis}</div>
          </div>
        ))}
      </div>
      <div className="bg-gray-50 border-l-4 border-gray-400 p-4 text-gray-800 text-sm rounded">
        <b>Kotak Saran atau Masukan</b>
        <form className="flex flex-col gap-2 mt-2" onSubmit={handleSubmit}>
          <textarea className="border rounded px-2 py-1 w-full" placeholder="Tulis saran, kritik, atau ide..."
            required value={saran} onChange={e => setSaran(e.target.value)} rows={3} />
          <button type="submit" className="bg-blue-600 text-white rounded px-4 py-1 font-semibold hover:bg-blue-700 transition w-fit">
            Kirim Saran
          </button>
          {sent && <div className="text-green-600 text-xs mt-1">Saran berhasil dikirim! (Demo)</div>}
        </form>
      </div>
    </div>
  );
}

function TabDataWarga() {
  const [rows, setRows] = useState([
    { namaLengkap: 'Demo User', namaPanggilan: 'Demo', jenisKelamin: 'Laki-laki', tanggalLahir: '1990-01-15', statusKeluarga: 'Kepala Rumah Tangga', agama: 'Islam', pekerjaan: 'Software Engineer', noHp: '081200000000' },
  ]);

  const handleChange = (idx, field, value) => {
    const updated = [...rows];
    updated[idx] = { ...updated[idx], [field]: value };
    setRows(updated);
  };

  const addRow = () => {
    setRows([...rows, { namaLengkap: '', namaPanggilan: '', jenisKelamin: '', tanggalLahir: '', statusKeluarga: '', agama: '', pekerjaan: '', noHp: '' }]);
  };

  const removeRow = (idx) => {
    setRows(rows.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <h3 className="font-bold text-lg mb-3 text-gray-700">Data Warga</h3>
      <p className="text-sm text-gray-500 mb-4">Data anggota keluarga di rumah Anda (demo).</p>
      {rows.map((row, idx) => (
        <div key={idx} className="bg-gray-50 border rounded-xl p-4 mb-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder="Nama Lengkap" value={row.namaLengkap} onChange={e => handleChange(idx, 'namaLengkap', e.target.value)}
              className="border rounded px-2 py-1 text-sm" />
            <input type="text" placeholder="Nama Panggilan" value={row.namaPanggilan} onChange={e => handleChange(idx, 'namaPanggilan', e.target.value)}
              className="border rounded px-2 py-1 text-sm" />
            <select value={row.jenisKelamin} onChange={e => handleChange(idx, 'jenisKelamin', e.target.value)}
              className="border rounded px-2 py-1 text-sm">
              <option value="">Jenis Kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
            <input type="date" value={row.tanggalLahir} onChange={e => handleChange(idx, 'tanggalLahir', e.target.value)}
              className="border rounded px-2 py-1 text-sm" />
            <input type="text" placeholder="Pekerjaan" value={row.pekerjaan} onChange={e => handleChange(idx, 'pekerjaan', e.target.value)}
              className="border rounded px-2 py-1 text-sm" />
            <input type="text" placeholder="No HP" value={row.noHp} onChange={e => handleChange(idx, 'noHp', e.target.value)}
              className="border rounded px-2 py-1 text-sm" />
          </div>
          {rows.length > 1 && (
            <button onClick={() => removeRow(idx)} className="text-red-500 text-xs mt-2 hover:underline">Hapus anggota ini</button>
          )}
        </div>
      ))}
      <button onClick={addRow} className="bg-blue-600 text-white rounded px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition mt-2">
        + Tambah Anggota Keluarga
      </button>
    </div>
  );
}

function TabDokumenWarga() {
  return (
    <div>
      <h3 className="font-bold text-lg mb-3 text-gray-700">Dokumen</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {dummyDokumen.map((d, i) => (
          <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-3">
            <span className="text-3xl">📄</span>
            <div className="flex-1">
              <div className="font-semibold text-gray-800">{d.judul}</div>
              <div className="text-xs text-gray-500">{d.jenis} · {d.tanggal}</div>
              <a href={d.fileUrl} className="text-blue-600 text-sm hover:underline mt-1 inline-block">Download</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabPengaturan({ navigate }) {
  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <div className="max-w-md mx-auto">
      <h3 className="font-bold text-lg mb-4 text-gray-700">Pengaturan</h3>
      <div className="space-y-4">
        <div className="bg-gray-50 border rounded-xl p-4">
          <h4 className="font-semibold text-gray-800 mb-2">Akun</h4>
          <p className="text-sm text-gray-600">Anda login sebagai <b>Demo User</b></p>
          <p className="text-sm text-gray-600">Blok: <b>AB2</b></p>
        </div>
        <button onClick={() => navigate('/change-password')} className="bg-yellow-500 text-white rounded-lg px-4 py-2 font-semibold hover:bg-yellow-600 transition w-full">
          Ganti Password
        </button>
        <button onClick={() => navigate('/link-google')} className="bg-green-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-green-700 transition w-full">
          Link Google Account
        </button>
        <button onClick={handleLogout} className="bg-gray-900 text-white rounded-lg px-4 py-2 font-semibold hover:bg-gray-800 transition w-full">
          Logout
        </button>
      </div>
    </div>
  );
}
