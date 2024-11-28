import { useState } from "react";
import DuftModal from "../../components/duft-modal";
import SettingsDisplay from "./duft-settings-components/settings-display";

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
