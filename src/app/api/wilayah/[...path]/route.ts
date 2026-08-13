import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const urlPath = path.join('/');
    const url = `https://emsifa.github.io/api-wilayah-indonesia/api/${urlPath}`;
    
    // Using fetch with caching for 1 day
    const res = await fetch(url, { 
      next: { revalidate: 86400 } 
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch from ${url}`);
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Wilayah proxy error:", error);
    return NextResponse.json({ error: 'Failed to fetch wilayah data' }, { status: 500 });
  }
}
