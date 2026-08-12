const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const regex = /const updatePayload = newStatus === 'Terima' \? { status: newStatus, accepted_at: new Date\(\)\.toISOString\(\) } : { status: newStatus };/g;
const replace = `const updatePayload = (newStatus === 'Terima' || newStatus === 'Approved' || newStatus === 'Aktif') ? { status: newStatus, accepted_at: new Date().toISOString() } : { status: newStatus };`;

if (code.match(regex)) {
    code = code.replace(regex, replace);
    fs.writeFileSync('src/app/admin/page.tsx', code);
    console.log('Fixed updatePayload for accepted_at');
} else {
    console.log('Regex match failed');
}
