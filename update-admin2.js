const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const searchStr = `onClick={() => setShowAddPusatDataModal(true)}`;
const replaceStr = `onClick={() => {
                                setIsEditingPusatData(false);
                                setEditPusatDataId(null);
                                setAddPusatDataForm({
                                  nama_lengkap: "", email_santri: "", kelas: "10", program_pendidikan: "Mondok", gender: "Putra", tempat_tanggal_lahir: "", nik: "", nisn: "",
                                  nama_ayah: "", pekerjaan_ayah: "", nama_ibu: "", pekerjaan_ibu: "", no_hp_wali: "", alamat: ""
                                });
                                setShowAddPusatDataModal(true);
                              }}`;

code = code.replace(searchStr, replaceStr);

fs.writeFileSync('src/app/admin/page.tsx', code);
