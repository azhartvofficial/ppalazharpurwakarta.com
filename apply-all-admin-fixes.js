const fs = require('fs');
let lines = fs.readFileSync('src/app/admin/page.tsx', 'utf8').split('\n');

// 1. Popstate fix
const popIdx = lines.findIndex(l => l.includes('window.confirm("Apakah Anda yakin ingin keluar dari halaman Admin dan kembali ke Beranda?")'));
if (popIdx !== -1) {
    lines[popIdx - 1] = `      window.history.pushState(null, "", window.location.href);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      openConfirm(
        "Konfirmasi Keluar",
        "Apakah Anda yakin ingin keluar dari halaman Admin dan kembali ke Beranda?",
        () => { window.location.href = "/"; },
        false,
        "Ya, Kembali",
        "Batal"
      );`;
    lines[popIdx] = ``;
    lines[popIdx + 1] = ``;
    lines[popIdx + 2] = ``;
    lines[popIdx + 3] = ``;
    console.log("Popstate fixed");
}

// 2. Sidebar Back Button
const logoutIdx = lines.findIndex(l => l.includes('<button onClick={handleLogout} className="sidebar-logout-btn">'));
if (logoutIdx !== -1) {
    lines.splice(logoutIdx, 0, `            <button onClick={() => {
              openConfirm(
                "Konfirmasi Keluar",
                "Apakah Anda yakin ingin keluar dari halaman Admin dan kembali ke Beranda?",
                () => { window.location.href = "/"; },
                false,
                "Ya, Kembali",
                "Batal"
              );
            }} className="sidebar-logout-btn" style={{ marginBottom: '10px', background: 'rgba(255,255,255,0.1)' }}>
              <span className="nav-icon" style={{ fontSize: '1.2rem' }}>??</span> <span>Kembali ke Beranda</span>
            </button>`);
    console.log("Sidebar button added");
}

// 3. Pusat Data Refresh
const pdIdx = lines.findIndex(l => l.includes('Data Identitas Santri'));
if (pdIdx !== -1) {
    lines[pdIdx - 3] = `                  <div className="accounts-header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>`;
    lines[pdIdx - 1] = ``;
    lines[pdIdx + 1] = ``;
    lines[pdIdx + 2] = ``;
    lines[pdIdx + 3] = ``;
    lines[pdIdx + 4] = ``;
    lines.splice(pdIdx + 6, 0, `                    <button onClick={() => { fetchPusatData(); openAlert("Sedang menyegarkan Pusat Data..."); }} style={{ padding: '8px 16px', background: 'rgba(0, 33, 71, 0.05)', color: '#002147', borderRadius: '8px', border: '1px solid rgba(0, 33, 71, 0.1)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }} onMouseOver={(e) => { e.currentTarget.style.background = '#002147'; e.currentTarget.style.color = 'white'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0, 33, 71, 0.05)'; e.currentTarget.style.color = '#002147'; }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                      Refresh
                    </button>`);
    console.log("Pusat Data refresh fixed");
}

fs.writeFileSync('src/app/admin/page.tsx', lines.join('\n'));
