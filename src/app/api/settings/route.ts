import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const settingsFilePath = path.join(process.cwd(), 'maintenance.json');

export async function GET() {
  try {
    if (!fs.existsSync(settingsFilePath)) {
      fs.writeFileSync(settingsFilePath, JSON.stringify({ maintenanceMode: false }), 'utf-8');
      return NextResponse.json({ maintenanceMode: false });
    }
    
    const fileData = fs.readFileSync(settingsFilePath, 'utf-8');
    const settings = JSON.parse(fileData);
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to read maintenance settings:', error);
    return NextResponse.json({ maintenanceMode: false }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { maintenanceMode } = await request.json();
    
    fs.writeFileSync(settingsFilePath, JSON.stringify({ maintenanceMode }), 'utf-8');
    
    return NextResponse.json({ success: true, maintenanceMode });
  } catch (error) {
    console.error('Failed to save maintenance settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to save settings' }, { status: 500 });
  }
}
