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

    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Data tidak lengkap." }, { status: 400 });
    }

    // 1. Ambil data dari login_requests
    const { data: requestData, error: requestError } = await supabaseAdmin
      .from('login_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (requestError || !requestData) {
      return NextResponse.json({ error: "Permintaan tidak ditemukan." }, { status: 404 });
    }

    if (status === "Approved") {
      // 2. Create user di Supabase Auth
      let userId = '';
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: requestData.email,
        password: requestData.password,
        email_confirm: true,
        user_metadata: { name: requestData.name, role: requestData.role }
      });

      if (authError) {
        if (authError.message.includes('already been registered') || authError.status === 422 || authError.message.includes('already exists')) {
          // Cari user yang sudah ada
          const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
          if (listError) {
            return NextResponse.json({ error: `Gagal mencari Auth: ${listError.message}` }, { status: 400 });
          }
          const existingUser = usersData.users.find(u => u.email === requestData.email);
          if (!existingUser) {
             return NextResponse.json({ error: `User Auth tidak ditemukan walaupun email terdaftar.` }, { status: 400 });
          }
          
          userId = existingUser.id;
          
          // Perbarui password dan metadata sesuai permintaan baru
          await supabaseAdmin.auth.admin.updateUserById(userId, {
            password: requestData.password,
            user_metadata: { name: requestData.name, role: requestData.role }
          });
        } else {
          return NextResponse.json({ error: `Gagal membuat Auth: ${authError.message}` }, { status: 400 });
        }
      } else {
        userId = authData.user.id;
      }

      // 3. Masukkan ke public.admin_accounts
      const { error: dbError } = await supabaseAdmin
        .from('admin_accounts')
        .upsert([{
          id: userId,
          name: requestData.name,
          email: requestData.email,
          role: requestData.role,
          status: "Aktif",
          kepengurusan: requestData.kepengurusan,
          nama_santri: requestData.nama_santri,
          jenjang_pendidikan: requestData.jenjang_pendidikan,
          pilihan_kelas: requestData.pilihan_kelas,
          program_pendidikan: requestData.program_pendidikan,
          kampus: requestData.kampus
        }]);

      if (dbError) {
        // Rollback Auth jika gagal masuk DB
        await supabaseAdmin.auth.admin.deleteUser(userId);
        return NextResponse.json({ error: `Gagal sinkronisasi DB: ${dbError.message}` }, { status: 400 });
      }
    }

    // 4. Update status di tabel login_requests
    // Optional: Kita bisa null-kan password demi keamanan setelah disetujui.
    const updatePayload: any = { status };
    if (status === "Approved") updatePayload.password = null;

    const { error: updateError } = await supabaseAdmin
      .from('login_requests')
      .update(updatePayload)
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: "Gagal memperbarui status permintaan." }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
