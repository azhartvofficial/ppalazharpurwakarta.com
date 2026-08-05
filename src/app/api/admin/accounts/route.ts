import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Server tidak dikonfigurasi dengan SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY." }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { 
      name, email, password, role, status,
      kepengurusan, nama_santri, jenjang_pendidikan, pilihan_kelas, program_pendidikan 
    } = await request.json();

    // 1. Create user in Supabase Authentication
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: { name, role }
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user.id;
    
    // 2. Sync to public.admin_accounts
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('admin_accounts')
      .insert([
        { 
          id: userId, 
          name, 
          email, 
          role, 
          status: status || "Aktif",
          kepengurusan,
          nama_santri,
          jenjang_pendidikan,
          pilihan_kelas,
          program_pendidikan
        }
      ])
      .select();

    if (dbError) {
      // Rollback Auth creation if DB insert fails
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: dbError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: dbData[0] }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Server tidak dikonfigurasi dengan SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY." }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID Pengguna tidak ditemukan." }, { status: 400 });
    }

    // 1. Delete from public.admin_accounts first
    const { error: dbError } = await supabaseAdmin
      .from('admin_accounts')
      .delete()
      .eq('id', id);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 400 });
    }

    // 2. Delete from Supabase Authentication
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
    
    if (authError) {
      console.error("Gagal menghapus user dari Supabase Auth:", authError.message);
      // We still return success since the public data is deleted, but ideally we should handle it better.
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
