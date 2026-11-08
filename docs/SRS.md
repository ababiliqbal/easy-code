# Software Requirements Specification (SRS)
## Nama Produk: EasyCode
**Versi:** 1.0 (Minimum Viable Product)
**Tanggal:** 8 November 2026

---

## Bagian I: Pendahuluan (Introduction)

### 1.1 Tujuan (Purpose)
Dokumen SRS ini bertujuan untuk mendefinisikan spesifikasi kebutuhan perangkat lunak untuk **EasyCode**, sebuah platform edukasi interaktif berbasis web. EasyCode digunakan oleh siswa kelas X SMA/MA untuk mempelajari Koding (Python) dan *Computational Thinking* sesuai dengan kurikulum Koding dan Kecerdasan Artifisial (KKA) Bab 1 dan 2. Platform ini digunakan sebagai sarana berlatih secara mandiri dengan panduan asisten AI yang bertindak sebagai tutor sokratik (membimbing tanpa memberikan jawaban langsung).

### 1.2 Cakupan Proyek (Project Scope)
Sistem ini akan mengotomatisasi proses pembelajaran koding bagi siswa pemula melalui fitur-fitur berikut:
- **Asesmen Dinamis:** Mengukur kemampuan awal siswa melalui *Pretest* dan mengkategorikan mereka ke dalam tiga level: *Foundation*, *Developing*, dan *Secure*.
- **Pembelajaran Bertahap:** Memfasilitasi siklus pembelajaran yang terdiri dari Fase Berpikir (Dekomposisi/Pseudocode) dan Fase Implementasi (Penulisan Kode Python).
- **Asisten AI Terpersonalisasi:** Menyediakan *hint* (petunjuk) berjenjang dan penjelasan kesalahan (*error explanation*) yang disesuaikan dengan level kompetensi siswa secara *real-time*.
- **Code Sandbox:** Menyediakan lingkungan eksekusi kode Python yang aman langsung di dalam peramban web (*browser*).
- **Manajemen Progres:** Melacak dan menyimpan riwayat belajar, log penggunaan *hint*, serta melakukan auto-simpan (*auto-save*) sesi belajar.

### 1.3 Karakteristik Lingkungan (Environmental Characteristics)
Sistem EasyCode beroperasi dalam lingkungan *client-server*. 
- **Sisi Klien (Client-Side):** Aplikasi web responsif yang diakses melalui peramban web standar (Chrome, Firefox, Safari, Edge) di perangkat laptop, PC, atau tablet.
- **Sisi Server (Server-Side):** Berjalan di atas infrastruktur *cloud* (Vercel untuk Frontend, Vercel/VPS untuk Backend). Backend harus memiliki akses ke *container engine* (Docker) untuk mengeksekusi kode Python pengguna secara aman dan terisolasi. 
- **Integrasi Pihak Ketiga:** Terintegrasi dengan layanan Google (untuk SSO) dan API Gemini dari Google (untuk pemrosesan *Language Model*).

---

## Bagian II: Deskripsi Umum (Overall Description)

### 2.1 Perspektif Produk (Product Perspective)
EasyCode adalah sistem baru dan independen yang dibangun dari awal (*from scratch*). Platform ini dirancang secara modular agar di masa depan dapat diperluas untuk mencakup Bab 3 hingga Bab 6 dari kurikulum KKA (Mode "World"), serta mengakomodasi modul khusus untuk Guru (Dashboard Guru). Untuk MVP ini, produk difokuskan murni pada *end-user* siswa (World 1).

### 2.2 Karakteristik Pengguna (User Classes)
Pada fase MVP, sistem ini ditujukan untuk satu kelas pengguna utama dengan tiga sub-kategori:
- **Siswa - Level Foundation:** Pemula absolut. Membutuhkan panduan *scaffolding* penuh, banyak apresiasi, dan petunjuk langkah demi langkah yang detail.
- **Siswa - Level Developing:** Memiliki dasar logika tetapi belum mahir sintaks. Membutuhkan petunjuk konseptual dan ruang untuk mencoba secara mandiri sebelum dibantu.
- **Siswa - Level Secure:** Memiliki dasar koding yang solid. Membutuhkan kebebasan mengeksplorasi, tantangan lebih, dan panduan yang bersifat minimalis (hanya saat benar-benar *stuck*).

### 2.3 Batasan Desain & Implementasi (Design & Implementation Constraints)
1. **Tech Stack Wajib:** Frontend menggunakan Next.js (Tailwind CSS), Backend menggunakan FastAPI (Python), dan Database menggunakan PostgreSQL (via Supabase).
2. **Keamanan Eksekusi Kode:** Kode pengguna tidak boleh dieksekusi langsung di OS *host* backend. Wajib menggunakan *Sandbox* (misal: Docker) dengan limitasi memori dan jaringan (*network drop*).
3. **Privasi Data:** Mengingat pengguna adalah anak di bawah umur (siswa SMA), sistem dilarang meminta atau menyimpan *Personally Identifiable Information* (PII) sensitif seperti NIK, nomor telepon, atau alamat rumah. Cukup Nama, Email, dan Kelas.
4. **Batasan LLM:** Sistem AI (Gemini) tidak boleh memproses kueri pengguna di luar konteks pembelajaran koding (terdapat *guardrail* ketat pada sistem *prompt*).

---

## Bagian III: Kebutuhan Fungsional (Functional Requirements)

### FR-01: Modul Autentikasi dan Onboarding
- **Deskripsi:** Sistem harus memungkinkan siswa untuk mendaftar dan masuk ke dalam platform.
- **Input:** Kredensial akun Google (OAuth) atau Email dan Password. Untuk pengguna baru: Nama Lengkap, Asal Sekolah, dan Kelas.
- **Output:** Sesi masuk yang valid (Token JWT/Supabase Session) dan pembuatan profil dasar siswa di basis data.

### FR-02: Modul Pretest dan Pemetaan Level
- **Deskripsi:** Sistem harus menyajikan tes awal untuk mengukur kemampuan logika tanpa kode, penelusuran kode (*tracing*), dan sintaks.
- **Input:** Jawaban pilihan ganda/isian singkat dari siswa, serta metrik durasi waktu pengerjaan tiap soal.
- **Output:** Skor *Pretest* dan klasifikasi siswa ke dalam level (*Foundation*, *Developing*, atau *Secure*). Sistem menyajikan halaman hasil yang berisi pesan personalisasi sesuai level yang diraih.

### FR-03: Modul Sesi Pembelajaran - Fase A (Computational Thinking)
- **Deskripsi:** Sistem memandu siswa memecah masalah studi kasus sebelum menulis kode.
- **Input:** Jawaban teks dari siswa mengenai dekomposisi I-P-O (Input-Proses-Output) dan rumusan *pseudocode*.
- **Output:** Validasi dari AI. Jika siswa *Foundation*, AI bertanya satu per satu. Jika siswa *Developing*, sistem meminta *pseudocode* utuh. Sistem memberikan izin untuk lanjut ke Fase B jika logika sudah valid.

### FR-04: Modul Sesi Pembelajaran - Fase B (Text Editor & Sandbox)
- **Deskripsi:** Sistem menyediakan antarmuka penulisan kode dan mengeksekusi kode tersebut.
- **Input:** Teks sintaks Python dari pengguna dan aksi klik tombol "Jalankan".
- **Output:** Hasil eksekusi *stdout* (sukses) atau *stderr* (pesan *error* Python) yang dikembalikan dari Docker Sandbox ke layar siswa.

### FR-05: Modul AI Assistance Engine (Hint & Error Explanation)
- **Deskripsi:** Sistem menganalisis kode atau respons siswa dan memberikan bantuan.
- **Input:** 
  - *Explicit Trigger*: Klik tombol "Minta Petunjuk".
  - *Idle Trigger*: Tidak ada aktivitas *typing* selama > 30 detik.
  - *Error Trigger*: Hasil dari *Code Runner* berupa *error* (misal: `SyntaxError`).
- **Output:** Teks panduan dari AI yang:
  1. Bersifat *tiered* (Level 1: Arah -> Level 2: Konsep -> Level 3: Sintaks parsial).
  2. Dilarang keras menampilkan jawaban/kode penuh.
  3. Menerjemahkan *error traceback* sistemik ke dalam bahasa Indonesia yang ramah pemula.

### FR-06: Modul Manajemen Progres
- **Deskripsi:** Sistem melacak keberhasilan belajar dan aktivitas siswa.
- **Input:** Data kelulusan dari *Output Checker* (jika *output* kode = *expected output* studi kasus), respons terhadap kuesioner refleksi di akhir sesi.
- **Output:** Pembaruan status *exercise* (Selesai), pembaruan metrik analitik (jumlah *hint* dipakai, waktu pengerjaan), dan pembukaan kunci (*unlock*) untuk *exercise* selanjutnya atau *Checkpoint*.

---

## Bagian IV: Kebutuhan Antarmuka Eksternal (External Interface Requirements)

### 4.1 Antarmuka Pengguna (User Interfaces)
- **Framework UI:** Aplikasi dibangun menggunakan komponen React dengan *styling* Tailwind CSS.
- **Tata Letak Utama:** Halaman pembelajaran harus menggunakan tata letak *Split-Screen* (Layar Terbagi). Sisi kiri untuk instruksi, studi kasus, dan AI Chat. Sisi kanan untuk Editor Kode (menggunakan *library* seperti Monaco Editor) dan terminal *Output*.
- **Style Guide:** Minimalis, menenangkan, menghindari elemen visual yang mengganggu (*no AI slop*, *no excessive gradients*). Komunikasi visual untuk indikator (sukses/gagal/loading) harus jelas.

### 4.2 Antarmuka Perangkat Keras & Perangkat Lunak (Software Interfaces)
- **Supabase API:** Komunikasi dengan PostgreSQL menggunakan Supabase Client SDK untuk Autentikasi dan transaksi CRUD data.
- **Google Gemini API:** Menggunakan antarmuka REST / SDK resmi Gemini untuk mengirim *System Prompt*, histori percakapan, dan kode siswa, serta menerima balasan berbasis teks.
- **Docker Daemon API:** FastAPI harus berkomunikasi dengan *Docker Engine* (melalui modul `docker` Python) untuk membuat *container* sesaat (*ephemeral container*), memasukkan kode pengguna, mengambil *output*, lalu mematikan *container* tersebut.

---

## Bagian V: Kebutuhan Non-Fungsional Lainnya (Other Non-Functional Requirements)

### 5.1 Kinerja (Performance Requirements)
- **Latensi Eksekusi Kode:** Proses dari saat siswa mengklik "Jalankan" hingga *output* tampil di layar tidak boleh melebihi 3 detik.
- **Latensi Respons AI:** Respons AI (hint/penjelasan error) harus mulai tampil di layar (*Time to First Byte*) dalam waktu kurang dari 2 detik. Sistem wajib mengimplementasikan **Streaming Response** agar teks tampil seolah-olah sedang diketik, demi mempertahankan fokus siswa.
- **Auto-Save:** Sistem harus melakukan sinkronisasi *draft* kode dan status progres ke basis data setiap 30 detik di latar belakang tanpa mengganggu kinerja UI.

### 5.2 Keamanan & Privasi (Security Requirements)
- **Isolasi Eksekusi (Sandbox Security):** *Container* Docker tempat kode Python dijalankan tidak boleh diberikan akses ke jaringan internet (`--network none`) untuk mencegah skrip berbahaya mengunduh muatan eksternal atau melakukan serangan jaringan. Memory *container* harus dibatasi (misal: max 128MB).
- **Enkripsi:** Seluruh lalu lintas data antara *Client*, Next.js, FastAPI, dan Supabase harus menggunakan protokol HTTPS (TLS 1.2+). Kata sandi pengguna harus di-*hash* dengan aman (ditangani oleh Supabase Auth).
- **Proteksi Prompt (Prompt Injection):** Sistem *backend* harus memvalidasi teks *input* siswa untuk mencegah eksploitasi yang bertujuan membocorkan *System Prompt* dari AI.

### 5.3 Keselamatan (Safety Requirements)
- **Hard Timeout (Anti-Infinite Loop):** *Backend* (FastAPI/Docker) harus menerapkan *timeout* paksa maksimal 5 detik pada setiap eksekusi kode. Jika kode berjalan melebihi batas waktu tersebut, proses harus dihentikan paksa (*kill/terminate*) dan mengembalikan pesan *error* "Waktu Eksekusi Habis (Kemungkinan Infinite Loop)" kepada pengguna. Hal ini vital agar server tidak macet/crash.
- **Pemulihan Sesi (Session Recovery):** Jika siswa menutup peramban atau kehilangan koneksi internet di tengah pengerjaan, sistem harus dapat memuat kembali status terakhir (tahap fase, draf kode, dan riwayat chat) secara otomatis saat siswa *login* kembali.

---
**[AKHIR DOKUMEN SRS]**