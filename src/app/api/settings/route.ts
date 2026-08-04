import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('maintenance_mode')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Supabase settings GET error:', error);
      return NextResponse.json({ maintenanceMode: false });
    }

    return NextResponse.json({ maintenanceMode: data?.maintenance_mode || false });
  } catch (error) {
    console.error('Failed to read maintenance settings:', error);
    return NextResponse.json({ maintenanceMode: false }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { maintenanceMode } = await request.json();
    
    const { error } = await supabase
      .from('site_settings')
      .update({ maintenance_mode: maintenanceMode })
      .eq('id', 1);

    if (error) throw error;
    
    return NextResponse.json({ success: true, maintenanceMode });
  } catch (error) {
    console.error('Failed to save maintenance settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to save settings' }, { status: 500 });
  }
}
