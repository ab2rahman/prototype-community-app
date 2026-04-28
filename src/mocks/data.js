// Dummy seed data for the prototype
// All names, emails, addresses are fictional

export const dummyUsers = [
  { uid: 'pengurus-001', nama: 'John Admin', blok: 'A1', role: 'pengurus', roleType: 'admin', email: 'pengurus@prototype.local', noHP: '081200001111', mustChangePassword: false, googleLinked: false },
  { uid: 'warga-001', nama: 'Jane Smith', blok: 'AB2', role: 'warga', roleType: 'member', email: 'warga@prototype.local', noHP: '081200002222', mustChangePassword: false, googleLinked: false },
  { uid: 'warga-002', nama: 'Bob Johnson', blok: 'B3', role: 'warga', roleType: 'member', email: 'bob@prototype.local', noHP: '081200003333', mustChangePassword: false, googleLinked: true },
  { uid: 'warga-003', nama: 'Alice Williams', blok: 'AC4', role: 'warga', roleType: 'member', email: 'alice@prototype.local', noHP: '081200004444', mustChangePassword: false, googleLinked: false },
  { uid: 'warga-004', nama: 'Charlie Brown', blok: 'AD5', role: 'warga', roleType: 'member', email: 'charlie@prototype.local', noHP: '081200005555', mustChangePassword: true, googleLinked: false },
  { uid: 'warga-005', nama: 'Diana Prince', blok: 'AE6', role: 'warga', roleType: 'member', email: 'diana@prototype.local', noHP: '081200006666', mustChangePassword: false, googleLinked: true },
  { uid: 'warga-006', nama: 'Edward Norton', blok: 'A2', role: 'warga', roleType: 'member', email: 'edward@prototype.local', noHP: '081200007777', mustChangePassword: false, googleLinked: false },
  { uid: 'warga-007', nama: 'Fiona Apple', blok: 'AB7', role: 'warga', roleType: 'member', email: 'fiona@prototype.local', noHP: '081200008888', mustChangePassword: false, googleLinked: false },
];

export const dummyKas = {
  summary: {
    totalIuranBulanan: 2450000,
    totalPengeluaran: 1800000,
    saldo: 650000,
    iuranBulananPerWarga: 50000,
    bulan: 'April 2026',
  },
  history: [
    { id: 'kas-001', tanggal: '2026-04-01', jenis: 'masuk', kategori: 'Iuran Bulanan', keterangan: 'Iuran April - Jane Smith AB2', jumlah: 50000, blok: 'AB2' },
    { id: 'kas-002', tanggal: '2026-04-01', jenis: 'masuk', kategori: 'Iuran Bulanan', keterangan: 'Iuran April - Bob Johnson B3', jumlah: 50000, blok: 'B3' },
    { id: 'kas-003', tanggal: '2026-04-02', jenis: 'masuk', kategori: 'Iuran Bulanan', keterangan: 'Iuran April - Alice Williams AC4', jumlah: 50000, blok: 'AC4' },
    { id: 'kas-004', tanggal: '2026-04-03', jenis: 'keluar', kategori: 'Kebersihan', keterangan: 'Biaya petugas kebersihan April', jumlah: 500000, blok: '' },
    { id: 'kas-005', tanggal: '2026-04-05', jenis: 'keluar', kategori: 'Keamanan', keterangan: 'Honor satpam April', jumlah: 600000, blok: '' },
    { id: 'kas-006', tanggal: '2026-04-07', jenis: 'masuk', kategori: 'Iuran Bulanan', keterangan: 'Iuran April - Charlie Brown AD5', jumlah: 50000, blok: 'AD5' },
    { id: 'kas-007', tanggal: '2026-04-10', jenis: 'keluar', kategori: 'Acara', keterangan: 'Persiapan 17 Agustusan', jumlah: 350000, blok: '' },
    { id: 'kas-008', tanggal: '2026-04-12', jenis: 'masuk', kategori: 'Sumbangan', keterangan: 'Sumbangan sukarela - Diana Prince AE6', jumlah: 200000, blok: 'AE6' },
    { id: 'kas-009', tanggal: '2026-04-15', jenis: 'keluar', kategori: 'Pemeliharaan', keterangan: 'Perbaikan lampu jalan blok A', jumlah: 150000, blok: 'A' },
    { id: 'kas-010', tanggal: '2026-04-18', jenis: 'masuk', kategori: 'Iuran Bulanan', keterangan: 'Iuran April - Edward Norton A2', jumlah: 50000, blok: 'A2' },
  ],
};

export const dummyInfoPenting = [
  { id: 'info-001', judul: 'Jadwal Kerja Bakti April 2026', isi: 'Kerja bakti akan dilaksanakan pada Sabtu, 25 April 2026 pukul 07:00 WIB. Diharapkan seluruh warga berpartisipasi.', tanggal: '2026-04-20', penulis: 'John Admin' },
  { id: 'info-002', judul: 'Perbaikan Saluran Air Blok B', isi: 'Akan dilakukan perbaikan saluran air di area blok B pada hari Senin-Rabu. Mohon maaf atas ketidaknyamanan.', tanggal: '2026-04-18', penulis: 'John Admin' },
  { id: 'info-003', judul: 'Iuran Bulanan April', isi: 'Mohon untuk menyelesaikan iuran bulanan April sebelum tanggal 25. Iuran dapat disetor kepada PJ blok masing-masing.', tanggal: '2026-04-15', penulis: 'John Admin' },
  { id: 'info-004', judul: 'Perayaan Hari Kartini', isi: 'Acara perayaan Hari Kartini akan diadakan di taman komplek pada 21 April. Ada lomba dan doorprize!', tanggal: '2026-04-12', penulis: 'Jane Smith' },
  { id: 'info-005', judul: 'Pemilihan Ketua Baru 2026-2028', isi: 'Pemilihan ketua paguyuban periode baru akan dilaksanakan bulan depan. Calon ketua dapat mendaftar melalui sekretaris.', tanggal: '2026-04-10', penulis: 'John Admin' },
];

export const dummyDokumen = [
  { id: 'dok-001', judul: 'SK Pengurus 2026-2028', jenis: 'SK', tanggal: '2026-01-01', fileUrl: '#', fileName: 'sk_pengurus_2026.pdf' },
  { id: 'dok-002', judul: 'Laporan Keuangan Q1 2026', jenis: 'Laporan', tanggal: '2026-04-01', fileUrl: '#', fileName: 'laporan_keuangan_q1.pdf' },
  { id: 'dok-003', judul: 'AD/ART Paguyuban', jenis: 'Regulasi', tanggal: '2025-06-15', fileUrl: '#', fileName: 'ad_art.pdf' },
  { id: 'dok-004', judul: 'Notulensi Rapat April 2026', jenis: 'Notulensi', tanggal: '2026-04-10', fileUrl: '#', fileName: 'notulensi_apr.pdf' },
  { id: 'dok-005', judul: 'Foto Kegiatan 17 Agustus 2025', jenis: 'Dokumentasi', tanggal: '2025-08-17', fileUrl: '#', fileName: 'foto_17an.zip' },
];

export const dummyAssets = [
  { id: 'asset-001', nama: 'Tenda Besar 6x12m', kategori: 'Tenda', kondisi: 'Baik', lokasi: 'Gudang Blok A', jumlah: 2 },
  { id: 'asset-002', nama: 'Kursi Lipat', kategori: 'Furniture', kondisi: 'Baik', lokasi: 'Gudang Blok A', jumlah: 100 },
  { id: 'asset-003', nama: 'Sound System Portable', kategori: 'Elektronik', kondisi: 'Baik', lokasi: 'Rangkapan Pengurus', jumlah: 1 },
  { id: 'asset-004', nama: 'Panggung Portable 3x3m', kategori: 'Panggung', kondisi: 'Cukup', lokasi: 'Gudang Blok A', jumlah: 1 },
  { id: 'asset-005', nama: 'Spanduk Banner Roll Up', kategori: 'Dekorasi', kondisi: 'Baik', lokasi: 'Rangkapan Pengurus', jumlah: 3 },
  { id: 'asset-006', nama: 'Kotak P3K', kategori: 'Kesehatan', kondisi: 'Baik', lokasi: 'Pos Keamanan', jumlah: 2 },
];

export const dummyPeminjaman = [
  { id: 'pinjam-001', peminjam: 'Jane Smith', blok: 'AB2', barang: 'Tenda Besar 6x12m', jumlah: 1, tanggalPinjam: '2026-04-10', tanggalKembali: '2026-04-12', status: 'dikembalikan', keperluan: 'Acara ulang tahun anak' },
  { id: 'pinjam-002', peminjam: 'Bob Johnson', blok: 'B3', barang: 'Sound System Portable', jumlah: 1, tanggalPinjam: '2026-04-15', tanggalKembali: '2026-04-15', status: 'dipinjam', keperluan: 'Pengajian blok' },
  { id: 'pinjam-003', peminjam: 'Alice Williams', blok: 'AC4', barang: 'Kursi Lipat', jumlah: 20, tanggalPinjam: '2026-04-20', tanggalKembali: '2026-04-21', status: 'pending', keperluan: 'Acara arisan' },
  { id: 'pinjam-004', peminjam: 'Charlie Brown', blok: 'AD5', barang: 'Panggung Portable 3x3m', jumlah: 1, tanggalPinjam: '2026-04-25', tanggalKembali: '2026-04-26', status: 'pending', keperluan: 'Lomba 17 Agustusan' },
];

export const dummyVisiMisi = {
  visi: 'Menjadi lingkungan hunian yang nyaman, aman, dan harmonis dengan semangat gotong royong serta kepedulian antar warga.',
  misi: [
    'Meningkatkan kebersamaan dan kekeluargaan antar warga melalui kegiatan rutin dan acara komunitas.',
    'Menjaga kebersihan, keamanan, dan kenyamanan lingkungan secara bersama-sama.',
    'Mengelola keuangan paguyuban secara transparan dan akuntabel.',
    'Memfasilitasi komunikasi yang efektif antara pengurus dan warga.',
    'Mendorong partisipasi aktif seluruh warga dalam pembangunan lingkungan.',
  ],
};
