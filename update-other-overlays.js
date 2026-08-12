const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// News Modal
const newsRegex = /{showAddNewsModal && \(\s*<div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba\(0,0,0,0\.6\)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, overflowY: 'auto', padding: '2rem' }}>/g;
const newsReplace = `{showAddNewsModal && (
          <div onClick={() => { setShowAddNewsModal(false); window.history.pushState(null, "", window.location.href); }} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, overflowY: 'auto', padding: '2rem' }}>`;

// Photo Modal
const photoRegex = /{showAddPhotoModal && \(\s*<div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba\(0,0,0,0\.6\)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, overflowY: 'auto', padding: '2rem' }}>/g;
const photoReplace = `{showAddPhotoModal && (
          <div onClick={() => { setShowAddPhotoModal(false); window.history.pushState(null, "", window.location.href); }} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, overflowY: 'auto', padding: '2rem' }}>`;

// Account Modal
const accRegex = /{showAddAccountModal && \(\s*<div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba\(0,0,0,0\.6\)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, overflowY: 'auto', padding: '2rem' }}>/g;
const accReplace = `{showAddAccountModal && (
          <div onClick={() => { setShowAddAccountModal(false); window.history.pushState(null, "", window.location.href); }} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, overflowY: 'auto', padding: '2rem' }}>`;

code = code.replace(newsRegex, newsReplace);
code = code.replace(photoRegex, photoReplace);
code = code.replace(accRegex, accReplace);

fs.writeFileSync('src/app/admin/page.tsx', code);
console.log('Fixed other modals');
