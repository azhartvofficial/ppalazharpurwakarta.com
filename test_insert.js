const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://evyabiixhwqzptnfphpf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2eWFiaWl4aHdxenB0bmZwaHBmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODk5MjgwMCwiZXhwIjoyMDk0NTY4ODAwfQ.-E1PBCrjDq2slwE12rSsD3frnuqRHoN6iNP_-lhIlik';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: news, error: newsErr } = await supabase.from('news_articles').select('*').limit(1);
  if (newsErr) {
    console.error('News error:', newsErr);
    return;
  }
  if (!news || news.length === 0) {
    console.log('No news');
    return;
  }
  console.log('Found news:', news[0].id);

  const { error } = await supabase.from('beranda_content').insert({
    tipe: 'berita',
    berita_id: news[0].id,
    foto_utama_url: news[0].gambar_judul_url || '',
    judul_utama: news[0].judul_utama || '',
    deskripsi: 'test deskripsi',
    status: 'Rilis'
  });
  if (error) {
    console.error('Insert error:', error);
  } else {
    console.log('Insert success');
  }
}
test();
