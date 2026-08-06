import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Readable } from 'stream';

async function getOrCreateFolder(drive: any, name: string, parentId: string) {
  const q = `mimeType='application/vnd.google-apps.folder' and name='${name.replace(/'/g, "\\'")}' and '${parentId}' in parents and trashed=false`;
  
  const res = await drive.files.list({
    q,
    fields: 'files(id)',
  });

  if (res.data.files && res.data.files.length > 0) {
    return res.data.files[0].id;
  }

  const folderRes = await drive.files.create({
    requestBody: {
      name,
      parents: [parentId],
      mimeType: 'application/vnd.google-apps.folder',
    },
    fields: 'id',
  });

  return folderRes.data.id;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const filename = formData.get('filename') as string;
    const folderPathStr = formData.get('folderPath') as string; // e.g. "Kelas_7/Laki-laki/Budi"

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY_BASE64 ? Buffer.from(process.env.GOOGLE_PRIVATE_KEY_BASE64, 'base64').toString('utf8') : null;
    let rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (!clientEmail || !privateKey || !rootFolderId) {
      return NextResponse.json({ error: 'Server misconfiguration (Google Drive credentials missing)' }, { status: 500 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // Traverse and create folders dynamically
    let currentParentId = rootFolderId;
    
    if (folderPathStr) {
      const folders = folderPathStr.split('/').filter(Boolean);
      for (const folderName of folders) {
        currentParentId = await getOrCreateFolder(drive, folderName, currentParentId);
      }
    }

    // Convert file to stream
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    const driveRes = await drive.files.create({
      requestBody: {
        name: filename || file.name,
        parents: [currentParentId],
      },
      media: {
        mimeType: file.type,
        body: stream,
      },
      fields: 'id, webViewLink, webContentLink',
    });

    return NextResponse.json({ url: driveRes.data.webViewLink });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
