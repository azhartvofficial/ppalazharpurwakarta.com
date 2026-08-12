const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// 1. Fix Popstate UI
const popSearch = `  // Intercept Browser Back Button
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (!window.confirm("Apakah Anda yakin ingin keluar dari halaman Admin dan kembali ke Beranda?")) {
        window.history.pushState(null, "", window.location.href);
      } else {
        window.location.href = "/";
      }
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);`;

const popReplace = `  // Intercept Browser Back Button
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      window.history.pushState(null, "", window.location.href);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      openConfirm(
        "Konfirmasi Keluar",
        "Apakah Anda yakin ingin keluar dari halaman Admin dan kembali ke Beranda?",
        () => { window.location.href = "/"; },
        false,
        "Ya, Kembali",
        "Batal"
      );
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);`;

code = code.replace(popSearch, popReplace);

// 2. Add Sidebar Button
const sidebarSearch = `            <Link 
              href="/antigravity"
              className="nav-item"
              onClick={() => setSidebarOpen(false)}
              style={{ color: 'white', border: '1px solid rgba(255, 140, 0, 0.25)', background: 'rgba(255, 140, 0, 0.05)', display: 'flex', alignItems: 'center' }}
            >
              <span className="nav-icon">?</span> <span>Antigravity IDE</span>
            </Link>
          </nav>`;

const sidebarReplace = `            <Link 
              href="/antigravity"
              className="nav-item"
              onClick={() => setSidebarOpen(false)}
              style={{ color: 'white', border: '1px solid rgba(255, 140, 0, 0.25)', background: 'rgba(255, 140, 0, 0.05)', display: 'flex', alignItems: 'center' }}
            >
              <span className="nav-icon">?</span> <span>Antigravity IDE</span>
            </Link>
            
            <button onClick={() => {
              openConfirm(
                "Konfirmasi Keluar",
                "Apakah Anda yakin ingin keluar dari halaman Admin dan kembali ke Beranda?",
                () => { window.location.href = "/"; },
                false,
                "Ya, Kembali",
                "Batal"
              );
            }} className="nav-item" style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center' }}>
              <span className="nav-icon" style={{ fontSize: '1.2rem' }}>??</span> <span>Kembali ke Beranda</span>
            </button>
          </nav>`;

code = code.replace(sidebarSearch, sidebarReplace);

// 3. Fix Pusat Data Refresh Button
const pusatSearch = `                  <div className="accounts-header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
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

// Actually the icon in the file is probably ?? or ?? depending on powershell output.
// I will use regex to match the button inside Pusat Data Siswa
let pdMatch = code.match(/<div className="accounts-header-actions"[\s\S]*?Data Identitas Santri[\s\S]*?Kelola rekam jejak identitas dan dokumen vital santri[\s\S]*?<\/div>\s*<\/div>/);
if (pdMatch) {
  const pdReplace = `                  <div className="accounts-header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#002147', margin: 0 }}>Data Identitas Santri</h3>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Kelola rekam jejak identitas dan dokumen vital santri</span>
                    </div>
                    <button onClick={() => { fetchPusatData(); openAlert("Sedang menyegarkan Pusat Data..."); }} style={{ padding: '8px 16px', background: 'rgba(0, 33, 71, 0.05)', color: '#002147', borderRadius: '8px', border: '1px solid rgba(0, 33, 71, 0.1)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }} onMouseOver={(e) => { e.currentTarget.style.background = '#002147'; e.currentTarget.style.color = 'white'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0, 33, 71, 0.05)'; e.currentTarget.style.color = '#002147'; }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 2s linear infinite' }}><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                      Refresh
                    </button>
                  </div>`;
  code = code.replace(pdMatch[0], pdReplace);
}

// 4. Fix Kelola Akun Refresh Button
const accMatch = code.match(/className="accounts-sub-navbar"/);
if (accMatch) {
  const accIndex = code.indexOf(accMatch[0]);
  const accPrefix = code.substring(0, accIndex);
  if (!accPrefix.includes('Kelola Akun Pendaftar')) {
    const accInsert = `                  <div className="accounts-header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#002147', margin: 0 }}>Kelola Akun Pendaftar</h3>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Atur akses dan peran pengguna</span>
                    </div>
                    <button onClick={() => { fetchAccounts(); openAlert("Sedang menyegarkan Akun..."); }} style={{ padding: '8px 16px', background: 'rgba(0, 33, 71, 0.05)', color: '#002147', borderRadius: '8px', border: '1px solid rgba(0, 33, 71, 0.1)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }} onMouseOver={(e) => { e.currentTarget.style.background = '#002147'; e.currentTarget.style.color = 'white'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0, 33, 71, 0.05)'; e.currentTarget.style.color = '#002147'; }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 2s linear infinite' }}><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                      Refresh
                    </button>
                  </div>\n`;
    const searchString = `                  {/* Glassmorphic Sub-Navbar pop up / tab menu */}\n                  <div className="accounts-sub-navbar"`;
    if (code.includes(searchString)) {
        code = code.replace(searchString, accInsert + searchString);
    }
  }
}

fs.writeFileSync('src/app/admin/page.tsx', code);
console.log('All changes applied');
