const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://evyabiixhwqzptnfphpf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2eWFiaWl4aHdxenB0bmZwaHBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5OTI4MDAsImV4cCI6MjA5NDU2ODgwMH0.Bgy_0kLPsE45bgbo5-P-DEbYtmBZdLIo2t8JsEpJS_8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('beranda_content').select('*').limit(1);
  if (error) {
    console.error('Select error (anon):', error);
  } else {
    console.log('Select success (anon):', data.length > 0 ? 'Has data' : 'Empty');
  }
}
test();
