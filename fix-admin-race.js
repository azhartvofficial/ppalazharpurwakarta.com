const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// 1. Remove reset from useEffects
const effectProv = `  useEffect(() => {
    if (addPusatDataProvId) {
      fetch(\`https://emsifa.github.io/api-wilayah-indonesia/api/regencies/\${addPusatDataProvId}.json\`).then(res => res.json()).then(data => {
        setRegencies(data); setAddPusatDataRegId(""); setAddPusatDataRegName(""); setDistricts([]); setAddPusatDataDistId(""); setAddPusatDataDistName("");
      }).catch(() => {});
    } else {
      setRegencies([]); setDistricts([]);
    }
  }, [addPusatDataProvId]);`;

const replaceEffectProv = `  useEffect(() => {
    if (addPusatDataProvId) {
      fetch(\`https://emsifa.github.io/api-wilayah-indonesia/api/regencies/\${addPusatDataProvId}.json\`).then(res => res.json()).then(data => {
        setRegencies(data);
      }).catch(() => {});
    } else {
      setRegencies([]); setDistricts([]);
    }
  }, [addPusatDataProvId]);`;
code = code.replace(effectProv, replaceEffectProv);

const effectReg = `  // Fetch Districts when Regency changes
  useEffect(() => {
    if (addPusatDataRegId) {
      fetch(\`https://emsifa.github.io/api-wilayah-indonesia/api/districts/\${addPusatDataRegId}.json\`).then(res => res.json()).then(data => {
        setDistricts(data); setAddPusatDataDistId(""); setAddPusatDataDistName("");
      }).catch(() => {});
    } else {
      setDistricts([]);
    }
  }, [addPusatDataRegId]);`;

const replaceEffectReg = `  // Fetch Districts when Regency changes
  useEffect(() => {
    if (addPusatDataRegId) {
      fetch(\`https://emsifa.github.io/api-wilayah-indonesia/api/districts/\${addPusatDataRegId}.json\`).then(res => res.json()).then(data => {
        setDistricts(data);
      }).catch(() => {});
    } else {
      setDistricts([]);
    }
  }, [addPusatDataRegId]);`;
code = code.replace(effectReg, replaceEffectReg);

// 2. Add reset to onChanges
const selectProv = `onChange={e => { setAddPusatDataProvId(e.target.value); setAddPusatDataProvName(e.target.options[e.target.selectedIndex].text); }}`;
const replaceSelectProv = `onChange={e => { setAddPusatDataProvId(e.target.value); setAddPusatDataProvName(e.target.options[e.target.selectedIndex].text); setAddPusatDataRegId(""); setAddPusatDataRegName(""); setDistricts([]); setAddPusatDataDistId(""); setAddPusatDataDistName(""); }}`;
code = code.replace(selectProv, replaceSelectProv);

const selectReg = `onChange={e => { setAddPusatDataRegId(e.target.value); setAddPusatDataRegName(e.target.options[e.target.selectedIndex].text); }}`;
const replaceSelectReg = `onChange={e => { setAddPusatDataRegId(e.target.value); setAddPusatDataRegName(e.target.options[e.target.selectedIndex].text); setAddPusatDataDistId(""); setAddPusatDataDistName(""); }}`;
code = code.replace(selectReg, replaceSelectReg);

fs.writeFileSync('src/app/admin/page.tsx', code);
console.log('Fixed address reset race condition');
