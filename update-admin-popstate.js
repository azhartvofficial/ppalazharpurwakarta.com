const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const search = `  // Master Password State`;
const replace = `  // Intercept Browser Back Button
  useEffect(() => {
    const handlePopState = (e) => {
      if (!window.confirm("Apakah Anda yakin ingin keluar dari halaman Admin dan kembali ke Beranda?")) {
        window.history.pushState(null, "", window.location.href);
      } else {
        window.location.href = "/";
      }
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Master Password State`;

if (code.includes(search)) {
  code = code.replace(search, replace);
  fs.writeFileSync('src/app/admin/page.tsx', code);
  console.log('Popstate added');
} else {
  console.log('Search string not found');
}
