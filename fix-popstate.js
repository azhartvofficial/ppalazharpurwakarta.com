const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// 1. Remove old useEffect
const oldEffectSearch = `  // Intercept Browser Back Button
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (!window.confirm("Apakah Anda yakin ingin keluar dari halaman Admin dan kembali ke Beranda?")) {
        window.history.pushState(null, "", window.location.href);
      } else {
        window.location.href = "/";
      }
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);`;

code = code.replace(oldEffectSearch, '');

// 2. Add new ref near top (let's add it before activePriorityModal)
const refSearch = `  const [activePriorityModal, setActivePriorityModal] = useState<"santri" | "pendaftaran" | "azlearn" | null>(null);`;
const refReplace = `  const modalStatesRef = useRef<any>({});
  
  const [activePriorityModal, setActivePriorityModal] = useState<"santri" | "pendaftaran" | "azlearn" | null>(null);`;
code = code.replace(refSearch, refReplace);

// 3. Add new useEffect right before return
const returnSearch = `  return (
    <>
      <Navbar />`;
const returnReplace = `  modalStatesRef.current = {
    showAddPusatDataModal, showAddNewsModal, showAddPhotoModal, showAddAccountModal,
    showMasterPasswordPrompt, activePriorityModal, confirmModal: confirmModal.isOpen,
    promptModal: promptModal.isOpen, alertModal: alertModal.isOpen
  };

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = (e: PopStateEvent) => {
      const ms = modalStatesRef.current;
      
      if (ms.confirmModal) {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        window.history.pushState(null, "", window.location.href);
        return;
      }
      if (ms.promptModal) {
        setPromptModal(prev => ({ ...prev, isOpen: false }));
        window.history.pushState(null, "", window.location.href);
        return;
      }
      if (ms.alertModal) {
        setAlertModal(prev => ({ ...prev, isOpen: false }));
        window.history.pushState(null, "", window.location.href);
        return;
      }
      if (ms.activePriorityModal) {
        setActivePriorityModal(null);
        window.history.pushState(null, "", window.location.href);
        return;
      }
      if (ms.showAddPusatDataModal) {
        setShowAddPusatDataModal(false);
        window.history.pushState(null, "", window.location.href);
        return;
      }
      if (ms.showAddNewsModal) {
        setShowAddNewsModal(false);
        window.history.pushState(null, "", window.location.href);
        return;
      }
      if (ms.showAddPhotoModal) {
        setShowAddPhotoModal(false);
        window.history.pushState(null, "", window.location.href);
        return;
      }
      if (ms.showAddAccountModal) {
        setShowAddAccountModal(false);
        window.history.pushState(null, "", window.location.href);
        return;
      }
      if (ms.showMasterPasswordPrompt) {
        setShowMasterPasswordPrompt(false);
        window.history.pushState(null, "", window.location.href);
        return;
      }

      // Default back button behavior on dashboard
      setConfirmModal({
        isOpen: true,
        title: "Konfirmasi Keluar",
        message: "Apakah Anda yakin ingin keluar dari halaman Admin dan kembali ke Beranda?",
        onConfirm: () => { window.location.href = "/"; },
        confirmText: "Ya, Keluar",
        cancelText: "Batal",
        isDanger: false
      });
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <>
      <Navbar />`;
code = code.replace(returnSearch, returnReplace);

fs.writeFileSync('src/app/admin/page.tsx', code);
console.log('Fixed popstate');
