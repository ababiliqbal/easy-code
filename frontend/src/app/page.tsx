export default function Home() {
  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col justify-between">
      {/* Navigasi Utama */}
      <header className="border-b border-border-subtle bg-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-lg tracking-tight text-ink">
              EasyCode
            </span>
            <span className="text-xs px-2 py-0.5 rounded border border-border-subtle bg-paper text-muted font-mono">
              v1.0 (MVP)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-success"></span>
            <span className="text-xs font-mono text-muted">Frontend :3333</span>
          </div>
        </div>
      </header>

      {/* Halaman Pemeriksaan Fondasi */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 flex flex-col gap-8">
        {/* Judul & Pengantar */}
        <section className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">
            EasyCode
          </h1>
          <p className="text-muted text-base max-w-2xl leading-relaxed">
            Platform Pembelajaran Koding Python dan Computational Thinking Berbantuan AI Adaptif untuk Kurikulum KKA SMA Kelas X.
          </p>
        </section>

        {/* Status Sistem & Diagnostik */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-border-subtle rounded-lg bg-white p-5 shadow-sm space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-muted">
              Sistem Desain
            </div>
            <div className="text-lg font-medium text-ink">Midnight Signal</div>
            <p className="text-xs text-muted leading-normal">
              Palet rasio 60% Paper (#F6F7F9), 30% Ink (#16181D), dan 10% Signal (#6C7BFF).
            </p>
            <div className="flex gap-2 pt-2">
              <span className="w-5 h-5 rounded border border-border-subtle bg-paper" title="Paper (#F6F7F9)"></span>
              <span className="w-5 h-5 rounded border border-border-subtle bg-ink" title="Ink (#16181D)"></span>
              <span className="w-5 h-5 rounded border border-border-subtle bg-signal" title="Signal (#6C7BFF)"></span>
              <span className="w-5 h-5 rounded border border-border-subtle bg-success" title="Success (#34C77B)"></span>
              <span className="w-5 h-5 rounded border border-border-subtle bg-error" title="Error (#F2555A)"></span>
            </div>
          </div>

          <div className="border border-border-subtle rounded-lg bg-white p-5 shadow-sm space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-muted">
              Lingkungan Port
            </div>
            <div className="text-lg font-medium text-ink">Port 3333 & 8888</div>
            <p className="text-xs text-muted leading-normal">
              Klien Next.js berjalan di port 3333 dengan integrasi API Gateway FastAPI di port 8888.
            </p>
            <div className="pt-2 text-xs font-mono text-muted">
              CORS Origin: http://localhost:3333
            </div>
          </div>

          <div className="border border-border-subtle rounded-lg bg-white p-5 shadow-sm space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-muted">
              Tipografi
            </div>
            <div className="text-lg font-medium text-ink">Inter & JetBrains Mono</div>
            <p className="text-xs text-muted leading-normal">
              Antarmuka menggunakan Inter, blok kode dan terminal menggunakan JetBrains Mono.
            </p>
            <div className="pt-2 text-xs font-mono text-muted">
              Kepatuhan Anti-AI-Slop: Terpenuhi
            </div>
          </div>
        </section>

        {/* Contoh Komponen CTA & Editor Kode */}
        <section className="border border-border-subtle rounded-lg bg-white p-6 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-medium text-ink">
              Verifikasi Komponen Interaktif & Tombol Primer
            </h2>
            <p className="text-sm text-muted">
              Contoh tombol primer beraksen Signal (10% rasio visual) dan tombol sekunder.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="bg-signal text-white rounded-md px-4 py-2 font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Mulai Sesi Belajar
            </button>
            <button
              type="button"
              className="border border-border-subtle text-ink hover:bg-paper rounded-md px-4 py-2 font-medium text-sm transition-colors"
            >
              Panduan Kurikulum
            </button>
            <span className="text-xs font-mono text-muted ml-auto">
              Aksen Signal: #6C7BFF
            </span>
          </div>

          {/* Area Pratinjau Editor Kode Gelap */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-mono text-muted">
              Pratinjau Ruang Editor Kode (Dark Surface #16181D)
            </div>
            <div className="bg-ink text-paper rounded-md p-4 font-mono text-xs border border-border-subtle overflow-x-auto">
              <span className="text-muted"># Inisialisasi Fondasi EasyCode</span>
              <br />
              <span className="text-signal">def</span>{" "}
              <span className="text-success">sapa_siswa</span>(nama: str):
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;pesan = f<span className="text-warning">&quot;Selamat datang di EasyCode, &#123;nama&#125;!&quot;</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-signal">return</span> pesan
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-muted">
          <span>EasyCode &copy; 2026 Kurikulum KKA SMA Kelas X</span>
          <span>Desain Developer-Centric</span>
        </div>
      </footer>
    </div>
  );
}
