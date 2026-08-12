const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// 1. Add handleBackToHome
const handleBackToHomeCode = `
  const handleBackToHome = () => {
    if (window.confirm("Apakah Anda yakin untuk kembali ke halaman beranda?")) {
      window.location.href = "/";
    }
  };
`;
code = code.replace('  const handleLogout = () => {', handleBackToHomeCode + '\n  const handleLogout = () => {');

// 2. Add Back button to sidebar right above logout button
const logoutBtnSearch = `<button onClick={handleLogout} className="sidebar-logout-btn">
              <span className="nav-icon" style={{ fontSize: '1.2rem' }}>??</span> <span>Keluar</span>
            </button>`;
const backBtnCode = `            <button onClick={handleBackToHome} className="sidebar-logout-btn" style={{ marginBottom: '10px', background: 'rgba(255,255,255,0.1)' }}>
              <span className="nav-icon" style={{ fontSize: '1.2rem' }}>??</span> <span>Kembali ke Beranda</span>
            </button>
            <button onClick={handleLogout} className="sidebar-logout-btn">
              <span className="nav-icon" style={{ fontSize: '1.2rem' }}>??</span> <span>Keluar</span>
            </button>`;
code = code.replace(logoutBtnSearch, backBtnCode);

// 3. Add Refresh Button to Pusat Data Siswa
const pusatDataHeaderSearch = `<h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#002147', margin: 0 }}>Data Identitas Santri</h3>`;
const pusatDataHeaderReplace = `<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#002147', margin: 0 }}>Data Identitas Santri</h3>
                        <button onClick={() => { fetchPusatData(); openAlert("Sedang menyegarkan Pusat Data..."); }} style={{ padding: '6px 12px', background: '#002147', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '1rem' }}>??</span> Perbarui Data
                        </button>
                      </div>`;
code = code.replace(pusatDataHeaderSearch, pusatDataHeaderReplace);

// 4. Add Refresh Button to Kelola Akun
const accountsHeaderSearch = `<h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#002147', margin: 0 }}>Daftar Akun Pendaftar</h3>`;
const accountsHeaderReplace = `<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#002147', margin: 0 }}>Daftar Akun Pendaftar</h3>
                        <button onClick={() => { fetchAccounts(); openAlert("Sedang menyegarkan Kelola Akun..."); }} style={{ padding: '6px 12px', background: '#002147', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '1rem' }}>??</span> Perbarui Data
                        </button>
                      </div>`;
code = code.replace(accountsHeaderSearch, accountsHeaderReplace);

fs.writeFileSync('src/app/admin/page.tsx', code);
console.log('Features added');
