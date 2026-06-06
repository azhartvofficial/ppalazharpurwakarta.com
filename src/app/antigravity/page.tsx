"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Helper function to get default HTML templates with Tailwind CSS included
const getTemplate = (id: string) => {
  switch (id) {
    case "ppdb":
      return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4">
  <div class="max-w-md w-full bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden">
    <!-- Glowing background accent -->
    <div class="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
    
    <div class="text-center mb-6">
      <span class="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20">PPDB 2026/2027</span>
      <h2 class="text-2xl font-extrabold mt-3 tracking-tight">Penerimaan Santri Baru</h2>
      <p class="text-slate-400 text-xs mt-1">Al-Azhar Purwakarta Integrated Islamic Boarding School</p>
    </div>

    <form id="ppdbForm" class="space-y-4" onsubmit="handleSubmit(event)">
      <div>
        <label class="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Nama Lengkap Calon Santri</label>
        <input type="text" id="nama" required class="w-full bg-slate-800/50 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-slate-600" placeholder="Contoh: Muhammad Faris">
      </div>

      <div>
        <label class="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Jenjang Pendidikan</label>
        <select id="jenjang" class="w-full bg-slate-800/50 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-all text-slate-300">
          <option value="SMP">SMP Al-Azhar (Putra/Putri)</option>
          <option value="SMA">SMA/MA Al-Azhar (Keagamaan)</option>
          <option value="Ponpes">Tahfidz Quran & Kitab Kuning (Intensif)</option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">No. HP Wali (WhatsApp)</label>
          <input type="tel" id="whatsapp" required class="w-full bg-slate-800/50 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-all placeholder:text-slate-600" placeholder="08xxxxxxxxx">
        </div>
        <div>
          <label class="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Kota Asal</label>
          <input type="text" id="kota" required class="w-full bg-slate-800/50 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-all placeholder:text-slate-600" placeholder="Purwakarta">
        </div>
      </div>

      <div class="pt-2">
        <button type="submit" class="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-orange-950/40 hover:shadow-orange-900/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm">
          Kirim Formulir Pendaftaran
        </button>
      </div>
    </form>

    <div id="successCard" class="hidden text-center py-6 space-y-3">
      <div class="w-12 h-12 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-xl font-bold animate-bounce">✓</div>
      <h3 class="text-lg font-bold text-white">Formulir Terkirim!</h3>
      <p class="text-xs text-slate-400 px-4">Terima kasih. Data pendaftaran awal atas nama <strong id="resNama" class="text-orange-400"></strong> berhasil disimpan. Admin kami akan menghubungi Anda via WhatsApp.</p>
      <button onclick="resetForm()" class="mt-4 text-xs text-slate-500 hover:text-slate-300 underline">Isi Kembali Formulir</button>
    </div>
  </div>

  <script>
    function handleSubmit(e) {
      e.preventDefault();
      const nama = document.getElementById("nama").value;
      
      document.getElementById("ppdbForm").classList.add("hidden");
      document.getElementById("resNama").innerText = nama;
      document.getElementById("successCard").classList.remove("hidden");
    }

    function resetForm() {
      document.getElementById("ppdbForm").reset();
      document.getElementById("ppdbForm").classList.remove("hidden");
      document.getElementById("successCard").classList.add("hidden");
    }
  </script>
</body>
</html>`;
    case "zakat":
      return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
    body { font-family: 'Outfit', sans-serif; }
  </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen flex items-center justify-center p-4">
  <div class="max-w-md w-full bg-slate-800 border border-slate-700/80 rounded-3xl p-8 shadow-2xl relative">
    <div class="absolute top-0 right-0 px-3 py-1 bg-amber-500/20 text-amber-400 border-b border-l border-slate-700 rounded-tr-3xl rounded-bl-xl text-[10px] font-bold tracking-widest uppercase">
      Zakat Mal Calculator
    </div>

    <div class="mb-6 mt-2">
      <h2 class="text-2xl font-bold tracking-tight text-white">Kalkulator Zakat Mal</h2>
      <p class="text-slate-400 text-xs mt-1">Hitung kewajiban zakat harta Anda berdasarkan harga emas terkini.</p>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-slate-400 text-xs font-semibold mb-1">Total Nilai Harta (Uang/Tabungan/Saham)</label>
        <div class="relative">
          <span class="absolute left-4 top-2.5 text-slate-500 text-sm font-bold">Rp</span>
          <input type="number" id="harta" class="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white font-mono" placeholder="100000000" oninput="hitungZakat()">
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-400 text-xs font-semibold mb-1">Harga Emas Murni/Gram</label>
          <div class="relative">
            <span class="absolute left-4 top-2.5 text-slate-500 text-sm">Rp</span>
            <input type="number" id="hargaEmas" class="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white font-mono" value="1300000" oninput="hitungZakat()">
          </div>
        </div>
        <div>
          <label class="block text-slate-400 text-xs font-semibold mb-1">Nisab Setahun (85g Emas)</label>
          <div class="w-full bg-slate-900 border border-slate-700/30 rounded-xl px-4 py-2.5 text-sm text-slate-300 font-mono flex items-center justify-between">
            <span>Rp</span>
            <span id="nisabVal">110.500.000</span>
          </div>
        </div>
      </div>

      <div class="border-t border-slate-700/50 pt-4 mt-6">
        <div class="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 space-y-3">
          <div class="flex justify-between items-center text-xs">
            <span class="text-slate-400 font-medium">Status Kewajiban:</span>
            <span id="statusZakat" class="px-2 py-0.5 rounded font-bold bg-slate-800 text-slate-400">Masukkan Nominal</span>
          </div>
          <div class="flex justify-between items-end border-t border-slate-800 pt-3">
            <span class="text-xs text-slate-400 font-medium pb-1">Zakat yang Wajib Dikeluarkan (2.5%):</span>
            <span class="text-xl font-black text-amber-400 font-mono">Rp <span id="hasilZakat">0</span></span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    function hitungZakat() {
      const harta = parseFloat(document.getElementById("harta").value) || 0;
      const hargaEmas = parseFloat(document.getElementById("hargaEmas").value) || 0;
      const nisab = hargaEmas * 85;
      
      // Update nisab display
      document.getElementById("nisabVal").innerText = formatRupiah(nisab);

      const statusEl = document.getElementById("statusZakat");
      const hasilEl = document.getElementById("hasilZakat");

      if (harta === 0) {
        statusEl.className = "px-2.5 py-0.5 text-xs rounded-full font-bold bg-slate-800 text-slate-400";
        statusEl.innerText = "Masukkan Nominal";
        hasilEl.innerText = "0";
        return;
      }

      if (harta >= nisab) {
        statusEl.className = "px-2.5 py-0.5 text-xs rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/20";
        statusEl.innerText = "Wajib Zakat";
        const zakat = harta * 0.025;
        hasilEl.innerText = formatRupiah(zakat);
      } else {
        statusEl.className = "px-2.5 py-0.5 text-xs rounded-full font-bold bg-amber-500/10 text-amber-500 border border-amber-500/10";
        statusEl.innerText = "Belum Wajib (Di bawah Nisab)";
        hasilEl.innerText = "0";
      }
    }

    function formatRupiah(number) {
      return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(number);
    }
    
    // Run initially
    hitungZakat();
  </script>
</body>
</html>`;
    case "dashboard":
      return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen p-6">
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Top Stats -->
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 backdrop-blur-lg">
      <div>
        <h2 class="text-xl font-extrabold text-white">Raport & Perkembangan Santri</h2>
        <p class="text-xs text-slate-400">Kelas XI-A Madrasah Aliyah Al-Azhar Purwakarta</p>
      </div>
      <div class="flex gap-2">
        <span class="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-lg">Semester Genap</span>
        <span class="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold rounded-lg">Ustadz Solihin, S.Pd.I.</span>
      </div>
    </header>

    <!-- Student Cards Grid -->
    <div class="grid md:grid-cols-3 gap-4">
      <div class="bg-slate-800 p-5 rounded-2xl border border-slate-700/60 flex flex-col justify-between">
        <div class="space-y-2">
          <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tahfidz Quran</div>
          <h3 class="text-lg font-bold text-white">Rataan Hafalan</h3>
          <div class="text-3xl font-black text-emerald-400 mt-2 font-mono">14.2 <span class="text-xs text-slate-400">Juz</span></div>
        </div>
        <div class="w-full bg-slate-900 rounded-full h-1.5 mt-4">
          <div class="bg-emerald-400 h-1.5 rounded-full" style="width: 71%"></div>
        </div>
      </div>

      <div class="bg-slate-800 p-5 rounded-2xl border border-slate-700/60 flex flex-col justify-between">
        <div class="space-y-2">
          <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Kitab Kuning</div>
          <h3 class="text-lg font-bold text-white">Pemahaman Fiqh</h3>
          <div class="text-3xl font-black text-indigo-400 mt-2 font-mono">88.5 <span class="text-xs text-slate-400">Nilai</span></div>
        </div>
        <div class="w-full bg-slate-900 rounded-full h-1.5 mt-4">
          <div class="bg-indigo-400 h-1.5 rounded-full" style="width: 88%"></div>
        </div>
      </div>

      <div class="bg-slate-800 p-5 rounded-2xl border border-slate-700/60 flex flex-col justify-between">
        <div class="space-y-2">
          <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Akademik Umum</div>
          <h3 class="text-lg font-bold text-white">Rata-Rata Kelas</h3>
          <div class="text-3xl font-black text-amber-400 mt-2 font-mono">92.4 <span class="text-xs text-slate-400">A+</span></div>
        </div>
        <div class="w-full bg-slate-900 rounded-full h-1.5 mt-4">
          <div class="bg-amber-400 h-1.5 rounded-full" style="width: 92%"></div>
        </div>
      </div>
    </div>

    <!-- Student Table list -->
    <div class="bg-slate-800 border border-slate-700/60 rounded-3xl overflow-hidden">
      <div class="p-6 border-b border-slate-700/60 flex justify-between items-center">
        <h3 class="font-extrabold text-white text-sm">Peringkat 5 Besar Santri Teraktif</h3>
        <span class="text-xs text-slate-400 underline cursor-pointer">Lihat Semua Santri</span>
      </div>
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-700/30">
          <tr>
            <th class="p-4 pl-6">NAMA SANTRI</th>
            <th class="p-4">TAHFIDZ</th>
            <th class="p-4">ILMU NAHWU</th>
            <th class="p-4">KERAJINAN</th>
            <th class="p-4 text-right pr-6">RATA-RATA</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-700/30 bg-slate-800/35">
          <tr class="hover:bg-slate-700/20 transition-all">
            <td class="p-4 pl-6 font-bold text-white">Fahri Hamzah</td>
            <td class="p-4 font-mono text-emerald-400">18 Juz</td>
            <td class="p-4">95 (Mumtaz)</td>
            <td class="p-4 text-emerald-400">100%</td>
            <td class="p-4 text-right pr-6 font-bold font-mono">96.8</td>
          </tr>
          <tr class="hover:bg-slate-700/20 transition-all">
            <td class="p-4 pl-6 font-bold text-white">Muhammad Farhan</td>
            <td class="p-4 font-mono text-emerald-400">15 Juz</td>
            <td class="p-4">90 (Mumtaz)</td>
            <td class="p-4 text-emerald-400">98%</td>
            <td class="p-4 text-right pr-6 font-bold font-mono">93.2</td>
          </tr>
          <tr class="hover:bg-slate-700/20 transition-all">
            <td class="p-4 pl-6 font-bold text-white">Aisyah Rahmawati</td>
            <td class="p-4 font-mono text-emerald-400">16 Juz</td>
            <td class="p-4">92 (Mumtaz)</td>
            <td class="p-4 text-emerald-400">97%</td>
            <td class="p-4 text-right pr-6 font-bold font-mono">92.9</td>
          </tr>
          <tr class="hover:bg-slate-700/20 transition-all">
            <td class="p-4 pl-6 font-bold text-white">Zidan Abdurrahman</td>
            <td class="p-4 font-mono text-emerald-400">12 Juz</td>
            <td class="p-4">88 (Jayyid Jiddan)</td>
            <td class="p-4 text-emerald-400">100%</td>
            <td class="p-4 text-right pr-6 font-bold font-mono">90.4</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>`;
    case "jadwal":
      return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-indigo-950 text-indigo-100 min-h-screen flex items-center justify-center p-4">
  <div class="max-w-md w-full bg-slate-900/90 backdrop-blur-md rounded-3xl border border-indigo-500/20 p-8 shadow-2xl relative overflow-hidden">
    <div class="absolute -top-16 -left-16 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-16 -right-16 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl"></div>
    
    <div class="text-center mb-6">
      <h2 class="text-2xl font-black text-white">Jadwal Sholat & Adzan</h2>
      <p class="text-slate-400 text-xs mt-1">Purwakarta & Sekitarnya • 20 Mei 2026</p>
    </div>

    <!-- Next Prayer Countdown -->
    <div class="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl border border-indigo-500/30 p-5 text-center mb-5">
      <div class="text-[10px] uppercase font-bold tracking-wider text-indigo-300">Sholat Berikutnya</div>
      <div class="text-2xl font-black text-white mt-1">DZHUR</div>
      <div class="text-3xl font-extrabold text-amber-400 font-mono mt-1" id="timer">11:58:30</div>
      <div class="text-[10px] text-slate-400 mt-1">Menuju Kumandang Adzan</div>
    </div>

    <!-- Times list -->
    <div class="space-y-2.5">
      <div class="flex justify-between items-center bg-slate-800/40 rounded-xl px-4 py-3 border border-slate-800">
        <span class="text-xs font-bold text-slate-300">Subuh</span>
        <span class="text-sm font-extrabold font-mono text-white">04:36</span>
      </div>
      <div class="flex justify-between items-center bg-slate-800/40 rounded-xl px-4 py-3 border border-slate-800">
        <span class="text-xs font-bold text-slate-300">Syuruk</span>
        <span class="text-sm font-extrabold font-mono text-slate-500">05:54</span>
      </div>
      <div class="flex justify-between items-center bg-indigo-500/10 border-indigo-500/40 rounded-xl px-4 py-3 border">
        <span class="text-xs font-bold text-indigo-300">Dzhur</span>
        <span class="text-sm font-extrabold font-mono text-indigo-300">11:53</span>
      </div>
      <div class="flex justify-between items-center bg-slate-800/40 rounded-xl px-4 py-3 border border-slate-800">
        <span class="text-xs font-bold text-slate-300">Ashar</span>
        <span class="text-sm font-extrabold font-mono text-white">15:14</span>
      </div>
      <div class="flex justify-between items-center bg-slate-800/40 rounded-xl px-4 py-3 border border-slate-800">
        <span class="text-xs font-bold text-slate-300">Maghrib</span>
        <span class="text-sm font-extrabold font-mono text-white">17:48</span>
      </div>
      <div class="flex justify-between items-center bg-slate-800/40 rounded-xl px-4 py-3 border border-slate-800">
        <span class="text-xs font-bold text-slate-300">Isya</span>
        <span class="text-sm font-extrabold font-mono text-white">19:00</span>
      </div>
    </div>
  </div>

  <script>
    // Simple prayer countdown timer
    function startTimer() {
      let seconds = 30;
      let minutes = 5;
      let hours = 0;
      
      setInterval(() => {
        if (seconds > 0) {
          seconds--;
        } else {
          if (minutes > 0) {
            minutes--;
            seconds = 59;
          } else {
            if (hours > 0) {
              hours--;
              minutes = 59;
              seconds = 59;
            } else {
              // Reset mock timer when hit zero
              hours = 0;
              minutes = 5;
              seconds = 30;
            }
          }
        }
        
        const hStr = String(hours).padStart(2, '0');
        const mStr = String(minutes).padStart(2, '0');
        const sStr = String(seconds).padStart(2, '0');
        document.getElementById("timer").innerText = hStr + ":" + mStr + ":" + sStr;
      }, 1000);
    }
    
    startTimer();
  </script>
</body>
</html>`;
    default:
      return `<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-white flex items-center justify-center min-h-screen">
  <div class="text-center p-8 bg-slate-800 rounded-2xl border border-slate-700 shadow-xl">
    <h1 class="text-2xl font-black">Selamat Datang di Sandbox Antigravity</h1>
    <p class="text-slate-400 mt-2 text-sm">Pilih templat kodingan di sidebar kiri untuk memulai!</p>
  </div>
</body>
</html>`;
  }
};

interface Message {
  sender: "user" | "ai";
  text: string;
  templateId?: string;
}

export default function AntigravityPlayground() {
  const [code, setCode] = useState(getTemplate(""));
  const [previewSrc, setPreviewSrc] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Halo! Saya Antigravity, asisten koding AI Anda. Pilih salah satu pintasan program di bawah ini agar saya bisa merancang kodenya secara visual, atau silakan tulis kode HTML/CSS di editor sebelah kanan!",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync editor to preview
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPreviewSrc(code);
    }, 400); // Debounce preview update to avoid lags during fast typing
    return () => clearTimeout(timeout);
  }, [code]);

  // Handle preset templates typing simulation
  const loadPresetTemplate = async (templateId: string, name: string) => {
    if (isTyping) return;

    // Add user message and AI writing status
    const newMsgs: Message[] = [
      ...messages,
      { sender: "user", text: `Buatkan ${name}` },
      { sender: "ai", text: `Baik, saya akan memprogram ${name} dengan gaya modern premium. Silakan perhatikan editor koding di samping, saya akan mulai mengetik kodenya sekarang.` },
    ];
    setMessages(newMsgs);
    setIsTyping(true);
    setCode("");

    const targetTemplate = getTemplate(templateId);
    let currentIdx = 0;
    const chunkSize = 25; // Characters per typing frame for responsive simulation

    const typeCode = () => {
      if (currentIdx < targetTemplate.length) {
        const nextChunk = targetTemplate.substring(0, currentIdx + chunkSize);
        setCode(nextChunk);
        currentIdx += chunkSize;
        // Keep editor scrolling down if needed
        if (textareaRef.current) {
          textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
        requestAnimationFrame(typeCode);
      } else {
        setCode(targetTemplate);
        setIsTyping(false);
        // AI finishing message
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: `✓ Selesai! ${name} telah berhasil dirender di panel pratinjau langsung di sebelah kanan. Anda dapat mencoba berinteraksi langsung atau mengedit kodenya sendiri.` },
        ]);
      }
    };

    // Small delay before starting typing to mimic AI "thinking"
    setTimeout(() => {
      typeCode();
    }, 800);
  };

  // Handle custom user prompts in chat (simulates responses based on keywords)
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isTyping) return;

    const userText = userInput.trim().toLowerCase();
    const newMsgs: Message[] = [...messages, { sender: "user", text: userInput }];
    setMessages(newMsgs);
    setUserInput("");

    setIsTyping(true);

    setTimeout(() => {
      let responseText = "";
      let templateId = "";
      let templateName = "";

      if (userText.includes("form") || userText.includes("pendaftaran") || userText.includes("ppdb")) {
        responseText = "Menemukan kecocokan untuk formulir pendaftaran (PPDB). Saya akan memprogram Formulir PPDB Al-Azhar secara dinamis.";
        templateId = "ppdb";
        templateName = "Formulir Pendaftaran PPDB";
      } else if (userText.includes("zakat") || userText.includes("kalkulator")) {
        responseText = "Menemukan kecocokan untuk kalkulator zakat. Saya akan mendesain kalkulator zakat mal interaktif sekarang.";
        templateId = "zakat";
        templateName = "Kalkulator Zakat Mal";
      } else if (userText.includes("dashboard") || userText.includes("nilai") || userText.includes("raport")) {
        responseText = "Menemukan kecocokan untuk dashboard. Saya akan membuatkan dashboard raport santri dengan statistik lengkap.";
        templateId = "dashboard";
        templateName = "Dashboard Raport Santri";
      } else if (userText.includes("sholat") || userText.includes("adzan") || userText.includes("jadwal")) {
        responseText = "Menemukan kecocokan untuk jadwal sholat. Saya akan membuatkan kartu jadwal sholat harian Purwakarta.";
        templateId = "jadwal";
        templateName = "Jadwal Sholat Purwakarta";
      } else {
        responseText = "Maaf, saya tidak menemukan template bawaan yang cocok. Namun saya akan merancang desain umum responsif dengan skema warna yang elegan untuk Anda.";
        templateId = "ppdb"; // Default fallback
        templateName = "Desain Web Responsif";
      }

      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: responseText },
      ]);

      setTimeout(() => {
        loadPresetTemplate(templateId, templateName);
      }, 800);
    }, 1000);
  };

  // Helper to count lines in the code
  const getLineNumbers = () => {
    const lines = code.split("\n");
    return lines.map((_, i) => i + 1);
  };

  // Copy code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="playground-container">
      {/* Top Header Navbar */}
      <header className="playground-header">
        <div className="brand">
          <Link href="/admin" className="back-btn" title="Kembali ke Dashboard Admin">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "16px", height: "16px" }}>
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <span>Dashboard</span>
          </Link>
          <div className="separator" />
          <div className="brand-logo">
            <span className="logo-spark font-mono">⚡</span>
            <h2>Antigravity <span className="highlight font-mono">IDE & Preview</span></h2>
          </div>
        </div>

        <div className="status-indicator">
          <div className="ping-dot" />
          <span className="font-mono text-xs text-slate-400">Sandboxed Environment • Next.js 16</span>
        </div>
      </header>

      {/* Editor & AI Workspace Area */}
      <div className="playground-grid">
        {/* Pane 1: AI Chat Assistant Panel */}
        <aside className="chat-panel">
          <div className="panel-header">
            <h3>🤖 Asisten Antigravity AI</h3>
            <span className="version font-mono">v3.5 Flash</span>
          </div>

          <div className="chat-history">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`message-bubble ${msg.sender}`}
                >
                  <div className="sender-tag">{msg.sender === "ai" ? "Antigravity AI" : "Developer"}</div>
                  <p>{msg.text}</p>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="typing-indicator-bubble"
                >
                  <span className="pulse-dot"></span>
                  <span className="pulse-dot"></span>
                  <span className="pulse-dot"></span>
                  <span className="text-xs text-slate-500 font-mono ml-2">Menulis kode...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick templates presets */}
          <div className="preset-container">
            <h4>💡 Pintasan Pembuatan Kode</h4>
            <div className="presets-grid">
              <button disabled={isTyping} onClick={() => loadPresetTemplate("ppdb", "Formulir Pendaftaran PPDB")} className="preset-card">
                <span className="icon">📝</span>
                <div className="preset-text">
                  <h5>Formulir PPDB</h5>
                  <p>Input santri baru</p>
                </div>
              </button>
              <button disabled={isTyping} onClick={() => loadPresetTemplate("zakat", "Kalkulator Zakat Mal")} className="preset-card">
                <span className="icon">⚖️</span>
                <div className="preset-text">
                  <h5>Kalkulator Zakat</h5>
                  <p>Penghitung zakat mal</p>
                </div>
              </button>
              <button disabled={isTyping} onClick={() => loadPresetTemplate("dashboard", "Dashboard Raport Santri")} className="preset-card">
                <span className="icon">📊</span>
                <div className="preset-text">
                  <h5>Raport Santri</h5>
                  <p>Dashboard perkembangan</p>
                </div>
              </button>
              <button disabled={isTyping} onClick={() => loadPresetTemplate("jadwal", "Jadwal Sholat Purwakarta")} className="preset-card">
                <span className="icon">🕒</span>
                <div className="preset-text">
                  <h5>Jadwal Sholat</h5>
                  <p>Waktu adzan otomatis</p>
                </div>
              </button>
            </div>
          </div>

          {/* User message input box */}
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ketik permintaan (misal: 'kalkulator')..."
              disabled={isTyping}
              className="chat-input-field"
            />
            <button type="submit" disabled={isTyping || !userInput.trim()} className="chat-send-btn">
              Kirim
            </button>
          </form>
        </aside>

        {/* Pane 2: Code Editor Pane */}
        <section className="editor-panel">
          <div className="panel-header">
            <div className="tab-title active">
              <span className="tab-icon">📄</span>
              <span className="font-mono text-xs font-bold text-slate-300">index.html</span>
            </div>
            <div className="editor-actions">
              <button onClick={handleCopyCode} className="action-btn" title="Salin semua kode">
                {copied ? "✓ Tersalin!" : "Salin Kode"}
              </button>
              <button onClick={() => setCode(getTemplate(""))} className="action-btn danger" title="Hapus Editor">
                Reset
              </button>
            </div>
          </div>

          <div className="editor-container">
            {/* Synchronized Line Numbers */}
            <div className="line-numbers font-mono select-none text-right">
              {getLineNumbers().map((num) => (
                <div key={num} className="line-num">
                  {num}
                </div>
              ))}
            </div>

            {/* Editable Text Area */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              readOnly={isTyping}
              className="code-textarea font-mono"
              placeholder="Ketik atau edit HTML/CSS di sini..."
              spellCheck="false"
            />
          </div>
        </section>

        {/* Pane 3: HTML Sandboxed Render Preview Viewport */}
        <section className="preview-panel">
          <div className="panel-header">
            <div className="browser-mockup-address">
              <span className="address-dot red"></span>
              <span className="address-dot yellow"></span>
              <span className="address-dot green"></span>
              <div className="address-bar font-mono">http://alazhar-preview.local/sandbox</div>
            </div>
            <button onClick={() => setPreviewSrc("")} className="refresh-btn" title="Refresh Rendering">
              🔄
            </button>
          </div>

          <div className="preview-viewport-content">
            {previewSrc ? (
              <iframe
                ref={iframeRef}
                srcDoc={previewSrc}
                sandbox="allow-scripts allow-modals"
                className="preview-iframe"
                title="Antigravity Live Rendering Sandbox"
              />
            ) : (
              <div className="empty-preview">
                <span className="loader">⚡</span>
                <p>Memuat renderer sandbox...</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Styled JSX embedded directly for maximum responsive, styled control inside Next.js 16 */}
      <style jsx>{`
        .playground-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 100vw;
          background-color: #030712;
          color: #f3f4f6;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        .playground-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1.5rem;
          background-color: #0b0f19;
          border-bottom: 1.5px solid #1f2937;
          height: 56px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #9ca3af;
          font-size: 0.8rem;
          font-weight: 600;
          transition: all 0.2s;
          padding: 0.35rem 0.75rem;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .back-btn:hover {
          color: #f3f4f6;
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .separator {
          width: 1.5px;
          height: 20px;
          background-color: #374151;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .logo-spark {
          color: #ff8c00;
          font-size: 1.1rem;
          animation: float 2s infinite ease-in-out;
        }

        .brand-logo h2 {
          font-size: 0.95rem;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .highlight {
          color: #ff8c00;
          background: linear-gradient(135deg, #ff8c00, #ffb84d);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ping-dot {
          width: 8px;
          height: 8px;
          background-color: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 12px #10b981;
          animation: pulse 1.5s infinite;
        }

        .playground-grid {
          display: grid;
          grid-template-columns: 320px 1fr 1fr;
          height: calc(100vh - 56px);
          overflow: hidden;
        }

        /* Panel Headers styling */
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          background-color: #0b0f19;
          border-bottom: 1.5px solid #1f2937;
          height: 48px;
        }

        .panel-header h3 {
          font-size: 0.8rem;
          font-weight: 700;
          color: #e5e7eb;
        }

        .version {
          font-size: 0.65rem;
          color: #ff8c00;
          background-color: rgba(255, 140, 0, 0.1);
          border: 1px solid rgba(255, 140, 0, 0.2);
          padding: 2px 6px;
          border-radius: 4px;
        }

        /* Pane 1: Chat assistant styles */
        .chat-panel {
          background-color: #070a13;
          border-right: 1.5px solid #1f2937;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .chat-history {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .message-bubble {
          padding: 0.75rem 1rem;
          border-radius: 16px;
          max-width: 90%;
          font-size: 0.8rem;
          line-height: 1.5;
        }

        .message-bubble.ai {
          background-color: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          align-self: flex-start;
          border-top-left-radius: 2px;
        }

        .message-bubble.user {
          background: linear-gradient(135deg, rgba(255, 140, 0, 0.15), rgba(255, 140, 0, 0.05));
          border: 1px solid rgba(255, 140, 0, 0.25);
          color: #fff;
          align-self: flex-end;
          border-top-right-radius: 2px;
        }

        .sender-tag {
          font-size: 0.6rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.25rem;
          color: #9ca3af;
        }

        .message-bubble.user .sender-tag {
          color: #ff8c00;
        }

        .typing-indicator-bubble {
          display: flex;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.04);
          padding: 0.6rem 1rem;
          border-radius: 12px;
          align-self: flex-start;
        }

        .pulse-dot {
          width: 5px;
          height: 5px;
          background-color: #9ca3af;
          border-radius: 50%;
          margin: 0 2px;
          display: inline-block;
          animation: dotPulse 1.4s infinite ease-in-out both;
        }

        .pulse-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .pulse-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        /* Presets container */
        .preset-container {
          padding: 1rem;
          border-top: 1.5px solid #1f2937;
          background-color: #060910;
        }

        .preset-container h4 {
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #6b7280;
          margin-bottom: 0.75rem;
        }

        .presets-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }

        .preset-card {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background-color: #0c0f1b;
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
        }

        .preset-card:hover:not(:disabled) {
          background-color: #12182c;
          border-color: rgba(255, 140, 0, 0.2);
          transform: translateY(-1px);
        }

        .preset-card:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .preset-card .icon {
          font-size: 1.1rem;
        }

        .preset-text h5 {
          font-size: 0.7rem;
          font-weight: 700;
          color: #e5e7eb;
        }

        .preset-text p {
          font-size: 0.55rem;
          color: #6b7280;
          margin-top: 1px;
        }

        /* Chat inputs styling */
        .chat-input-form {
          display: flex;
          padding: 0.75rem;
          background-color: #0b0f19;
          border-top: 1.5px solid #1f2937;
          gap: 0.5rem;
        }

        .chat-input-field {
          flex: 1;
          background-color: #05070e;
          border: 1px solid #1f2937;
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
          color: #f3f4f6;
          outline: none;
          transition: border-color 0.2s;
        }

        .chat-input-field:focus {
          border-color: #ff8c00;
        }

        .chat-send-btn {
          background-color: #ff8c00;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0.5rem 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .chat-send-btn:hover:not(:disabled) {
          background-color: #e67e00;
        }

        .chat-send-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* Pane 2: Editor Pane styling */
        .editor-panel {
          background-color: #030712;
          border-right: 1.5px solid #1f2937;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .tab-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
        }

        .tab-title.active {
          background-color: #111827;
          border: 1px solid #1f2937;
        }

        .tab-icon {
          font-size: 0.85rem;
        }

        .editor-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          font-size: 0.68rem;
          font-weight: 600;
          color: #9ca3af;
          background-color: rgba(255, 255, 255, 0.03);
          border: 1px solid #1f2937;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:hover {
          color: white;
          background-color: rgba(255, 255, 255, 0.08);
          border-color: #374151;
        }

        .action-btn.danger:hover {
          color: #f87171;
          border-color: rgba(239, 68, 68, 0.3);
          background-color: rgba(239, 68, 68, 0.05);
        }

        .editor-container {
          flex: 1;
          display: flex;
          overflow: hidden;
          background-color: #030712;
          position: relative;
        }

        .line-numbers {
          width: 44px;
          padding: 1rem 0.5rem 1rem 0;
          border-right: 1px solid #111827;
          background-color: #030712;
          color: #374151;
          font-size: 0.75rem;
          line-height: 1.6;
          overflow: hidden;
        }

        .line-num {
          height: 19.2px; /* Line height match */
        }

        .code-textarea {
          flex: 1;
          background-color: transparent;
          border: none;
          color: #e5e7eb;
          padding: 1rem;
          font-size: 0.75rem;
          line-height: 1.6;
          resize: none;
          outline: none;
          overflow-y: auto;
          white-space: pre;
        }

        /* Pane 3: Preview Panel styling */
        .preview-panel {
          background-color: #030712;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .browser-mockup-address {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex: 1;
          max-width: 450px;
        }

        .address-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .address-dot.red { background-color: #ef4444; }
        .address-dot.yellow { background-color: #f59e0b; }
        .address-dot.green { background-color: #10b981; }

        .address-bar {
          background-color: #070a13;
          border: 1px solid #1f2937;
          border-radius: 6px;
          font-size: 0.65rem;
          color: #9ca3af;
          padding: 0.2rem 0.75rem;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-left: 0.25rem;
        }

        .refresh-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.8rem;
          padding: 0.2rem;
          transition: transform 0.2s;
        }

        .refresh-btn:hover {
          transform: rotate(45deg);
        }

        .preview-viewport-content {
          flex: 1;
          background-color: #1e293b;
          position: relative;
        }

        .preview-iframe {
          width: 100%;
          height: 100%;
          border: none;
          background-color: white;
        }

        .empty-preview {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #9ca3af;
          font-size: 0.8rem;
          gap: 0.5rem;
          background-color: #090d16;
        }

        .loader {
          font-size: 1.5rem;
          color: #ff8c00;
          animation: spin 1s infinite linear;
        }

        /* Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .playground-grid {
            grid-template-columns: 1fr;
            grid-template-rows: 300px 1fr 1fr;
            height: calc(100vh - 56px);
            overflow-y: auto;
          }
          
          .chat-panel {
            border-right: none;
            border-bottom: 1.5px solid #1f2937;
          }
          
          .editor-panel {
            border-right: none;
            border-bottom: 1.5px solid #1f2937;
          }
        }
      `}</style>
    </div>
  );
}
