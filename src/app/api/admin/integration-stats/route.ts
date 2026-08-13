import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export const dynamic = 'force-dynamic';

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export async function GET() {
  const stats = {
    cloudinaryStorage: '0 Bytes',
    cloudinaryCredits: '0',
    vercelStatus: 'Checking...',
    driveStorage: '0 Bytes',
    driveTotal: '15 GB',
    error: null as string | null
  };

  try {
    // 1. Cloudinary
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const cloudKey = process.env.CLOUDINARY_API_KEY;
    const cloudSecret = process.env.CLOUDINARY_API_SECRET;
    
    if (cloudName && cloudKey && cloudSecret) {
      try {
        const auth = Buffer.from(`${cloudKey}:${cloudSecret}`).toString('base64');
        const cRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/usage`, {
          headers: {
            'Authorization': `Basic ${auth}`
          }
        });
        if (cRes.ok) {
          const cData = await cRes.json();
          if (cData.storage && cData.storage.usage !== undefined) {
            stats.cloudinaryStorage = formatBytes(cData.storage.usage);
          }
          if (cData.credits && cData.credits.usage !== undefined) {
            stats.cloudinaryCredits = cData.credits.usage.toString();
          }
        } else {
          console.error("Cloudinary error response:", await cRes.text());
        }
      } catch (e) {
        console.error("Cloudinary fetch error:", e);
      }
    }

    // 2. Vercel
    const vercelToken = process.env.VERCEL_TOKEN;
    if (vercelToken) {
      try {
        const vRes = await fetch('https://api.vercel.com/v9/projects', {
          headers: {
            'Authorization': `Bearer ${vercelToken}`
          }
        });
        if (vRes.ok) {
          stats.vercelStatus = 'Connected / Active';
        } else {
          stats.vercelStatus = 'Connection Error';
          console.error("Vercel error response:", await vRes.text());
        }
      } catch (e) {
        console.error("Vercel fetch error:", e);
      }
    } else {
      stats.vercelStatus = 'No Token';
    }

    // 3. Google Drive
    const gEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const gKey = process.env.GOOGLE_PRIVATE_KEY_BASE64;
    
    if (gEmail && gKey) {
      try {
        const privateKey = Buffer.from(gKey, 'base64').toString('utf-8');
        const auth = new google.auth.JWT({
          email: gEmail,
          key: privateKey,
          scopes: ['https://www.googleapis.com/auth/drive.metadata.readonly']
        });

        const drive = google.drive({ version: 'v3', auth });
        const dRes = await drive.about.get({
          fields: 'storageQuota'
        });

        if (dRes.data.storageQuota) {
          const usage = parseInt(dRes.data.storageQuota.usage || '0', 10);
          const limit = parseInt(dRes.data.storageQuota.limit || '16106127360', 10);
          stats.driveStorage = formatBytes(usage);
          stats.driveTotal = formatBytes(limit);
        }
      } catch (e) {
        console.error("Google Drive fetch error:", e);
      }
    }

  } catch (error: any) {
    stats.error = error.message;
  }

  return NextResponse.json(stats);
}
