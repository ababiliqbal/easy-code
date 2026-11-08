# Software Design Document (SDD)

## Nama Produk: EasyCode
**Versi:** 1.0 (MVP)
**Fokus Dokumen:** Panduan Arsitektur untuk Implementasi *AI-Assisted Coding*

---

## 1. Desain Arsitektural (System Architecture)

### 1.1 Dekomposisi Modul
Sistem EasyCode dipecah menjadi modul fungsional independen berikut:
1. **Client-Side UI Modul (Frontend):** Menangani antarmuka pengguna, *state management* lokal (React Context/Zustand), dan editor kode (Monaco Editor).
2. **Auth & Identity Modul:** Dikelola penuh oleh Supabase Auth, menangani JWT *token lifecycle*.
3. **Core API Gateway Modul (Backend):** Aplikasi FastAPI yang bertindak sebagai orkestrator yang menerima HTTP *request* dari *client*, memvalidasi sesi, dan mendistribusikan tugas ke modul lain.
4. **AI Assistance Engine Modul:** Bertugas menyusun *prompt* sistem, memotong riwayat obrolan (*context trimming*), dan berkomunikasi dengan Gemini API.
5. **Sandboxed Executor Modul:** Mengelola *lifecycle container* Docker (membuat *container*, menginjeksi kode, menangkap *stdout/stderr*, dan melakukan *terminate*).

### 1.2 Relasi Kontrol (Control Relationships)
* Frontend menginisiasi panggilan ke Supabase untuk Login/Logout.
* Frontend menginisiasi komunikasi asinkron (REST/SSE) ke Backend API untuk eksekusi kode dan permintaan *hint* AI.
* Backend API bertindak sebagai pemanggil aktif (*active caller*) ke Gemini API dan Docker Daemon, serta melakukan operasi baca/tulis ke Supabase PostgreSQL.

### 1.3 Representasi Arsitektur (Data Flow)
```text
[Browser: Next.js UI] 
   |      |
   |      +-- (1. Auth via JWT) -----> [Supabase: Auth & PostgreSQL]
   |
   +-- (2. REST POST /execute) ------> [FastAPI: Gateway Modul]
   +-- (3. SSE GET /ai/stream) ------>        |
                                              +-- (4. Python Docker SDK) --> [Docker Daemon (Sandbox)]
                                              |
                                              +-- (5. REST JSON) ----------> [Google Gemini Pro API]
```

---

## 2. Desain Basis Data dan Data (Database Design)

### 2.1 Struktur Data Modul (Internal Data Structures)
* Modul **AI Engine** menggunakan struktur data tipe *List of Dictionaries* untuk menyimpan konteks, format: `[{"role": "user", "content": "..."}]`.
* Modul **Sandboxed Executor** mem- *parsing* hasil dari Docker ke dalam struktur *Dictionary* standar: `{"status": "success|error", "output": "...", "execution_time_ms": int}`.

### 2.2 Desain Skema (Schema Design)
Diimplementasikan pada PostgreSQL (Supabase). 

**Domain 1: User & Identity**
*   **`users`**: `id` UUID (PK, FK ke `auth.users`), `full_name` VARCHAR, `class_name` VARCHAR, `current_level` ENUM('FOUNDATION', 'DEVELOPING', 'SECURE').
*   **`pretest_results`**: `id` UUID (PK), `user_id` UUID (FK), `score_logic` INT, `score_tracing` INT, `score_syntax` INT, `assigned_level` ENUM.

**Domain 2: Content (Statis)**
*   **`exercises`**: `id` UUID (PK), `level` ENUM, `order_num` INT, `case_study` TEXT, `expected_output` TEXT, `is_checkpoint` BOOLEAN.

**Domain 3: Progress & State**
*   **`user_progress`**: `id` UUID (PK), `user_id` UUID (FK), `exercise_id` UUID (FK), `status` ENUM('IN_PROGRESS', 'COMPLETED'), `code_draft` TEXT, `run_count` INT, `hint_count` INT.

**Domain 4: Interaction**
*   **`ai_chat_logs`**: `id` UUID (PK), `progress_id` UUID (FK), `sender` ENUM('USER', 'AI', 'SYSTEM'), `message_text` TEXT, `created_at` TIMESTAMP.

---

## 3. Spesifikasi Antarmuka (Interface Specification)

### 3.1 Antarmuka Antar-modul (Internal API)
Komunikasi antara Frontend Next.js dan Backend FastAPI.

*   **Eksekusi Kode**
    *   **Endpoint:** `POST /api/v1/sandbox/execute`
    *   **Payload:** `{"progress_id": "uuid", "source_code": "string"}`
    *   **Response:** `{"status": "success|error", "stdout": "string", "stderr": "string"}`
*   **Permintaan AI Chat/Hint (Streaming)**
    *   **Endpoint:** `GET /api/v1/ai/chat/stream?progress_id=uuid&trigger_type=explicit|idle|error`
    *   **Response:** *Server-Sent Events (SSE)* `text/event-stream`

### 3.2 Antarmuka Subsistem Eksternal
*   **Docker Daemon API:** Komunikasi dilakukan melalui Unix Socket `/var/run/docker.sock` menggunakan *library* `docker-py`.
*   **Supabase PostgreSQL:** Dihubungkan melalui port `5432` dengan *connection pooling* menggunakan protokol TCP/IP.
*   **Google Gemini API:** Menggunakan *endpoint* HTTPS `generativelanguage.googleapis.com` dengan otentikasi melalui *header* `x-goog-api-key`.

---

## 4. Desain Komponen dan Algoritma (Component Selection and Design)

### 4.1 Pemilihan Komponen Pakai Ulang (Reusable Components)
*   **Monaco Editor:** Menggunakan `@monaco-editor/react` untuk UI *code editor* dengan *syntax highlighting* Python *out-of-the-box*.
*   **LangChain / LangGraph (Opsional):** Dievaluasi, namun **ditolak** untuk MVP karena *overhead* yang terlalu tinggi. Komunikasi ke LLM akan menggunakan *native* `google-generativeai` SDK.
*   **Docker-py:** Digunakan di *backend* untuk manajemen siklus hidup *sandbox container*.

### 4.2 Rancangan Algoritmik Matematis & Analisis Kompleksitas
Sebagai batasan performa agen, algoritma inti dirancang dengan spesifikasi berikut:

1.  **Algoritma Context Trimming (Manajemen Memori LLM)**
    *   *Deskripsi:* Untuk mencegah pengeluaran *token* berlebih, fungsi ini memotong riwayat *chat* hanya untuk menyimpan $K$ interaksi terakhir ditambah *System Prompt* utama.
    *   *Kompleksitas Waktu:* $O(N)$ di mana $N$ adalah total jumlah baris pesan (*message logs*) dalam sesi tersebut untuk proses iterasi dan *slicing* dalam *array* Python.
    *   *Kompleksitas Ruang:* $O(K)$ di mana $K$ adalah batas maksimal riwayat obrolan yang dikirimkan kembali ke memori API.
2.  **Algoritma Deteksi Infinite Loop & Timeout Management**
    *   *Deskripsi:* Mengeksekusi *subprocess* Docker menggunakan mekanisme *polling* berbasis *thread* (atau `asyncio.wait_for`).
    *   *Kompleksitas Waktu:* $O(1)$ untuk pemicu penundaan (*timeout trigger*). Algoritma tidak bergantung pada besaran ukuran masukan pengguna, melainkan secara statis memutus eksekusi pada detik ke-$T$ ($T=5$).
3.  **Algoritma Output Checker (Validasi Evaluasi)**
    *   *Deskripsi:* Menggunakan pencocokan *String* dasar dengan *normalization* (penghapusan spasi di awal/akhir dan perubahan kapitalisasi).
    *   *Kompleksitas Waktu:* $O(M)$ di mana $M$ adalah panjang karakter dari teks *output* Python yang dihasilkan oleh sisi pengguna.

---

## 5. Pemilihan Teknologi (Tech Stack & Platform)

*   **Frontend Ecosystem:** 
    *   **Platform:** Next.js (App Router), React, TypeScript.
    *   **Styling:** Tailwind CSS (tanpa kerangka komponen *bloatware*).
*   **Backend Ecosystem:**
    *   **Platform:** Python 3.11+, FastAPI (Uvicorn ASGI server).
    *   **Environment:** Ubuntu Linux LTS (sebagai *Host* VPS).
*   **Database & Auth:** Supabase (PostgreSQL 15+).
*   **AI Engine:** Google Gemini Pro API.
*   **Sandbox Isolation:** Docker Engine (menggunakan *image* alpine python `python:3.11-alpine` untuk kecepatan inisiasi awal).

---

## 6. Manajemen Konfigurasi dan Otomatisasi (CI/CD Pipeline)

### 6.1 Manajemen Versi (Version Control System)
Repository menggunakan Git/GitHub. Proses integrasi dikelola dengan mekanisme *Pull Request* (PR).

*   **Awalan (Prefix) Wajib untuk Branch:**
    *   `feature/` : Penambahan fungsi baru (misal: `feature/ai-chat-streaming`).
    *   `bugfix/` : Perbaikan eror (misal: `bugfix/docker-timeout-issue`).
    *   `hotfix/` : Perbaikan eror kritikal di server aktif (misal: `hotfix/supabase-auth-fail`).
    *   `test/` : Penambahan unit tes atau tes integrasi.

*   **Kamus Singkat Commit (Conventional Commits):**
    *   `feat:` Penambahan fitur baru.
    *   `fix:` Memperbaiki bug.
    *   `docs:` Mengubah panduan dokumentasi.
    *   `chore:` Pembaruan dependensi *library* (misal: `npm update`).
    *   `refactor:` Merapikan struktur kode tanpa mengubah fungsi (*logic*).
    *   `ci:` Perubahan pada skrip GitHub Actions.

### 6.2 Otomatisasi Integrasi & Pengiriman (CI/CD Pipeline)
Menggunakan **GitHub Actions** dengan urutan alur kerja (*workflow*) terpadu:

1.  **Job 1: Linter & Static Analysis**
    *   Menjalankan `ESLint` dan `Prettier` pada sisi Frontend.
    *   Menjalankan `Ruff` atau `Flake8` serta `mypy` pada sisi Backend Python.
2.  **Job 2: Unit Testing**
    *   Frontend: Menjalankan *test suites* Jest.
    *   Backend: Menjalankan pengujian `pytest` (mocking Supabase dan Docker).
3.  **Job 3: Build & Deploy**
    *   Jika *test* lulus di *branch* `main`:
    *   **Frontend Deploy:** Dipicu (*triggered*) otomatis menuju Vercel Production Environment.
    *   **Backend Deploy:** Skrip `docker build` dijalankan, *image* didorong (*push*) ke Container Registry, dan dikerahkan (*deploy*) ke infrastruktur VPS melalui koneksi SSH (mengeksekusi `docker-compose up -d`).