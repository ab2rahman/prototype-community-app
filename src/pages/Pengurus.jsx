import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { getUserRoleFromLocal } from "../mocks/firebase";
import { dummyKas, dummyInfoPenting, dummyAssets, dummyUsers, dummyDokumen, dummyVisiMisi, dummyPeminjaman } from "../mocks/data";

export default function Pengurus() {
  const local = getUserRoleFromLocal();
  const effectiveRole = local.roleType;
  const [tab, setTab] = useState(() => {
    const saved = localStorage.getItem("pengurusTab");
    const tabNum = saved ? parseInt(saved, 10) : 5;
    return tabNum === 0 ? 5 : tabNum;
  });

  useEffect(() => { localStorage.setItem("pengurusTab", tab.toString()); }, [tab]);

  const tabClass = (idx) =>
    `px-4 py-2 font-semibold rounded-t-lg border-b-2 transition-all duration-200 ${
      tab === idx ? "border-blue-600 text-blue-700 bg-blue-50" : "border-transparent text-gray-500 hover:text-blue-600 hover:bg-blue-50"
    }`;

  const canSeeTambahUser = ["ketua", "wakil ketua", "sekretaris"].includes((effectiveRole || "").toLowerCase());

  return (
    <main className="flex-1 h-full w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center px-4 py-12">
      <section className="w-full max-w-5xl mx-auto min-h-screen">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col items-center w-full">
          <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Halaman Pengurus</h2>
          <p className="mb-4 text-gray-600 text-center">Panel pengelolaan administrasi, keuangan, dan data warga.</p>
          <div className="flex w-full justify-center gap-2 mb-6 border-b border-gray-200 flex-wrap">
            <button className={tabClass(5)} onClick={() => setTab(5)}>Visi Misi</button>
            <button className={tabClass(1)} onClick={() => setTab(1)}>Keuangan</button>
            <button className={tabClass(2)} onClick={() => setTab(2)}>Daftar Asset</button>
            <button className={tabClass(3)} onClick={() => setTab(3)}>Data Warga</button>
            <button className={tabClass(4)} onClick={() => setTab(4)}>Dokumen</button>
            {canSeeTambahUser && <button className={tabClass(7)} onClick={() => setTab(7)}>Tambah User</button>}
          </div>
          <div className="w-full">
            {tab === 1 && <TabKeuangan />}
            {tab === 2 && <TabAsset />}
            {tab === 3 && <TabDataWarga />}
            {tab === 4 && <TabDokumen />}
            {tab === 5 && <TabVisiMisi />}
            {tab === 7 && canSeeTambahUser && <TabTambahUser />}
          </div>
        </div>
      </section>
    </main>
  );
}

function TabKeuangan() {
  const [activeView, setActiveView] = useState("overview");

  const mockPemasukan = [
    { id: 'p-1', tanggal: '2026-04-01', keterangan: 'IPL April - AB2 John Doe', jumlah: 200000 },
    { id: 'p-2', tanggal: '2026-04-01', keterangan: 'IPL April - B3 Bob Johnson', jumlah: 200000 },
    { id: 'p-3', tanggal: '2026-04-02', keterangan: 'IPL April - AC4 Alice Williams', jumlah: 200000 },
    { id: 'p-4', tanggal: '2026-04-07', keterangan: 'IPL April - AD5 Charlie Brown', jumlah: 200000 },
    { id: 'p-5', tanggal: '2026-04-12', keterangan: 'Sumbangan sukarela - AE6 Diana', jumlah: 200000 },
    { id: 'p-6', tanggal: '2026-04-18', keterangan: 'IPL April - A2 Edward Norton', jumlah: 200000 },
  ];

  const mockPengeluaran = [
    { id: 'e-1', tanggal: '2026-04-03', keterangan: 'Biaya petugas kebersihan April', jumlah: 500000, kategori: 'Kebersihan' },
    { id: 'e-2', tanggal: '2026-04-05', keterangan: 'Honor satpam April', jumlah: 600000, kategori: 'Keamanan' },
    { id: 'e-3', tanggal: '2026-04-10', keterangan: 'Persiapan 17 Agustusan', jumlah: 350000, kategori: 'Acara' },
    { id: 'e-4', tanggal: '2026-04-15', keterangan: 'Perbaikan lampu jalan blok A', jumlah: 150000, kategori: 'Pemeliharaan' },
  ];

  const totalPemasukan = mockPemasukan.reduce((s, i) => s + i.jumlah, 0);
  const totalPengeluaran = mockPengeluaran.reduce((s, i) => s + i.jumlah, 0);
  const saldoBersih = totalPemasukan - totalPengeluaran;

  const iplData = dummyUsers.map(u => ({
    userName: `${u.blok} - ${u.nama}`,
    blok: u.blok,
    balance: u.blok.startsWith('A') ? 50000 : u.blok.startsWith('B') ? -30000 : 100000,
    status: u.uid === 'warga-004' ? 'Belum' : 'Lunas',
    jumlah: u.uid === 'warga-004' ? '' : '200000',
    auditStatus: u.uid === 'warga-004' ? '' : 'Approved',
    tanggal: u.uid === 'warga-004' ? '' : '2026-04-15',
    buktiFileName: u.uid === 'warga-004' ? '' : 'bukti-transfer.jpg',
  }));

  const parseBlok = (blok) => {
    const match = String(blok).match(/^([A-Za-z]+)(\d+)$/);
    if (!match) return { prefix: String(blok).toUpperCase(), number: 999 };
    return { prefix: match[1].toUpperCase(), number: parseInt(match[2], 10) };
  };

  const sortedIpl = [...iplData].sort((a, b) => {
    const pa = parseBlok(a.blok), pb = parseBlok(b.blok);
    if (pa.prefix !== pb.prefix) return pa.prefix.localeCompare(pb.prefix);
    return pa.number - pb.number;
  });

  const fmt = (n) => n.toLocaleString("id-ID", { style: "currency", currency: "IDR" });

  return (
    <div>
      {/* Sub-tabs matching original */}
      <div className="flex border-b mb-4 overflow-x-auto">
        {[
          { id: "overview", label: "OVERVIEW" },
          { id: "cashflow", label: "CASH FLOW MONTHLY" },
          { id: "mutasi", label: "MUTASI REKENING" },
          { id: "rekapIuran", label: "REKAP IURAN" },
        ].map(t => (
          <button key={t.id} type="button" onClick={() => setActiveView(t.id)}
            className={`flex-1 min-w-[120px] px-3 py-2 text-xs md:text-sm font-semibold text-center border-b-2 transition-colors ${
              activeView === t.id ? "border-blue-500 text-blue-600 bg-blue-50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeView === "overview" && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg mb-2 text-green-700">Ringkasan Keuangan</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-green-50 border border-green-100">
              <p className="text-xs text-gray-600 mb-1">Total Pemasukan</p>
              <p className="text-xl font-bold text-green-700">{fmt(totalPemasukan)}</p>
              <p className="text-[11px] text-gray-500 mt-1">Termasuk IPL dan pemasukan manual, periode 2026</p>
            </div>
            <div className="p-4 rounded-xl bg-red-50 border border-red-100">
              <p className="text-xs text-gray-600 mb-1">Total Pengeluaran</p>
              <p className="text-xl font-bold text-red-700">{fmt(totalPengeluaran)}</p>
              <p className="text-[11px] text-gray-500 mt-1">Total semua pengeluaran manual Tahun 2026</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
              <p className="text-xs text-gray-600 mb-1">Saldo Bersih</p>
              <p className={`text-xl font-bold ${saldoBersih >= 0 ? "text-blue-700" : "text-red-700"}`}>{fmt(saldoBersih)}</p>
              <p className="text-[11px] text-gray-500 mt-1">Total pemasukan dikurangi pengeluaran</p>
            </div>
          </div>
        </div>
      )}

      {/* CASH FLOW MONTHLY */}
      {activeView === "cashflow" && (
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-base mb-2 text-green-700">Pemasukan</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border rounded-lg">
                <thead className="bg-green-100">
                  <tr>
                    <th className="px-3 py-2 border text-left">Tanggal</th>
                    <th className="px-3 py-2 border text-left">Keterangan</th>
                    <th className="px-3 py-2 border text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-green-50 font-bold">
                    <td className="px-3 py-2 border" colSpan="2">Total April 2026</td>
                    <td className="px-3 py-2 border text-right text-green-700">{fmt(totalPemasukan)}</td>
                  </tr>
                  {mockPemasukan.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border">{p.tanggal}</td>
                      <td className="px-3 py-2 border">{p.keterangan}</td>
                      <td className="px-3 py-2 border text-right text-green-700 font-semibold">{fmt(p.jumlah)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-base mb-2 text-red-700">Pengeluaran</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border rounded-lg">
                <thead className="bg-red-100">
                  <tr>
                    <th className="px-3 py-2 border text-left">Tanggal</th>
                    <th className="px-3 py-2 border text-left">Kategori</th>
                    <th className="px-3 py-2 border text-left">Keterangan</th>
                    <th className="px-3 py-2 border text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-red-50 font-bold">
                    <td className="px-3 py-2 border" colSpan="3">Total April 2026</td>
                    <td className="px-3 py-2 border text-right text-red-700">{fmt(totalPengeluaran)}</td>
                  </tr>
                  {mockPengeluaran.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border">{p.tanggal}</td>
                      <td className="px-3 py-2 border">
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700">{p.kategori}</span>
                      </td>
                      <td className="px-3 py-2 border">{p.keterangan}</td>
                      <td className="px-3 py-2 border text-right text-red-700 font-semibold">{fmt(p.jumlah)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MUTASI REKENING */}
      {activeView === "mutasi" && (
        <div>
          <h3 className="font-bold text-lg mb-2 text-green-700">Mutasi Rekening</h3>
          <p className="text-sm text-gray-500 mb-4">Gabungan pemasukan & pengeluaran (seperti rekening koran)</p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 border text-left">Tanggal</th>
                  <th className="px-3 py-2 border text-left">Keterangan</th>
                  <th className="px-3 py-2 border text-right">Masuk</th>
                  <th className="px-3 py-2 border text-right">Keluar</th>
                </tr>
              </thead>
              <tbody>
                {[...mockPemasukan.map(p => ({ ...p, type: 'masuk' })), ...mockPengeluaran.map(p => ({ ...p, type: 'keluar' }))]
                  .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
                  .map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-3 py-2 border">{item.tanggal}</td>
                      <td className="px-3 py-2 border">{item.keterangan}</td>
                      <td className="px-3 py-2 border text-right">{item.type === 'masuk' ? <span className="text-green-700 font-semibold">{fmt(item.jumlah)}</span> : '-'}</td>
                      <td className="px-3 py-2 border text-right">{item.type === 'keluar' ? <span className="text-red-700 font-semibold">{fmt(item.jumlah)}</span> : '-'}</td>
                    </tr>
                  ))}
                <tr className="bg-blue-50 font-bold">
                  <td className="px-3 py-2 border" colSpan="2">Saldo Bersih</td>
                  <td className="px-3 py-2 border text-right text-green-700">{fmt(totalPemasukan)}</td>
                  <td className="px-3 py-2 border text-right text-red-700">{fmt(totalPengeluaran)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REKAP IURAN (IPL) — with Audit functionality */}
      {activeView === "rekapIuran" && (
        <TabRekapIuran
          dummyUsers={dummyUsers}
          totalPemasukan={totalPemasukan}
          fmt={fmt}
        />
      )}
    </div>
  );
}

function TabRekapIuran({ dummyUsers, totalPemasukan, fmt }) {
  const [iplRows, setIplRows] = useState(() =>
    dummyUsers.map(u => ({
      userName: `${u.blok} - ${u.nama}`,
      blok: u.blok,
      balance: u.blok.startsWith('A') ? 50000 : u.blok.startsWith('B') ? -30000 : 100000,
      status: u.uid === 'warga-004' ? 'Belum' : 'Lunas',
      jumlah: u.uid === 'warga-004' ? '' : '200000',
      auditStatus: u.uid === 'warga-004' ? '' : 'Approved',
      tanggal: u.uid === 'warga-004' ? '' : '2026-04-15',
      buktiFileName: u.uid === 'warga-004' ? '' : 'bukti-transfer.jpg',
    }))
  );
  const [auditEditKey, setAuditEditKey] = useState(null);
  const [auditEditData, setAuditEditData] = useState({});
  const [auditLoading, setAuditLoading] = useState(false);

  const parseBlok = (blok) => {
    const match = String(blok).match(/^([A-Za-z]+)(\d+)$/);
    if (!match) return { prefix: String(blok).toUpperCase(), number: 999 };
    return { prefix: match[1].toUpperCase(), number: parseInt(match[2], 10) };
  };
  const sortedIpl = [...iplRows].sort((a, b) => {
    const pa = parseBlok(a.blok), pb = parseBlok(b.blok);
    if (pa.prefix !== pb.prefix) return pa.prefix.localeCompare(pb.prefix);
    return pa.number - pb.number;
  });

  const sudahBayar = iplRows.filter(r => r.status === 'Lunas').length;
  const belumBayar = iplRows.filter(r => r.status !== 'Lunas').length;

  const handleStartAudit = (row, idx) => {
    setAuditEditKey(idx);
    setAuditEditData({
      jumlah: row.jumlah || '',
      status: row.status || 'Belum',
      tanggal: row.tanggal || '',
      buktiFileName: row.buktiFileName || '',
    });
  };

  const handleCancelAudit = () => {
    setAuditEditKey(null);
    setAuditEditData({});
  };

  const handleSaveAudit = async (idx) => {
    setAuditLoading(true);
    await new Promise(r => setTimeout(r, 500));
    setIplRows(prev => prev.map((row, i) => {
      if (i !== idx) return row;
      return {
        ...row,
        jumlah: auditEditData.jumlah,
        status: auditEditData.status,
        tanggal: auditEditData.tanggal,
        buktiFileName: auditEditData.buktiFileName || row.buktiFileName,
        auditStatus: 'Approved',
      };
    }));
    setAuditEditKey(null);
    setAuditEditData({});
    setAuditLoading(false);
  };

  const handleAuditFileChange = (idx, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAuditEditData(prev => ({ ...prev, buktiFileName: file.name }));
  };

  return (
    <div>
      <h3 className="font-bold text-lg mb-2 text-green-700">IPL Warga Per Bulan</h3>
      <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h4 className="font-bold text-sm text-purple-800 mb-3">Ringkasan Iuran Bulanan 2026</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="bg-white px-3 py-2 rounded border">
            <span className="text-gray-600 text-xs">Total Rumah:</span>{" "}
            <span className="font-bold text-purple-700">{iplRows.length}</span>
          </div>
          <div className="bg-white px-3 py-2 rounded border">
            <span className="text-gray-600 text-xs">Sudah Bayar:</span>{" "}
            <span className="font-bold text-green-700">{sudahBayar}</span>
          </div>
          <div className="bg-white px-3 py-2 rounded border">
            <span className="text-gray-600 text-xs">Belum Bayar:</span>{" "}
            <span className="font-bold text-red-700">{belumBayar}</span>
          </div>
          <div className="bg-white px-3 py-2 rounded border">
            <span className="text-gray-600 text-xs">Total April:</span>{" "}
            <span className="font-bold text-green-700">{fmt(totalPemasukan)}</span>
          </div>
        </div>
      </div>
      {auditLoading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg px-6 py-4 shadow-md text-center text-sm text-gray-700 flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
            <div>Menyimpan audit...</div>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border rounded-lg">
          <thead className="bg-green-100">
            <tr className="whitespace-nowrap">
              <th className="px-3 py-2 border">Blok</th>
              <th className="px-3 py-2 border sticky left-0 z-10 bg-green-100">Nama</th>
              <th className="px-3 py-2 border">Status</th>
              <th className="px-3 py-2 border">Audit</th>
              <th className="px-3 py-2 border">Tgl Bayar</th>
              <th className="px-3 py-2 border">Jumlah</th>
              <th className="px-3 py-2 border">Bukti</th>
              <th className="px-3 py-2 border">Saldo</th>
              <th className="px-3 py-2 border sticky right-0 z-10 bg-green-100">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sortedIpl.map((row, i) => {
              const isEditing = auditEditKey === i;
              const isApproved = row.auditStatus === 'Approved';
              const editData = isEditing ? auditEditData : {};
              return (
                <tr key={i} className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} ${isEditing ? "ring-2 ring-blue-300" : ""}`}>
                  <td className="px-3 py-2 border font-semibold">{row.blok}</td>
                  <td className="px-3 py-2 border sticky left-0 z-10 bg-inherit font-medium">{row.userName}</td>
                  <td className="px-3 py-2 border">
                    {isEditing ? (
                      <select
                        value={editData.status || 'Belum'}
                        onChange={e => setAuditEditData(prev => ({ ...prev, status: e.target.value }))}
                        className="border rounded px-2 py-1 text-xs"
                      >
                        <option value="Belum">Belum</option>
                        <option value="Lunas">Lunas</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${row.status === 'Lunas' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {row.status || 'Belum'}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 border">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${row.auditStatus === 'Approved' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                      {row.auditStatus || 'Belum Di-audit'}
                    </span>
                  </td>
                  <td className="px-3 py-2 border">
                    {isEditing ? (
                      <input
                        type="date"
                        value={editData.tanggal || ''}
                        onChange={e => setAuditEditData(prev => ({ ...prev, tanggal: e.target.value }))}
                        className="border rounded px-2 py-1 text-xs w-full"
                      />
                    ) : (
                      <span className="text-xs">{row.tanggal || '-'}</span>
                    )}
                  </td>
                  <td className="px-3 py-2 border text-right">
                    {isEditing ? (
                      <input
                        type="text"
                        inputMode="numeric"
                        value={editData.jumlah || ''}
                        onChange={e => setAuditEditData(prev => ({ ...prev, jumlah: e.target.value.replace(/\D/g, '') }))}
                        className="border rounded px-2 py-1 text-xs w-full text-right"
                        placeholder="0"
                      />
                    ) : (
                      <span className="font-semibold text-green-700">
                        {row.jumlah ? fmt(parseInt(row.jumlah)) : '-'}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 border text-xs">
                    {isEditing ? (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleAuditFileChange(i, e)}
                        className="w-full text-xs"
                      />
                    ) : (
                      <span className="text-gray-600">{row.buktiFileName || '-'}</span>
                    )}
                  </td>
                  <td className={`px-3 py-2 border text-right font-semibold ${row.balance >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                    {fmt(row.balance)}
                  </td>
                  <td className="px-3 py-2 border text-center sticky right-0 z-10 bg-inherit">
                    {isApproved && !isEditing ? (
                      <span className="text-xs text-gray-400 italic">Approved</span>
                    ) : isEditing ? (
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          className="px-2 py-1 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700 whitespace-nowrap"
                          onClick={() => handleSaveAudit(i)}
                          disabled={auditLoading}
                        >
                          {auditLoading ? "..." : "Simpan & Approve"}
                        </button>
                        <button
                          type="button"
                          className="px-2 py-1 bg-gray-400 text-white rounded text-xs font-semibold hover:bg-gray-500"
                          onClick={handleCancelAudit}
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700"
                        onClick={() => handleStartAudit(row, i)}
                      >
                        Audit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabAsset() {
  const [assets] = useState(dummyAssets);
  const [peminjaman] = useState(dummyPeminjaman);
  return (
    <div>
      <h3 className="font-bold text-lg mb-3 text-gray-700">Daftar Asset</h3>
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full text-sm border rounded-lg">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-3 py-2 border">Nama</th>
              <th className="px-3 py-2 border">Kategori</th>
              <th className="px-3 py-2 border">Kondisi</th>
              <th className="px-3 py-2 border">Lokasi</th>
              <th className="px-3 py-2 border">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-3 py-2 border font-semibold">{a.nama}</td>
                <td className="px-3 py-2 border">{a.kategori}</td>
                <td className="px-3 py-2 border">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${a.kondisi === 'Baik' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{a.kondisi}</span>
                </td>
                <td className="px-3 py-2 border">{a.lokasi}</td>
                <td className="px-3 py-2 border text-center">{a.jumlah}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 className="font-bold text-lg mb-3 text-gray-700">Peminjaman Barang</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border rounded-lg">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-3 py-2 border">Peminjam</th>
              <th className="px-3 py-2 border">Barang</th>
              <th className="px-3 py-2 border">Jumlah</th>
              <th className="px-3 py-2 border">Tgl Pinjam</th>
              <th className="px-3 py-2 border">Keperluan</th>
              <th className="px-3 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {peminjaman.map((p, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-3 py-2 border">{p.peminjam}</td>
                <td className="px-3 py-2 border font-semibold">{p.barang}</td>
                <td className="px-3 py-2 border text-center">{p.jumlah}</td>
                <td className="px-3 py-2 border">{p.tanggalPinjam}</td>
                <td className="px-3 py-2 border">{p.keperluan}</td>
                <td className="px-3 py-2 border">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    p.status === 'dikembalikan' ? 'bg-green-100 text-green-700' :
                    p.status === 'dipinjam' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabDataWarga() {
  const [search, setSearch] = useState("");
  const filtered = dummyUsers.filter(u => {
    if (!search) return true;
    const s = search.toLowerCase();
    return Object.values(u).some(v => String(v).toLowerCase().includes(s));
  });

  function handleExportExcel() {
    const exportData = filtered.map(r => ({
      Nama: r.nama, Blok: r.blok, Role: r.role, Email: r.email, 'No HP': r.noHP,
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DataWarga");
    XLSX.writeFile(wb, "data_warga_prototype.xlsx");
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input type="text" placeholder="Cari warga..." value={search} onChange={e => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-200" />
        <button onClick={handleExportExcel} className="bg-green-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-green-700 transition">
          Export Excel
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border rounded-lg">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-3 py-2 border text-left">Nama</th>
              <th className="px-3 py-2 border text-left">Blok</th>
              <th className="px-3 py-2 border text-left">Role</th>
              <th className="px-3 py-2 border text-left">Email</th>
              <th className="px-3 py-2 border text-left">No HP</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-3 py-2 border font-semibold">{u.nama}</td>
                <td className="px-3 py-2 border">{u.blok}</td>
                <td className="px-3 py-2 border">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${u.role === 'pengurus' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>{u.role}</span>
                </td>
                <td className="px-3 py-2 border">{u.email}</td>
                <td className="px-3 py-2 border">{u.noHP}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-xs text-gray-500 mt-2">Total: {filtered.length} warga</div>
    </div>
  );
}

function TabDokumen() {
  return (
    <div>
      <h3 className="font-bold text-lg mb-3 text-gray-700">Dokumen Penting</h3>
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

function TabVisiMisi() {
  return (
    <div>
      <h3 className="font-bold text-lg mb-3 text-gray-700">Visi & Misi</h3>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-4">
        <h4 className="font-bold text-blue-900 mb-2">Visi</h4>
        <p className="text-gray-700">{dummyVisiMisi.visi}</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="font-bold text-gray-800 mb-2">Misi</h4>
        <ol className="list-decimal list-inside space-y-2">
          {dummyVisiMisi.misi.map((m, i) => (
            <li key={i} className="text-gray-700">{m}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function TabTambahUser() {
  const [nama, setNama] = useState("");
  const [blok, setBlok] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("warga");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(`User "${nama}" (Blok ${blok}) berhasil ditambahkan sebagai ${role}! (Demo only)`);
    setNama(""); setBlok(""); setEmail(""); setRole("warga");
  };

  return (
    <div className="max-w-md mx-auto">
      <h3 className="font-bold text-lg mb-4 text-gray-700">Tambah User Baru</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input type="text" placeholder="Nama Lengkap" value={nama} onChange={e => setNama(e.target.value)} required
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
        <input type="text" placeholder="Blok (contoh: AB2)" value={blok} onChange={e => setBlok(e.target.value)} required
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
        <select value={role} onChange={e => setRole(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200">
          <option value="warga">Warga</option>
          <option value="pengurus">Pengurus</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 transition">Tambah User</button>
        {success && <div className="text-green-600 text-sm text-center">{success}</div>}
      </form>
    </div>
  );
}
