const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const regex = /<motion\.div\s*initial={{ opacity: 0, y: 20 }}/g;
const replace = `<motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 20 }}`;

code = code.replace(regex, replace);
fs.writeFileSync('src/app/admin/page.tsx', code);
console.log('Fixed propagation for other modals');
