const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const regex = /<div className="modal-overlay">\s*<motion\.div\s*initial=\{\{ scale: 0\.95, opacity: 0 \}\}\s*animate=\{\{ scale: 1, opacity: 1 \}\}/;
const replace = `<div className="modal-overlay" onClick={() => { setSelectedPusatData(null); window.history.pushState(null, "", window.location.href); }}>
          <button 
            onClick={(e) => { e.stopPropagation(); setSelectedPusatData(null); window.history.pushState(null, "", window.location.href); }}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: '#ef4444',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '30px',
              fontWeight: 900,
              fontSize: '1rem',
              cursor: 'pointer',
              zIndex: 10002,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ? Tutup
          </button>
          <motion.div 
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}`;

if (code.match(regex)) {
    code = code.replace(regex, replace);
    fs.writeFileSync('src/app/admin/page.tsx', code);
    console.log('Successfully injected absolute close button!');
} else {
    console.log('Regex match failed');
}
