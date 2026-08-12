const fs = require('fs');
let lines = fs.readFileSync('src/app/admin/page.tsx', 'utf8').split('\n');
const insertIndex = lines.findIndex((l, i) => l.includes('return (') && i < lines.length - 1 && lines[i + 1].includes('<>'));

if (insertIndex !== -1) {
    const codeToInsert = `  modalStatesRef.current = {
    showAddPusatDataModal, showAddNewsModal, showAddPhotoModal, showAddAccountModal,
    showMasterPasswordPrompt, activePriorityModal, confirmModal: confirmModal.isOpen,
    promptModal: promptModal.isOpen, alertModal: alertModal.isOpen
  };

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = (e) => {
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
`;
    lines.splice(insertIndex, 0, codeToInsert);
    fs.writeFileSync('src/app/admin/page.tsx', lines.join('\n'));
    console.log('Inserted popstate');
} else {
    console.log('Insert index not found');
}
