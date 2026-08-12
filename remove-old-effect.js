const fs = require('fs');
let lines = fs.readFileSync('src/app/admin/page.tsx', 'utf8').split('\n');

const start = lines.findIndex(l => l.includes('window.addEventListener("popstate", handlePopState);'));
if (start !== -1) {
    // If it's the old one, it's around line 122
    if (start < 500) {
        lines.splice(start - 10, 13);
        fs.writeFileSync('src/app/admin/page.tsx', lines.join('\n'));
        console.log('Old useEffect removed successfully');
    } else {
        console.log('Only new useEffect found');
    }
} else {
    console.log('No popstate listener found');
}
