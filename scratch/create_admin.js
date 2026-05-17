const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://evyabiixhwqzptnfphpf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2eWFiaWl4aHdxenB0bmZwaHBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5OTI4MDAsImV4cCI6MjA5NDU2ODgwMH0.Bgy_0kLPsE45bgbo5-P-DEbYtmBZdLIo2t8JsEpJS_8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
  console.log('Mendaftarkan akun administrator baru di Supabase...');
  const { data, error } = await supabase.auth.signUp({
    email: 'admin.alazharpwk@gmail.com',
    password: 'AdminAlazhar2026!',
    options: {
      data: {
        nama_lengkap: 'Super Admin',
      }
    }
  });

  if (error) {
    console.error('Pendaftaran gagal:', error.message);
  } else {
    console.log('Pendaftaran berhasil dilakukan!');
    console.log('User ID:', data.user ? data.user.id : 'N/A');
    console.log('E-Mail:', data.user ? data.user.email : 'N/A');
    console.log('Silakan gunakan akun ini untuk masuk ke halaman login.');
  }
}

createAdmin();
