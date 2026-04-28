import { useState, useMemo, useEffect } from "react";

export default function TabHistoryKas({
  kasRowsToShow,
  kasRows,
  defaultNominalPerBulan,
  initialBalance,
  kasEditIdx,
  kasLoading,
  kasSuccess,
  kasError,
  kasPage,
  kasPageCount,
  handleKasCellChange,
  updateKasStatus,
  handleKasFileChange,
  handleKasSave,
  handleKasMultiPay,
  setKasEditIdx,
  setKasPage,
  monthNames,
  blok,
  getNominalForBlokByMonth,
}) {
  const handleFileValidation = (file) => {
    if (!file) return true;
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/jpg",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("⚠️ Hanya file foto (JPG, PNG, GIF, WebP) yang diperbolehkan!");
      return false;
    }
    return true;
  };

  const today = new Date();
  const [startMonth, setStartMonth] = useState(null);
  const [startYear, setStartYear] = useState(null);
  const [endMonth, setEndMonth] = useState(null);
  const [endYear, setEndYear] = useState(null);
  const [tanggalBayar, setTanggalBayar] = useState(
    today.toISOString().slice(0, 10),
  );
  const [nominalPerBulan, setNominalPerBulan] = useState("");
  const [buktiFile, setBuktiFile] = useState(null);
  const [popupClosed, setPopupClosed] = useState(false);

  // Derive popup state from props
  const hasMessage = Boolean(kasSuccess || kasError);
  const popupType = kasSuccess ? "success" : "error";
  const popupMessage = kasSuccess || kasError || "";
  const showPopup = hasMessage && !popupClosed;

  // Reset closed state when message changes
  useEffect(() => {
    if (hasMessage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPopupClosed(false);
    }
  }, [hasMessage]);

  // Auto-hide popup after 4 seconds
  // useEffect(() => {
  //   if (showPopup) {
  //     const timer = setTimeout(() => {
  //       setPopupClosed(true);
  //     }, 4000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [showPopup]);

  const derivedYears = Array.from(
    new Set(
      (kasRows || [])
        .map((row) => {
          const parts = String(row.bulan || "").split(" ");
          const yearNum = parseInt(parts[1], 10);
          return Number.isNaN(yearNum) ? null : yearNum;
        })
        .filter((y) => y !== null),
    ),
  ).sort((a, b) => a - b);

  const availableYears =
    derivedYears.length > 0
      ? derivedYears
      : Array.from({ length: 5 }, (_, i) => today.getFullYear() - 1 + i);

  const isMonthApprovedForYear = (monthIdx, year) => {
    if (!kasRows) return false;
    const label = `${monthNames[monthIdx]} ${year}`;
    const found = kasRows.find((r) => r.bulan === label);
    return found?.auditStatus === "Approved";
  };

  const getFirstNotApprovedMonthIndex = (year, fromMonthIdx = 0) => {
    for (let m = fromMonthIdx; m < monthNames.length; m++) {
      if (!isMonthApprovedForYear(m, year)) {
        return m;
      }
    }
    return -1;
  };

  const isYearFullyApproved = (year) =>
    getFirstNotApprovedMonthIndex(year, 0) === -1;

  const computeDefaultPeriod = () => {
    if (!kasRows || kasRows.length === 0 || availableYears.length === 0) {
      return { year: today.getFullYear(), month: today.getMonth() };
    }
    for (const y of availableYears) {
      const idx = getFirstNotApprovedMonthIndex(y, 0);
      if (idx !== -1) {
        return { year: y, month: idx };
      }
    }
    // Semua tahun full approved: fallback ke tahun pertama dan bulan pertama
    return { year: availableYears[0], month: 0 };
  };

  const defaultPeriod = computeDefaultPeriod();

  const effectiveStartYear = startYear ?? defaultPeriod.year;
  const effectiveStartMonth = startMonth ?? defaultPeriod.month;
  const effectiveEndYear = endYear ?? effectiveStartYear;
  const effectiveEndMonth = endMonth ?? effectiveStartMonth;

  // Calculate suggested nominal inline (no useMemo needed)
  // Sums up all months in the selected period
  const getSuggestedNominal = () => {
    if (!blok || !getNominalForBlokByMonth) return defaultNominalPerBulan || 0;

    let total = 0;
    let currentYear = effectiveStartYear;
    let currentMonth = effectiveStartMonth;

    while (true) {
      const monthLabel = `${monthNames[currentMonth]} ${currentYear}`;
      total += getNominalForBlokByMonth(blok, monthLabel);

      // Check if we've reached the end month
      if (currentYear === effectiveEndYear && currentMonth === effectiveEndMonth) {
        break;
      }

      // Move to next month
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
    }

    return total;
  };

  // Use suggested nominal as default, but allow manual override
  const effectiveNominalString =
    nominalPerBulan !== ""
      ? nominalPerBulan
      : getSuggestedNominal().toLocaleString("id-ID");

  const ensureEndNotBeforeStart = (newStartMonth, newStartYear) => {
    const currentEndYear = endYear ?? newStartYear;
    const currentEndMonth = endMonth ?? newStartMonth;
    const startKey = newStartYear * 12 + newStartMonth;
    const endKey = currentEndYear * 12 + currentEndMonth;
    if (endKey < startKey) {
      setEndMonth(newStartMonth);
      setEndYear(newStartYear);
    }
  };

  const parseNominalNumber = () => {
    const digits = effectiveNominalString.replace(/\D/g, "");
    if (!digits) return 0;
    return parseInt(digits, 10) || 0;
  };

  const computedBalance = useMemo(() => {
    const baseNominal =
      typeof defaultNominalPerBulan === "number" && defaultNominalPerBulan > 0
        ? defaultNominalPerBulan
        : 0;

    if (!baseNominal || !Array.isArray(kasRows) || kasRows.length === 0) {
      return initialBalance || 0;
    }

    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12

    // Hitung total pembayaran yang sudah lunas
    let totalPaid = 0;
    kasRows.forEach((row) => {
      if (row.status === "Lunas" && row.jumlah) {
        totalPaid += parseInt(row.jumlah, 10) || 0;
      }
    });

    // Hitung tunggakan bulan berjalan dengan memperhitungkan perubahan rate dari April 2026
    let monthsOwed = 0;
    for (let m = 0; m < currentMonth; m++) {
      const monthLabel = `${monthNames[m]} ${now.getFullYear()}`;
      const nominalForMonth = getNominalForBlokByMonth
        ? getNominalForBlokByMonth(blok, monthLabel)
        : baseNominal;
      monthsOwed += nominalForMonth;
    }

    // Balance = balance awal + total bayar - tunggakan bulan berjalan
    return (initialBalance || 0) + totalPaid - monthsOwed;
  }, [defaultNominalPerBulan, kasRows, initialBalance, blok, getNominalForBlokByMonth, monthNames]);

  const handleSubmitMultiPay = async (e) => {
    e.preventDefault();
    if (!buktiFile) {
      alert("Silakan pilih bukti transfer terlebih dahulu.");
      return;
    }
    const nominalNumber = parseNominalNumber();
    if (!nominalNumber || nominalNumber <= 0) {
      alert("Nominal per bulan harus lebih dari 0.");
      return;
    }
    const startKey = effectiveStartYear * 12 + effectiveStartMonth;
    const endKey = effectiveEndYear * 12 + effectiveEndMonth;
    if (endKey < startKey) {
      alert("Bulan akhir tidak boleh sebelum bulan awal.");
      return;
    }
    await handleKasMultiPay({
      startMonth: effectiveStartMonth,
      startYear: effectiveStartYear,
      endMonth: effectiveEndMonth,
      endYear: effectiveEndYear,
      tanggal: tanggalBayar,
      jumlah: nominalNumber,
      file: buktiFile,
    });

    // Reset form setelah pembayaran
    setStartMonth(null);
    setStartYear(null);
    setEndMonth(null);
    setEndYear(null);
    setTanggalBayar(today.toISOString().slice(0, 10));
    setNominalPerBulan("");
    setBuktiFile(null);
  };

  const startKey = effectiveStartYear * 12 + effectiveStartMonth;
  const endKey = effectiveEndYear * 12 + effectiveEndMonth;
  const selectedMonthCount = endKey - startKey + 1;
  const isMultipleMonths = selectedMonthCount > 1;

  return (
    <div>
      {/* Success/Error Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/30 animate-fade-in">
          <div
            className={`relative max-w-md w-full mx-4 rounded-lg shadow-2xl p-4 ${
              popupType === "success" ? "bg-green-600" : "bg-red-600"
            } text-white`}
          >
            <button
              onClick={() => setPopupClosed(true)}
              className="absolute top-2 right-3 text-white/80 hover:text-white text-xl font-bold"
            >
              ×
            </button>
            <div className="flex items-start gap-3">
              <span className="text-2xl">
                {popupType === "success" ? "✅" : "⚠️"}
              </span>
              <p className="flex-1 text-sm font-medium">{popupMessage}</p>
            </div>
          </div>
        </div>
      )}

      {kasLoading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg px-6 py-4 shadow-md text-center text-sm text-gray-700 flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
            <div>Memproses pembayaran kas beberapa bulan...</div>
            <div className="text-xs text-gray-500 max-w-xs">
              Mohon tunggu sebentar dan jangan menutup atau me-refresh halaman
              ini sampai proses selesai.
            </div>
          </div>
        </div>
      )}
      <h3 className="font-bold text-lg mb-2 text-green-700">
        History Pembayaran Kas Bulanan
      </h3>
      <div className="mb-4 bg-blue-50 border-l-4 border-blue-400 p-4 text-blue-800 text-sm rounded">
        <b>Informasi Penting:</b> Silakan unggah bukti transfer pembayaran kas
        setiap bulan ke rekening:
        <div className="mt-1 flex items-center gap-2">
          <b className="select-all">
            Demo Bank Digital 0000 1111 2222 a.n. Demo Treasurer
          </b>
          <button
            onClick={() => {
              const text = "000011112222";
              navigator.clipboard
                .writeText(text)
                .then(() => {
                  alert("✓ Nomor rekening berhasil disalin!");
                })
                .catch(() => {
                  alert("❌ Gagal menyalin nomor rekening");
                });
            }}
            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            📋 Copy
          </button>
        </div>
        <div className="mt-2 text-xs text-blue-900 leading-relaxed">
          <div className="font-semibold mb-2">Rincian Iuran per Rumah:</div>

          {/* Table view for desktop/tablet */}
          <div className="hidden md:block">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-blue-100">
                  <th className="border border-blue-200 px-2 py-1 text-left">Periode</th>
                  <th className="border border-blue-200 px-2 py-1 text-left">Komponen</th>
                  <th className="border border-blue-200 px-2 py-1 text-left">Blok A</th>
                  <th className="border border-blue-200 px-2 py-1 text-left">Blok B</th>
                  <th className="border border-blue-200 px-2 py-1 text-left">Blok C</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-blue-200 px-2 py-1 font-semibold text-orange-600" rowSpan="2">
                    Januari - Maret 2026
                  </td>
                  <td className="border border-blue-200 px-2 py-1">Keamanan</td>
                  <td className="border border-blue-200 px-2 py-1">Rp 150.000</td>
                  <td className="border border-blue-200 px-2 py-1">-</td>
                  <td className="border border-blue-200 px-2 py-1">-</td>
                </tr>
                <tr>
                  <td className="border border-blue-200 px-2 py-1">Kebersihan + Kas + RT</td>
                  <td className="border border-blue-200 px-2 py-1">Rp 70.000</td>
                  <td className="border border-blue-200 px-2 py-1">Rp 70.000</td>
                  <td className="border border-blue-200 px-2 py-1">Rp 40.000</td>
                </tr>
                <tr className="bg-orange-50">
                  <td className="border border-blue-200 px-2 py-1"></td>
                  <td className="border border-blue-200 px-2 py-1 font-semibold">Total</td>
                  <td className="border border-blue-200 px-2 py-1 font-bold text-green-700">Rp 220.000</td>
                  <td className="border border-blue-200 px-2 py-1 font-bold text-green-700">Rp 70.000</td>
                  <td className="border border-blue-200 px-2 py-1 font-bold text-green-700">Rp 40.000</td>
                </tr>
                <tr>
                  <td className="border border-blue-200 px-2 py-1 font-semibold text-green-700" rowSpan="2">
                    April 2026 - seterusnya
                  </td>
                  <td className="border border-blue-200 px-2 py-1">Keamanan</td>
                  <td className="border border-blue-200 px-2 py-1">Rp 120.000</td>
                  <td className="border border-blue-200 px-2 py-1">Rp 120.000</td>
                  <td className="border border-blue-200 px-2 py-1">Rp 120.000</td>
                </tr>
                <tr>
                  <td className="border border-blue-200 px-2 py-1">Kebersihan + Kas + RT</td>
                  <td className="border border-blue-200 px-2 py-1">Rp 80.000</td>
                  <td className="border border-blue-200 px-2 py-1">Rp 80.000</td>
                  <td className="border border-blue-200 px-2 py-1">Rp 50.000</td>
                </tr>
                <tr className="bg-green-50">
                  <td className="border border-blue-200 px-2 py-1"></td>
                  <td className="border border-blue-200 px-2 py-1 font-semibold">Total</td>
                  <td className="border border-blue-200 px-2 py-1 font-bold text-green-700">Rp 200.000</td>
                  <td className="border border-blue-200 px-2 py-1 font-bold text-green-700">Rp 200.000</td>
                  <td className="border border-blue-200 px-2 py-1 font-bold text-green-700">Rp 170.000</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile view - list format */}
          <div className="md:hidden">
            <div className="mb-2">
              <span className="font-semibold text-orange-600">
                Januari - Maret 2026:
              </span>
              <ul className="list-disc list-inside ml-1 mb-1">
                <li>Iuran Keamanan: Rp 150.000</li>
                <li>Iuran Kebersihan: Rp 30.000</li>
                <li>Iuran Kas: Rp 30.000</li>
                <li>Iuran RT: Rp 10.000</li>
              </ul>
              <div className="mb-1">
                • Blok A: <b>Rp 220.000</b> per rumah
              </div>
              <div>
                • Blok B: <b>Rp 70.000</b> per rumah
              </div>
              <div>
                • Blok C: <b>Rp 40.000</b> per rumah
              </div>
            </div>
            <div>
              <span className="font-semibold text-green-700">
                April 2026 - seterusnya:
              </span>
              <div className="mb-1">
                • Blok A & B: <b>Rp 200.000</b> per rumah
              </div>
              <div>
                • Blok C: <b>Rp 170.000</b> per rumah
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-3 inline-flex items-baseline gap-2 rounded border border-green-300 bg-green-50 px-3 py-2 text-sm">
        <span className="font-semibold text-green-800">Saldo:</span>
        <span
          className={
            computedBalance < 0
              ? "text-red-600 font-semibold"
              : computedBalance > 0
                ? "text-green-700 font-semibold"
                : "text-gray-700"
          }
        >
          {computedBalance.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          })}
        </span>
        <span className="text-xs text-gray-600 italic">
          (Saldo = saldo 2025 + total bayar - tunggakan bulan berjalan)
        </span>
      </div>
      <div className="mb-6 bg-green-50 border border-green-300 rounded p-4 text-sm">
        <b>Form Bayar Iuran</b>
        <form
          className="mt-3 grid gap-3 md:grid-cols-2"
          onSubmit={handleSubmitMultiPay}
        >
          <div>
            <div className="text-xs font-semibold mb-1">Periode Awal</div>
            <div className="flex gap-2">
              <select
                className="border rounded px-2 py-1 w-1/2"
                value={effectiveStartMonth}
                onChange={(e) => {
                  const newMonth = Number(e.target.value);
                  setStartMonth(newMonth);
                  ensureEndNotBeforeStart(newMonth, effectiveStartYear);
                }}
              >
                {monthNames.map((m, idx) => (
                  <option
                    key={m}
                    value={idx}
                    disabled={isMonthApprovedForYear(idx, effectiveStartYear)}
                  >
                    {m}
                    {isMonthApprovedForYear(idx, effectiveStartYear)
                      ? " (Approved)"
                      : ""}
                  </option>
                ))}
              </select>
              <select
                className="border rounded px-2 py-1 w-1/2"
                value={effectiveStartYear}
                onChange={(e) => {
                  const newYear = Number(e.target.value);
                  setStartYear(newYear);
                  const firstIdx = getFirstNotApprovedMonthIndex(newYear, 0);
                  if (firstIdx !== -1) {
                    setStartMonth(firstIdx);
                    ensureEndNotBeforeStart(firstIdx, newYear);
                  } else {
                    setStartMonth(null);
                    setEndMonth(null);
                    setEndYear(null);
                  }
                }}
              >
                {availableYears.map((y) => (
                  <option key={y} value={y} disabled={isYearFullyApproved(y)}>
                    {y}
                    {isYearFullyApproved(y) ? " (Approved)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold mb-1">Periode Akhir</div>
            <div className="flex gap-2">
              <select
                className="border rounded px-2 py-1 w-1/2"
                value={effectiveEndMonth}
                onChange={(e) => setEndMonth(Number(e.target.value))}
              >
                {monthNames.map((m, idx) => {
                  const isBeforeStart = effectiveEndYear === effectiveStartYear && idx < effectiveStartMonth;
                  return (
                    <option
                      key={m}
                      value={idx}
                      disabled={isBeforeStart || isMonthApprovedForYear(idx, effectiveEndYear)}
                    >
                      {m}
                      {isMonthApprovedForYear(idx, effectiveEndYear)
                        ? " (Approved)"
                        : ""}
                    </option>
                  );
                })}
              </select>
              <select
                className="border rounded px-2 py-1 w-1/2"
                value={effectiveEndYear}
                onChange={(e) => {
                  const newYear = Number(e.target.value);
                  setEndYear(newYear);
                  const fromMonth =
                    newYear === effectiveStartYear ? effectiveStartMonth : 0;
                  const firstIdx = getFirstNotApprovedMonthIndex(
                    newYear,
                    fromMonth,
                  );
                  if (firstIdx !== -1) {
                    setEndMonth(firstIdx);
                  } else {
                    setEndMonth(null);
                  }
                }}
              >
                {availableYears.map((y) => (
                  <option key={y} value={y} disabled={isYearFullyApproved(y)}>
                    {y}
                    {isYearFullyApproved(y) ? " (Approved)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              Tanggal Bayar
            </label>
            <input
              type="date"
              className="border rounded px-2 py-1 w-full"
              value={tanggalBayar}
              onChange={(e) => setTanggalBayar(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              Total Bayar
            </label>
            <input
              key={`${effectiveStartYear}-${effectiveStartMonth}-${effectiveEndYear}-${effectiveEndMonth}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9.,]*"
              className="border rounded px-2 py-1 w-full"
              defaultValue={getSuggestedNominal().toLocaleString("id-ID")}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, "");
                const noLeadingZero = digitsOnly.replace(/^0+/, "");
                if (!noLeadingZero) {
                  setNominalPerBulan("");
                  return;
                }
                const numberValue = parseInt(noLeadingZero, 10);
                const formatted = numberValue.toLocaleString("id-ID");
                setNominalPerBulan(formatted);
              }}
              required
            />
            <div className="text-xs text-gray-500 mt-1">
              {(() => {
                let breakdown = [];
                let currentYear = effectiveStartYear;
                let currentMonth = effectiveStartMonth;
                while (true) {
                  const monthLabel = `${monthNames[currentMonth]} ${currentYear}`;
                  const nominal = getNominalForBlokByMonth && blok
                    ? getNominalForBlokByMonth(blok, monthLabel)
                    : 0;
                  breakdown.push(`${monthNames[currentMonth]}: Rp ${nominal.toLocaleString("id-ID")}`);
                  if (currentYear === effectiveEndYear && currentMonth === effectiveEndMonth) break;
                  currentMonth++;
                  if (currentMonth > 11) {
                    currentMonth = 0;
                    currentYear++;
                  }
                }
                return breakdown.join(" + ");
              })()}
            </div>
          </div>
          <div className="md:col-span-2 flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1">
                {isMultipleMonths
                  ? "Bukti Transfer (1 file untuk semua bulan)"
                  : "Bukti Transfer"}
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full text-xs"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (!handleFileValidation(file)) return;
                  setBuktiFile(file);
                }}
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded font-semibold text-sm hover:bg-green-700 disabled:opacity-60 md:w-auto w-full"
              disabled={kasLoading}
            >
              {kasLoading ? "Menyimpan..." : isMultipleMonths ? "Bayar Beberapa Bulan" : "Bayar"}
            </button>
          </div>
        </form>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border rounded-lg">
          <thead className="bg-green-100">
            <tr className="whitespace-nowrap">
              <th className="px-3 py-2 border">Bulan</th>
              <th className="px-3 py-2 border">Status</th>
              <th className="px-3 py-2 border">Status Audit</th>
              <th className="px-3 py-2 border">Tanggal Bayar</th>
              <th className="px-3 py-2 border min-w-[120px]">Jumlah Bayar</th>
              <th className="px-3 py-2 border min-w-[180px]">Bukti Transfer</th>
              <th className="px-3 py-2 border sticky right-0 z-10 bg-green-100">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {kasRowsToShow.map((row, i) => {
              const idx = kasPage * 12 + i;
              const isEditing = kasEditIdx === idx;
              const isApproved = row.auditStatus === "Approved";
              return (
                <tr key={row.bulan}>
                  <td className="px-3 py-2 border">{row.bulan}</td>
                  <td
                    className={
                      "px-3 py-2 border " +
                      (row.status === "Lunas"
                        ? "text-green-700 font-semibold"
                        : row.status === "Belum"
                          ? "text-red-600 font-semibold"
                          : "")
                    }
                  >
                    {row.status}
                  </td>
                  <td className="px-3 py-2 border">
                    <span
                      className={
                        "px-2 py-1 rounded text-xs font-semibold whitespace-nowrap inline-block " +
                        (row.auditStatus === "Approved"
                          ? "bg-blue-100 text-blue-700"
                          : row.auditStatus === "Belum Lunas"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600")
                      }
                    >
                      {row.auditStatus || "Belum Di-audit"}
                    </span>
                  </td>
                  <td className="px-3 py-2 border">
                    <input
                      type="date"
                      className="border rounded px-2 py-1 w-full"
                      value={row.tanggal}
                      onChange={(e) => {
                        handleKasCellChange(idx, "tanggal", e.target.value);
                        updateKasStatus(
                          idx,
                          row.buktiFileName,
                          e.target.value,
                          row.jumlah,
                        );
                      }}
                      placeholder="Tanggal bayar"
                      disabled={!isEditing || isApproved}
                    />
                  </td>
                  <td className="px-3 py-2 border">
                    {isEditing ? (
                      <input
                        type="number"
                        className="border rounded px-2 py-1 w-full"
                        value={row.jumlah}
                        onChange={(e) => {
                          handleKasCellChange(idx, "jumlah", e.target.value);
                          updateKasStatus(
                            idx,
                            row.buktiFileName,
                            row.tanggal,
                            e.target.value,
                          );
                        }}
                        placeholder="Jumlah bayar"
                        disabled={isApproved}
                      />
                    ) : (
                      <span className="text-green-700 font-semibold">
                        {(parseInt(row.jumlah || 0) || 0).toLocaleString(
                          "id-ID",
                          {
                            style: "currency",
                            currency: "IDR",
                          },
                        )}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 border">
                    {row.bukti ? (
                      <div className="flex flex-col gap-2">
                        <span className="text-sm break-all">
                          {row.buktiFileName || "Bukti transfer"}
                        </span>
                        {isEditing && (
                          <input
                            type="file"
                            accept="image/*"
                            className="w-full text-xs"
                            onChange={(e) => {
                              if (handleFileValidation(e.target.files?.[0])) {
                                handleKasFileChange(idx, e);
                                setTimeout(() => {
                                  updateKasStatus(
                                    idx,
                                    row.buktiFileName,
                                    row.tanggal,
                                    row.jumlah,
                                  );
                                }, 100);
                              }
                            }}
                            disabled={isApproved}
                          />
                        )}
                      </div>
                    ) : (
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full"
                        onChange={(e) => {
                          if (handleFileValidation(e.target.files?.[0])) {
                            handleKasFileChange(idx, e);
                            setTimeout(() => {
                              updateKasStatus(
                                idx,
                                row.buktiFileName,
                                row.tanggal,
                                row.jumlah,
                              );
                            }, 100);
                          }
                        }}
                        disabled={!isEditing || isApproved}
                      />
                    )}
                  </td>
                  <td className="px-3 py-2 border text-center sticky right-0 z-10 bg-white">
                    {isApproved ? (
                      <span className="text-xs text-gray-400">-</span>
                    ) : isEditing ? (
                      <button
                        type="button"
                        className="text-blue-600 font-bold px-2"
                        onClick={() => {
                          handleKasSave(idx);
                          setKasEditIdx(null);
                        }}
                        disabled={kasLoading}
                      >
                        {kasLoading ? "Menyimpan..." : "Simpan"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="text-blue-600 font-bold px-2"
                        onClick={() => setKasEditIdx(idx)}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setKasPage((p) => Math.max(0, p - 1))}
            disabled={kasPage === 0}
          >
            &lt; Prev
          </button>
          <span className="text-sm">
            Halaman {kasPage + 1} dari {kasPageCount}
          </span>
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setKasPage((p) => Math.min(kasPageCount - 1, p + 1))}
            disabled={kasPage === kasPageCount - 1}
          >
            Next &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
