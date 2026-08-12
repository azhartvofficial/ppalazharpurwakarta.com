const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const regex1 = /{showAddPusatDataModal && \(\s*<div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba\(0,0,0,0\.6\)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, overflowY: 'auto', padding: '2rem' }}>/g;
const replace1 = `{showAddPusatDataModal && (
          <div onClick={() => { setShowAddPusatDataModal(false); window.history.pushState(null, "", window.location.href); }} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, overflowY: 'auto', padding: '2rem' }}>`;

const regex2 = /<motion\.div\s*initial={{ opacity: 0, y: 20 }}/g;
const replace2 = `<motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 20 }}`;

if (code.match(regex1) && code.match(regex2)) {
    code = code.replace(regex1, replace1);
    code = code.replace(regex2, replace2);
    fs.writeFileSync('src/app/admin/page.tsx', code);
    console.log('Fixed overlay click via regex');
} else {
    console.log('Regex match failed');
}
