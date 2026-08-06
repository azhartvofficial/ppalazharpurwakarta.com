CREATE TABLE pusat_data_siswa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pas_foto TEXT NOT NULL,
    nama_lengkap TEXT NOT NULL,
    kelas TEXT NOT NULL,
    gender TEXT NOT NULL,
    tempat_tanggal_lahir TEXT NOT NULL,
    nik TEXT NOT NULL,
    nisn TEXT NOT NULL,
    nama_ayah TEXT NOT NULL,
    pekerjaan_ayah TEXT NOT NULL,
    nama_ibu TEXT NOT NULL,
    pekerjaan_ibu TEXT NOT NULL,
    no_hp_wali TEXT NOT NULL,
    alamat TEXT NOT NULL,
    tanggal_masuk DATE,
    tanggal_lulus DATE,
    kk_url TEXT,
    akte_url TEXT,
    ijazah_url TEXT,
    sktm_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security (RLS)
ALTER TABLE pusat_data_siswa ENABLE ROW LEVEL SECURITY;

-- Allow public to insert data (since PUSDA is a public portal for Wali Santri)
CREATE POLICY "Enable insert for public" ON pusat_data_siswa FOR INSERT WITH CHECK (true);

-- Allow public to select data (if needed for verification/preview)
CREATE POLICY "Enable read access for all users" ON pusat_data_siswa FOR SELECT USING (true);

-- Allow update/delete (Admin via Service Role handles this automatically, but we can add policies if needed)
CREATE POLICY "Enable update for all users" ON pusat_data_siswa FOR UPDATE USING (true);
