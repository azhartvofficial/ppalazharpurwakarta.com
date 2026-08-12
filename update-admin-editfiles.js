const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const searchState = `  const [isEditingPusatData, setIsEditingPusatData] = useState(false);
  const [editPusatDataId, setEditPusatDataId] = useState<string | null>(null);`;
const replaceState = `  const [isEditingPusatData, setIsEditingPusatData] = useState(false);
  const [editPusatDataId, setEditPusatDataId] = useState<string | null>(null);
  const [addPusatDataExistingFiles, setAddPusatDataExistingFiles] = useState({
    pas_foto: "", kk_url: "", akte_url: "", ijazah_url: "", sktm_url: ""
  });`;
code = code.replace(searchState, replaceState);

const searchHandleEdit = `    setEditPusatDataId(data.id);
    setAddPusatDataForm({`;
const replaceHandleEdit = `    setEditPusatDataId(data.id);
    setAddPusatDataExistingFiles({
      pas_foto: data.pas_foto || "",
      kk_url: data.kk_url || "",
      akte_url: data.akte_url || "",
      ijazah_url: data.ijazah_url || "",
      sktm_url: data.sktm_url || ""
    });
    setAddPusatDataForm({`;
code = code.replace(searchHandleEdit, replaceHandleEdit);

const searchReset = `                                setEditPusatDataId(null);
                                setAddPusatDataForm({`;
const replaceReset = `                                setEditPusatDataId(null);
                                setAddPusatDataExistingFiles({ pas_foto: "", kk_url: "", akte_url: "", ijazah_url: "", sktm_url: "" });
                                setAddPusatDataForm({`;
code = code.replace(searchReset, replaceReset);

fs.writeFileSync('src/app/admin/page.tsx', code);
console.log('Admin edit files state updated');
