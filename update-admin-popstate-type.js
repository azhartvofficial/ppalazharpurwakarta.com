const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const search = `const handlePopState = (e) => {`;
const replace = `const handlePopState = (e: PopStateEvent) => {`;

if (code.includes(search)) {
  code = code.replace(search, replace);
  fs.writeFileSync('src/app/admin/page.tsx', code);
  console.log('Popstate type fixed');
} else {
  console.log('Search string not found');
}
