const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const target = `      const uploadFile = async (file: File, folderType: string) => {
        const fileExt = file.name.split('.').pop();
        const fileName = \`\${folderType}_\${Date.now()}.\${fileExt}\`;
        const filePath = \`pusat_data_santri/Kelas_\${addPusatDataForm.kelas}/\${addPusatDataForm.gender}/\${addPusatDataForm.nama_lengkap.replace(/\\s+/g, '_')}/\${fileName}\`;
        const { data, error } = await supabase.storage.from('berita-images').upload(filePath, file);
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from('berita-images').getPublicUrl(filePath);
        return publicUrl;
      };`;

const replacement = `      const uploadFile = async (file: File, folderType: string) => {
        const fileExt = file.name.split('.').pop();
        const safeName = addPusatDataForm.nama_lengkap.replace(/\\s+/g, '').toUpperCase();
        const fileName = \`( \${folderType}_\${safeName} ).\${fileExt}\`;
        
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

code = code.replace(target, replacement);
fs.writeFileSync('src/app/admin/page.tsx', code);
console.log('Replaced successfully:', code.includes('/api/upload-cloudinary'));
