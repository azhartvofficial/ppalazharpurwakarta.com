const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const searchStr = `    setIsSubmittingAddPusatData(true);
    try {
      
      const compressImage = async (file: File, label: string) => {`;

const replaceStr = `    setIsSubmittingAddPusatData(true);
    try {
      // Check for duplicates
      if (addPusatDataForm.nik || addPusatDataForm.nisn || addPusatDataForm.tempat_tanggal_lahir) {
        setCompressionStatus("Memeriksa duplikasi data...");
        let query = supabase
          .from('pusat_data_siswa')
          .select('id, nik, nisn')
          .or(\`nik.eq.\${addPusatDataForm.nik},nisn.eq.\${addPusatDataForm.nisn},tempat_tanggal_lahir.eq."\${addPusatDataForm.tempat_tanggal_lahir}"\`);
        
        if (isEditingPusatData && editPusatDataId) {
          query = query.neq('id', editPusatDataId);
        }

        const { data: duplicates, error: dupError } = await query;
        if (dupError) throw new Error("Gagal memeriksa data duplikat.");
        
        if (duplicates && duplicates.length > 0) {
          const dup = duplicates[0];
          let reason = "";
          if (dup.nik === addPusatDataForm.nik) reason = "NIK";
          else if (dup.nisn === addPusatDataForm.nisn) reason = "NISN";
          else reason = "TTL (Tempat, Tanggal Lahir)";
          
          openAlert(\`Gagal menyimpan: Data dengan \${reason} yang sama sudah ada di sistem.\`);
          setIsSubmittingAddPusatData(false);
          setCompressionStatus("");
          return;
        }
      }
      
      const compressImage = async (file: File, label: string) => {`;

code = code.replace(searchStr, replaceStr);

fs.writeFileSync('src/app/admin/page.tsx', code);
console.log("Admin duplicated logic updated");
