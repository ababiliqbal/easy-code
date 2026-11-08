# EasyCode: Frontend Design System & Constraints
**Version:** 1.0
**Target Audience:** AI Coding Agent / Frontend Developer
**Tech Stack:** Next.js (App Router), React, Tailwind CSS

## 1. CORE PHILOSOPHY & INSTRUCTIONS FOR AI
Dokumen ini adalah **ATURAN MUTLAK** untuk pembuatan antarmuka (UI) EasyCode. Platform ini adalah lingkungan belajar koding yang serius, modern, dan profesional untuk siswa SMA. Desain harus mengambil inspirasi dari produk *developer-centric* seperti Vercel, Linear, atau GitHub. 
**PENTING UNTUK AI:** Baca dokumen ini dengan saksama sebelum meng- *generate* komponen UI apa pun. Jangan gunakan asumsi desain standar Anda.

---

## 2. 🚫 STRICT RULES (ANTI "AI SLOP")
DILARANG KERAS menggunakan elemen-elemen berikut dalam kode CSS/Tailwind yang Anda *generate*:
1. **NO Multi-Color Gradients:** Dilarang menggunakan gradien ungu -> pink -> biru atau sejenisnya.
2. **NO Decorative Emojis in Headings:** Jangan sisipkan emoji acak seperti 🚀, ✨, atau 💡 pada elemen `h1`, `h2`, atau tombol utama.
3. **NO Claymorphism / Glossy 3D:** Jangan buat efek tombol mengilap atau 3D. Gunakan desain datar (*flat design*).
4. **NO Heavy Drop Shadows / Glassmorphism:** Jangan gunakan `shadow-xl`, `shadow-2xl`, atau *backdrop-blur* tebal yang mendistraksi. Gunakan `shadow-sm` secara konservatif.
5. **NO Lorem Ipsum:** Selalu gunakan *micro-copy* bahasa Indonesia yang natural, sesuai dengan konteks pendidikan (misal: "Memuat ruang belajarmu...", bukan "Loading...").

---

## 3. COLOR PALETTE (Tailwind Config)
Implementasikan palet warna "Midnight Signal" ini ke dalam `tailwind.config.ts` di bagian `theme.extend.colors`. Patuhi aturan rasio (60% Paper, 30% Ink, 10% Signal).

### 3.1. Brand Colors (60-30-10 Rule)
* **`paper` (Mist - #F6F7F9):** 60%. Gunakan untuk *background* utama aplikasi dan area netral (`bg-paper`).
* **`ink` (Graphite - #16181D):** 30%. Gunakan untuk warna teks utama, judul, dan struktur garis keras (`text-ink`).
* **`signal` (Indigo - #6C7BFF):** 10%. Gunakan **HANYA** untuk elemen interaktif utama seperti CTA *Button*, *Active State*, dan *Link* (`bg-signal`, `text-signal`).

### 3.2. Semantic Colors (Wajib untuk Feedback)
* **`success` (#34C77B):** Kode benar, *output* sesuai, status berhasil.
* **`error` (#F2555A):** *Syntax error*, *output* salah, validasi gagal.
* **`warning` (#F5A524):** *Hint* AI, peringatan, *idle state*.
* **`divider` (#E5E7EB):** Warna *border* global (Gunakan `border-divider`).
* **`muted` (#6B7280):** Teks sekunder, deskripsi minor, *placeholder* (`text-muted`).

---

## 4. UI COMPONENTS GUIDELINES

### 4.1. Typography (The Hero)
* **Font Family:** Gunakan **Inter** atau **Geist** sebagai *sans-serif* utama. Gunakan **Fira Code** atau **JetBrains Mono** untuk kode.
* **Hierarchy:** Bangun hierarki informasi menggunakan kontras ketebalan (*weight*) dan ukuran, **bukan warna**. (Contoh: `text-2xl font-semibold text-ink` untuk judul, `text-sm font-normal text-muted` untuk sub-judul).

### 4.2. Borders & Shadows
* **Kunci Keanggunan:** *Whitespace* (ruang kosong) yang luas dan *border* yang tipis.
* **Card & Container:** Gunakan `border border-divider rounded-lg bg-white shadow-sm`. **JANGAN** gunakan *shadow* besar.

### 4.3. Buttons (CTA)
* **Primary:** `bg-signal text-white rounded-md px-4 py-2 hover:opacity-90 transition-opacity` (Tanpa efek *bounce* atau *scale* berlebihan).
* **Secondary/Ghost:** `border border-divider text-ink hover:bg-paper rounded-md px-4 py-2 transition-colors`.

### 4.4. Code Editor Sub-system
* Editor kode (**WAJIB GELAP / DARK MODE**): Gunakan latar belakang `#0D1117` atau serupa. Ini adalah satu-satunya area di aplikasi yang memecah rasio terang (untuk memberi sinyal "Ini ruang koding sesungguhnya").
* Terminal/Output: `bg-[#010409] text-muted font-mono text-sm p-4 rounded-md`.

---

## 5. PAGE ARCHITECTURE & ROUTING STRATEGY
Catatan untuk AI: Platform ini memiliki 22 "Status Layar" (states), namun **JANGAN** membuat 22 *file page.tsx* (Rute) yang berbeda. Terapkan *Client-Side State Management* untuk menghindari redundansi.

### 5.1. Struktur Rute (Next.js App Router) yang Diizinkan:
1. `/(public)/page.tsx` -> Landing Page
2. `/(auth)/login/page.tsx` -> Login / Register
3. `/(onboarding)/profil/page.tsx` -> Isi Profil & Persetujuan
4. `/pretest/page.tsx` -> Merender semua state prates (Instruksi -> Soal -> Loading -> Hasil) menggunakan *Client Component* (`useState`).
5. `/dashboard/page.tsx` -> Hub/Home Siswa
6. `/session/[id]/page.tsx` -> **Inti Pembelajaran (Learning Hub).** 

### 5.2. Penanganan Halaman Pembelajaran (`/session/[id]`)
Rute tunggal ini harus menangani logika perenderan kondisional (*conditional rendering*) untuk:
* Briefing Sesi
* Fase A (Berpikir - Dialog AI)
* Fase B (Editor Kode + Panel Chat AI + State Hint + State Error)
* Fase C (Hasil Uji)
* Refleksi & Ringkasan Akhir
* **Implementasi:** Gunakan tata letak *Split-Pane* standar. Sebelah kiri dinamis (Fase A, Chat, Instruksi), sebelah kanan statis untuk Fase B (Code Editor & Output). Modal/Overlay digunakan untuk navigasi peringatan ("Save/Keluar").