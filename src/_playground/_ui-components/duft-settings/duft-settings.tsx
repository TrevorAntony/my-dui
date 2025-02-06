import { useState } from "react";
import DuftModal from "../../../features/visualizations/visual-utils/modals/duft-modal";
import SettingsDisplay from "../../../features/app-shell/duft-settings/duft-settings-components/settings-display";

const Settings = () => {
  const [openSettings, setOpenSettings] = useState<boolean>(true);
  return (
    <DuftModal
      isOpen={openSettings}
      title="Settings"
      onClose={() => {
        setOpenSettings(false);
        window.location.reload();
      }}
      modalWidth="medium"
      modalHeight="medium"
      resize="false"
    >
      <SettingsDisplay />
    </DuftModal>
  );
};

export default Settings;
