const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// 1. Add is_revised flag when editing
const editBlockRegex = /if \(isEditingPusatData && editPusatDataId\) {\s*const updatePayload: any = {/g;
const editBlockReplace = `if (isEditingPusatData && editPusatDataId) {
        alamatObj.is_revised = true;
        const updatePayload: any = {`;
if (code.match(editBlockRegex)) {
    code = code.replace(editBlockRegex, editBlockReplace);
}

// 2. Change Label and add description
const displayRegex = /Tanggal Penerimaan<\/span>\s*<span style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 800 }}>\s*\{selectedPusatData\.status === 'Terima' \? \(\(selectedPusatData as any\)\.accepted_at \? new Date\(\(selectedPusatData as any\)\.accepted_at\)\.toLocaleDateString\('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }\) : \(selectedPusatData\.created_at \? new Date\(selectedPusatData\.created_at\)\.toLocaleDateString\('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }\) : '-'\)\) : 'Belum Diterima'\}\s*<\/span>/g;

const displayReplace = `Tanggal Disetujui</span>
                  <span style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 800, display: 'flex', alignItems: 'center' }}>
                    {(selectedPusatData.status === 'Terima' || selectedPusatData.status === 'Approved' || selectedPusatData.status === 'Aktif') ? ((selectedPusatData as any).accepted_at ? new Date((selectedPusatData as any).accepted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : (selectedPusatData.created_at ? new Date(selectedPusatData.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-')) : 'Belum Disetujui'}
                    {(selectedPusatData.alamat && (typeof selectedPusatData.alamat === 'string' ? JSON.parse(selectedPusatData.alamat) : selectedPusatData.alamat).is_revised) && (
                      <span style={{ fontSize: '0.65rem', color: '#ef4444', background: '#fee2e2', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px' }}>(Ada Revisi)</span>
                    )}
                  </span>`;

if (code.match(displayRegex)) {
    code = code.replace(displayRegex, displayReplace);
    fs.writeFileSync('src/app/admin/page.tsx', code);
    console.log('Successfully applied all changes!');
} else {
    console.log('Display regex match failed');
}
