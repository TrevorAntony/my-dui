import { useState } from "react";
import DuftModal from "../../components/duft-modal";
import SettingsDisplay from "./settings-display";

const Settings = () => {
  const [openSettings, setOpenSettings] = useState<boolean>(true);
  return (
    <DuftModal
      isOpen={openSettings}
      title="Settings"
      onClose={() => {
        setOpenSettings(false);
        window.location.href = "/";
      }}
      modalWidth="medium"
      modalHeight="medium"
    >
      <SettingsDisplay />
    </DuftModal>
  );
};

export default Settings;
