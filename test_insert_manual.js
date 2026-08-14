const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://evyabiixhwqzptnfphpf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2eWFiaWl4aHdxenB0bmZwaHBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5OTI4MDAsImV4cCI6MjA5NDU2ODgwMH0.Bgy_0kLPsE45bgbo5-P-DEbYtmBZdLIo2t8JsEpJS_8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { error } = await supabase.from('beranda_content').insert({
    tipe: 'manual',
    foto_utama_url: 'http://example.com/img.jpg',
    judul_utama: 'test judul',
    deskripsi: 'test deskripsi manual',
    status: 'Rilis'
  });
  if (error) {
    console.error('Manual insert error (anon):', error);
  } else {
    console.log('Manual insert success (anon)');
  }
}
test();
