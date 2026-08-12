const fs = require('fs');

let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const oldUpload = `      const uploadFile = async (file: File, folderType: string) => {
        const fileExt = file.name.split('.').pop();
        const safeName = addPusatDataForm.nama_lengkap.replace(/\\s+/g, '').toUpperCase();
        const fileName = \\\`( \${folderType}_\${safeName} ).\${fileExt}\\\`;
        
        const apiFormData = new FormData();
        apiFormData.append('file', file);
        apiFormData.append('filename', fileName);

        const endpoint = folderType === 'FOTO' ? '/api/upload-cloudinary' : '/api/upload';
        
        const res = await fetch(endpoint, {
          method: 'POST',
          body: apiFormData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Gagal mengunggah file');
          
        return data.url;
      };`;

const newUpload = `      const uploadFile = async (file: File, folderType: string, targetFolderId?: string, forceEndpoint?: string) => {
        const fileExt = file.name.split('.').pop();
        const safeName = addPusatDataForm.nama_lengkap.replace(/\\s+/g, '').toUpperCase();
        const fileName = \\\`( \${folderType}_\${safeName} ).\${fileExt}\\\`;
        
        const apiFormData = new FormData();
        apiFormData.append('file', file);
        apiFormData.append('filename', fileName);
        if (targetFolderId) apiFormData.append('targetFolderId', targetFolderId);

        const endpoint = forceEndpoint ? forceEndpoint : (folderType === 'FOTO' ? '/api/upload-cloudinary' : '/api/upload');
        
        const res = await fetch(endpoint, {
          method: 'POST',
          body: apiFormData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Gagal mengunggah file');
          
        return data.url;
      };`;

code = code.replace(oldUpload, newUpload);

const oldUploadCalls = `      if (addPusatDataFiles.pas_foto) {
        pas_foto = await uploadFile(addPusatDataFiles.pas_foto, "FOTO");
      }
      if (addPusatDataFiles.kk) kk_url = await uploadFile(addPusatDataFiles.kk, "KK");
      if (addPusatDataFiles.akte) akte_url = await uploadFile(addPusatDataFiles.akte, "AKTE");
      if (addPusatDataFiles.ijazah) ijazah_url = await uploadFile(addPusatDataFiles.ijazah, "IJAZAH");
      if (addPusatDataFiles.sktm) sktm_url = await uploadFile(addPusatDataFiles.sktm, "SKTM");`;

const newUploadCalls = `      // 1. Create Folder
      let targetFolderId = "";
      try {
        const folderRes = await fetch('/api/create-student-folder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            kelas: \`Kelas \${addPusatDataForm.kelas}\`,
            gender: addPusatDataForm.jenis_kelamin,
            nama_lengkap: addPusatDataForm.nama_lengkap
          })
        });
        const folderData = await folderRes.json();
        if (!folderRes.ok) throw new Error(folderData.error);
        targetFolderId = folderData.folderId;
      } catch (err) {
        console.error("Gagal membuat folder:", err);
      }

      // 2. Upload Files
      if (addPusatDataFiles.pas_foto) {
        pas_foto = await uploadFile(addPusatDataFiles.pas_foto, "FOTO", targetFolderId, '/api/upload-cloudinary');
        try {
          await uploadFile(addPusatDataFiles.pas_foto, "FOTO", targetFolderId, '/api/upload');
        } catch (e) {
          console.error("Gagal mengarsip pas foto ke GDrive", e);
        }
      }
      if (addPusatDataFiles.kk) kk_url = await uploadFile(addPusatDataFiles.kk, "KK", targetFolderId);
      if (addPusatDataFiles.akte) akte_url = await uploadFile(addPusatDataFiles.akte, "AKTE", targetFolderId);
      if (addPusatDataFiles.ijazah) ijazah_url = await uploadFile(addPusatDataFiles.ijazah, "IJAZAH", targetFolderId);
      if (addPusatDataFiles.sktm) sktm_url = await uploadFile(addPusatDataFiles.sktm, "SKTM", targetFolderId);`;

code = code.replace(oldUploadCalls, newUploadCalls);

fs.writeFileSync('src/app/admin/page.tsx', code);
console.log('Admin updated for dual upload and classification');
