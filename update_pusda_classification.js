const fs = require('fs');

let code = fs.readFileSync('src/app/pusda/page.tsx', 'utf8');

const oldUpload = `  const uploadFile = async (file: File, folderType: string) => {
    const fileExt = file.name.split('.').pop();
    const safeName = formData.nama_lengkap.replace(/\\s+/g, '').toUpperCase();
    const fileName = \\\`( \${folderType}_\${safeName} ).\${fileExt}\\\`;
    
    const apiFormData = new FormData();
    apiFormData.append('file', file);
    apiFormData.append('filename', fileName);

    const endpoint = folderType === 'PASFOTO' ? '/api/upload-cloudinary' : '/api/upload';
    
    const res = await fetch(endpoint, {
      method: 'POST',
      body: apiFormData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengunggah file');
      
    return data.url;
  };`;

const newUpload = `  const uploadFile = async (file: File, folderType: string, targetFolderId?: string, forceEndpoint?: string) => {
    const fileExt = file.name.split('.').pop();
    const safeName = formData.nama_lengkap.replace(/\\s+/g, '').toUpperCase();
    const fileName = \\\`( \${folderType}_\${safeName} ).\${fileExt}\\\`;
    
    const apiFormData = new FormData();
    apiFormData.append('file', file);
    apiFormData.append('filename', fileName);
    if (targetFolderId) apiFormData.append('targetFolderId', targetFolderId);

    const endpoint = forceEndpoint ? forceEndpoint : (folderType === 'PASFOTO' ? '/api/upload-cloudinary' : '/api/upload');
    
    const res = await fetch(endpoint, {
      method: 'POST',
      body: apiFormData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengunggah file');
      
    return data.url;
  };`;

code = code.replace(oldUpload, newUpload);

const oldUploadCalls = `      pas_foto = await uploadFile(compressedPasFoto, "PASFOTO");
      if (compressedKk) kk_url = await uploadFile(compressedKk, "KK");
      if (compressedAkte) akte_url = await uploadFile(compressedAkte, "AKTE");
      if (compressedIjazah) ijazah_url = await uploadFile(compressedIjazah, "IJAZAH");
      if (compressedSktm) sktm_url = await uploadFile(compressedSktm, "SKTM");`;

const newUploadCalls = `      // 1. Create Folder
      let targetFolderId = "";
      try {
        const folderRes = await fetch('/api/create-student-folder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            kelas: \`Kelas \${formData.kelas}\`,
            gender: formData.jenis_kelamin,
            nama_lengkap: formData.nama_lengkap
          })
        });
        const folderData = await folderRes.json();
        if (!folderRes.ok) throw new Error(folderData.error);
        targetFolderId = folderData.folderId;
      } catch (err) {
        console.error("Gagal membuat folder:", err);
      }

      // 2. Upload Files
      pas_foto = await uploadFile(compressedPasFoto, "PASFOTO", targetFolderId, '/api/upload-cloudinary');
      try {
        await uploadFile(compressedPasFoto, "PASFOTO", targetFolderId, '/api/upload');
      } catch (e) {
        console.error("Gagal mengarsip pas foto ke GDrive", e);
      }

      if (compressedKk) kk_url = await uploadFile(compressedKk, "KK", targetFolderId);
      if (compressedAkte) akte_url = await uploadFile(compressedAkte, "AKTE", targetFolderId);
      if (compressedIjazah) ijazah_url = await uploadFile(compressedIjazah, "IJAZAH", targetFolderId);
      if (compressedSktm) sktm_url = await uploadFile(compressedSktm, "SKTM", targetFolderId);`;

code = code.replace(oldUploadCalls, newUploadCalls);

fs.writeFileSync('src/app/pusda/page.tsx', code);
console.log('PUSDA updated for dual upload and classification');
