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

    const { identifier } = await request.json();

    if (!identifier) {
      return NextResponse.json({ error: "Identifier diperlukan" }, { status: 400 });
    }

    // Attempt to find by email first, if it looks like an email
    if (identifier.includes('@')) {
      return NextResponse.json({ email: identifier.trim().toLowerCase() }, { status: 200 });
    }

    // Try finding exact match by name
    let { data, error } = await supabaseAdmin
      .from('admin_accounts')
      .select('email')
      .ilike('name', identifier.trim())
      .limit(1)
      .maybeSingle();

    if (data && data.email) {
      return NextResponse.json({ email: data.email }, { status: 200 });
    }

    return NextResponse.json({ error: "Akun tidak ditemukan. Pastikan nama lengkap, email, atau no HP sudah benar." }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
