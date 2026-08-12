import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Server tidak dikonfigurasi dengan baik." }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const payload = await request.json();
    
    // Check if user already exists in auth or admin_accounts
    const { data: existingUser } = await supabaseAdmin.from('admin_accounts').select('id').eq('email', payload.email).single();
    if (existingUser) {
      return NextResponse.json({ error: "Email sudah digunakan oleh akun lain." }, { status: 400 });
    }

    // Insert to login_requests
    const { data, error } = await supabaseAdmin
      .from('login_requests')
      .insert([{
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role: payload.role,
        kepengurusan: payload.kepengurusan,
        nama_santri: payload.nama_santri,
        jenjang_pendidikan: payload.jenjang_pendidikan,
        pilihan_kelas: payload.pilihan_kelas,
        program_pendidikan: payload.program_pendidikan,
        kampus: payload.kampus,
        device: 'Web Browser',
        status: 'Pending'
      }])
      .select();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: "Permintaan dengan email ini sedang menunggu persetujuan." }, { status: 400 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: data[0] }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
