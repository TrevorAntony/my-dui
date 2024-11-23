import { useState } from "react";
import DuftModal from "../../components/duft-modal";


const AboutDlg = () => {
  const [aboutSettings, setAboutSettings] = useState<boolean>(true);
  return (
    <DuftModal
      isOpen={aboutSettings}
      title="Settings"
      onClose={() => {
        setAboutSettings(false);
        window.location.reload();
      }}
      modalWidth="medium"
      modalHeight="medium"
      resize="false"
    >
      <div>Hello World</div>
    </DuftModal>
  );
};

export default AboutDlg;
