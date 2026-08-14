const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://evyabiixhwqzptnfphpf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2eWFiaWl4aHdxenB0bmZwaHBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5OTI4MDAsImV4cCI6MjA5NDU2ODgwMH0.Bgy_0kLPsE45bgbo5-P-DEbYtmBZdLIo2t8JsEpJS_8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: news } = await supabase.from('news_articles').select('*').limit(1);
  
  const { error } = await supabase.from('beranda_content').insert({
    tipe: 'berita',
    berita_id: news[0].id,
    foto_utama_url: news[0].gambar_judul_url || '',
    judul_utama: news[0].judul_utama || '',
    deskripsi: 'test deskripsi',
    status: 'Rilis'
  });
  if (error) {
    console.error('Insert error (anon):', error);
  } else {
    console.log('Insert success (anon)');
  }
}
test();
