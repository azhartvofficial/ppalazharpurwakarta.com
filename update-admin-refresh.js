const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// 1. Fix Pusat Data Siswa Refresh Button
const pusatSearch = `<div className="accounts-header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#002147', margin: 0 }}>Data Identitas Santri</h3>
                        <button onClick={() => { fetchPusatData(); openAlert("Sedang menyegarkan Pusat Data..."); }} style={{ padding: '6px 12px', background: '#002147', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '1rem' }}>??</span> Perbarui Data
                        </button>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Kelola rekam jejak identitas dan dokumen vital santri</span>
                    </div>
                  </div>`;

const pusatReplace = `<div className="accounts-header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#002147', margin: 0 }}>Data Identitas Santri</h3>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Kelola rekam jejak identitas dan dokumen vital santri</span>
                    </div>
                    <button onClick={() => { fetchPusatData(); openAlert("Sedang menyegarkan Pusat Data..."); }} style={{ padding: '8px 16px', background: 'rgba(0, 33, 71, 0.05)', color: '#002147', borderRadius: '8px', border: '1px solid rgba(0, 33, 71, 0.1)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }} onMouseOver={(e) => { e.currentTarget.style.background = '#002147'; e.currentTarget.style.color = 'white'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0, 33, 71, 0.05)'; e.currentTarget.style.color = '#002147'; }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                      Refresh
                    </button>
                  </div>`;

if (code.includes(pusatSearch)) {
  code = code.replace(pusatSearch, pusatReplace);
  console.log('Pusat Data refresh button updated');
} else {
  console.log('Pusat Data search string not found');
}

// 2. Fix Kelola Akun Refresh Button
const accountsSearch = `                <motion.div
                  key="accounts"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="tab-content"
                >
                  {/* Glassmorphic Sub-Navbar pop up / tab menu */}`;

const accountsReplace = `                <motion.div
                  key="accounts"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="tab-content"
                >
                  <div className="accounts-header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#002147', margin: 0 }}>Kelola Akun Pendaftar</h3>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Atur akses dan peran pengguna</span>
                    </div>
                    <button onClick={() => { fetchAccounts(); openAlert("Sedang menyegarkan Kelola Akun..."); }} style={{ padding: '8px 16px', background: 'rgba(0, 33, 71, 0.05)', color: '#002147', borderRadius: '8px', border: '1px solid rgba(0, 33, 71, 0.1)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }} onMouseOver={(e) => { e.currentTarget.style.background = '#002147'; e.currentTarget.style.color = 'white'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0, 33, 71, 0.05)'; e.currentTarget.style.color = '#002147'; }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                      Refresh
                    </button>
                  </div>
                  {/* Glassmorphic Sub-Navbar pop up / tab menu */}`;

if (code.includes(accountsSearch)) {
  code = code.replace(accountsSearch, accountsReplace);
  console.log('Kelola Akun refresh button added');
} else {
  console.log('Kelola Akun search string not found');
}

fs.writeFileSync('src/app/admin/page.tsx', code);
