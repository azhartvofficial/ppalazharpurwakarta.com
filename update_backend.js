const fs = require('fs');

// UPDATE create-student-folder/route.ts
const folderRouteCode = `import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const getDriveService = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google Drive OAuth credentials missing');
  }

  const auth = new google.auth.OAuth2(clientId, clientSecret, 'https://developers.google.com/oauthplayground');
  auth.setCredentials({ refresh_token: refreshToken });

  return google.drive({ version: 'v3', auth });
};

async function getOrCreateFolder(drive: any, folderName: string, parentId: string) {
  try {
    const escapedFolderName = folderName.replace(/'/g, "\\\\'");
    const query = \`mimeType='application/vnd.google-apps.folder' and name='\${escapedFolderName}' and '\${parentId}' in parents and trashed=false\`;
    
    const res = await drive.files.list({
      q: query,
      fields: 'files(id, name)',
      spaces: 'drive',
    });

    if (res.data.files && res.data.files.length > 0) {
      return res.data.files[0].id;
    }

    const fileMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId]
    };
    
    const created = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id'
    });

    return created.data.id;
  } catch (error) {
    console.error(\`Error getting/creating folder \${folderName}:\`, error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const { kelas, gender, nama_lengkap } = await req.json();

    if (!kelas || !gender || !nama_lengkap) {
      return NextResponse.json({ error: 'Missing required parameters: kelas, gender, nama_lengkap' }, { status: 400 });
    }

    const rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    if (!rootFolderId) {
      return NextResponse.json({ error: 'Server misconfiguration (Root Folder ID missing)' }, { status: 500 });
    }

    const drive = getDriveService();

    const cleanKelas = String(kelas).trim();
    const cleanGender = String(gender).trim();
    const cleanNama = String(nama_lengkap).trim();

    const kelasFolderId = await getOrCreateFolder(drive, cleanKelas, rootFolderId);
    const genderFolderId = await getOrCreateFolder(drive, cleanGender, kelasFolderId);
    const studentFolderId = await getOrCreateFolder(drive, cleanNama, genderFolderId);

    return NextResponse.json({ folderId: studentFolderId });

  } catch (error: any) {
    console.error('Create Student Folder Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`;

fs.writeFileSync('src/app/api/create-student-folder/route.ts', folderRouteCode);
console.log('Updated create-student-folder/route.ts');

// UPDATE upload/route.ts
let uploadCode = fs.readFileSync('src/app/api/upload/route.ts', 'utf8');
uploadCode = uploadCode.replace(
  `const filename = formData.get('filename') as string;`,
  `const filename = formData.get('filename') as string;\n    const targetFolderId = formData.get('targetFolderId') as string;`
);
uploadCode = uploadCode.replace(
  `let rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;`,
  `let rootFolderId = targetFolderId || process.env.GOOGLE_DRIVE_FOLDER_ID;`
);
fs.writeFileSync('src/app/api/upload/route.ts', uploadCode);
console.log('Updated upload/route.ts');
