CREATE TABLE news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kategori TEXT NOT NULL CHECK (kategori IN ('Papan Pengumuman', 'Artikel Berita')),
    judul_utama TEXT NOT NULL,
    sumber_gambar TEXT NOT NULL CHECK (sumber_gambar IN ('Internal', 'Manual')),
    sumber_gambar_manual TEXT,
    gambar_judul_url TEXT,
    isi_berita TEXT NOT NULL,
    jenis_lampiran_2 TEXT CHECK (jenis_lampiran_2 IN ('', 'PDF', 'Gambar', 'Video Youtube', 'Link Lainnya')),
    lampiran_2_url TEXT,
    penulis TEXT NOT NULL,
    sumber_opsional TEXT,
    status TEXT NOT NULL DEFAULT 'Published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Buka akses agar bisa dibaca oleh publik (karena berita ini ditampilkan di public page)
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "News are viewable by everyone" ON news_articles FOR SELECT USING (true);
-- Berikan akses Insert/Update/Delete khusus untuk Admin
-- Asumsi Supabase Service Role akan memiliki akses penuh (bypass RLS) secara default.
