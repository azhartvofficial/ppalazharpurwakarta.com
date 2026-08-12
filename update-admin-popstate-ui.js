const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// 1. Replace the native window.confirm in handlePopState with openConfirm
const popstateSearch = `      if (!window.confirm("Apakah Anda yakin ingin keluar dari halaman Admin dan kembali ke Beranda?")) {
        window.history.pushState(null, "", window.location.href);
      } else {
        window.location.href = "/";
      }`;

const popstateReplace = `      window.history.pushState(null, "", window.location.href);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      openConfirm(
        "Konfirmasi Keluar",
        "Apakah Anda yakin ingin keluar dari halaman Admin dan kembali ke Beranda?",
        () => { window.location.href = "/"; },
        false,
        "Ya, Kembali",
        "Batal"
      );`;

if (code.includes(popstateSearch)) {
  code = code.replace(popstateSearch, popstateReplace);
  console.log('Popstate UI updated');
} else {
  console.log('Popstate search string not found');
}

// 2. Add handleBackToHome button functionality (if missing) and button
const handleLogoutSearch = `  const handleLogout = () => {`;
const handleBackToHomeFunc = `  const handleBackToHome = () => {
    openConfirm(
      "Konfirmasi Keluar",
      "Apakah Anda yakin ingin keluar dari halaman Admin dan kembali ke Beranda?",
      () => { window.location.href = "/"; },
      false,
      "Ya, Kembali",
      "Batal"
    );
  };

  const handleLogout = () => {`;

if (code.includes(handleLogoutSearch) && !code.includes('const handleBackToHome = () =>')) {
  code = code.replace(handleLogoutSearch, handleBackToHomeFunc);
  console.log('handleBackToHome added');
}

const logoutBtnSearch = `<button onClick={handleLogout} className="sidebar-logout-btn">`;
const logoutBtnReplace = `<button onClick={handleBackToHome} className="sidebar-logout-btn" style={{ marginBottom: '10px', background: 'rgba(255,255,255,0.1)' }}>
              <span className="nav-icon" style={{ fontSize: '1.2rem' }}>??</span> <span>Kembali ke Beranda</span>
            </button>
            <button onClick={handleLogout} className="sidebar-logout-btn">`;

if (code.includes(logoutBtnSearch) && !code.includes('onClick={handleBackToHome}')) {
  // Replace the LAST occurrence or ALL occurrences?
  // It's just a sidebar logout button, there might be only one.
  let parts = code.split(logoutBtnSearch);
  if (parts.length > 1) {
    code = parts.join(logoutBtnReplace);
    console.log('Sidebar back button added');
  }
}

fs.writeFileSync('src/app/admin/page.tsx', code);
