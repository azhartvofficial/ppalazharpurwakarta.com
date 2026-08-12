const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const regex = /\.modal-overlay \{\s*position: fixed;\s*top: 0;\s*left: 0;\s*width: 100vw;\s*height: 100vh;\s*background: rgba\(15, 23, 42, 0\.7\);\s*backdrop-filter: blur\(5px\);\s*display: flex;\s*justify-content: center;\s*align-items: center;/;

const replace = `.modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: center;
          align-items: center; /* keep center for small modals */
          padding: 2rem;`;

if (code.match(regex)) {
    code = code.replace(regex, replace);
    fs.writeFileSync('src/app/admin/page.tsx', code);
    console.log('Fixed CSS padding!');
} else {
    console.log('CSS Regex failed');
}
