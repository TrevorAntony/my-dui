/* eslint-disable tailwindcss/no-custom-classname */
import { Button, Tabs, Spinner } from "flowbite-react";
import { HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { Modal } from "flowbite-react";
import flowbiteTheme from "../../flowbite-theme";
import { useAppState } from "../../context/AppStateContext";
import { useLogFile } from "../../hooks/useLogFile";

interface DuftHeaderProps {
  version?: string;
}

const DuftHeader: React.FC<DuftHeaderProps> = ({
  version = "1.0",
}: {
  version: string;
}) => {
  const {
    state: { config },
  } = useAppState();
  return (
    <div className="text-default bg-highlight-100 dark:bg-highlight-900 mb-4 flex w-full items-start justify-between rounded-lg p-4">
      <div>
        <div>
          <h3 className="text-highlight-800 dark:text-highlight-200 pb-1 text-2xl font-semibold">
            DUFT Version {config?.version || version}
          </h3>
          Proudly developed in Kenya, Uganda, Tanzania, and Namibia <br />
          Institute for Global Health Sciences <br />
          University of California, San Francisco
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <img
          src="/public/images/DUFT.png"
          alt="DUFT Logo"
          className="pt-3"
          style={{ height: "55px" }}
        />
        <img
          src="/public/images/UCSF_sig_black_RGB.png"
          alt="UCSF Logo"
          className="pt-3 dark:hidden"
          style={{ height: "55px" }}
        />
        <img
          src="/public/images/UCSF_sig_white_RGB.png"
          alt="UCSF Logo"
          className="hidden pt-3 dark:block"
          style={{ height: "55px" }}
        />
      </div>
    </div>
  );
};

const ExtensionHeader: React.FC = () => {
  const {
    state: { config },
  } = useAppState();

  return (
    <div className="text-default bg-highlight-100 dark:bg-highlight-900 mb-4 flex w-full items-start justify-between rounded-lg p-4">
      <div>
        <div>
          <h3 className="text-highlight-800 dark:text-highlight-200 pb-1 text-2xl font-semibold">
            {config?.settings?.appName}
          </h3>
          Developed by <br />
          {config?.settings?.credits?.department} <br />
          {config?.settings?.credits?.organisaton}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <img
          src="/public/images/DUFT.png"
          alt="DUFT Logo"
          className="pt-3"
          style={{ height: "55px" }}
        />
        <img
          src={`${config?.serverBaseURL}/config/nalogo.jpeg`}
          alt="UCSF Logo"
          className="pt-3 dark:hidden"
          style={{ height: "55px" }}
        />
        <img
          src={`${config?.serverBaseURL}/config/nalogo.jpeg`}
          alt="UCSF Logo"
          className="hidden pt-3 dark:block"
          style={{ height: "55px" }}
        />
      </div>
    </div>
  );
};

function mergeDeep2<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  for (const key in source) {
    if (
      typeof source[key] === "object" &&
      source[key] !== null &&
      key in target
    ) {
      Object.assign(
        source[key] as Record<string, unknown>,
        mergeDeep2(
          target[key] as Record<string, unknown>,
          source[key] as Record<string, unknown>
        )
      );
    }
  }
  return { ...target, ...source };
}

const customTheme = mergeDeep2(flowbiteTheme.tabs, {
  base: " flex  w-full h-full",
  tablist: {
    base: "flex flex-col w-[200px] space-y-2  !space-x-0 !flex-nowrap mr-4 ", // Vertical alignment and spacing
    tabitem: {
      base: "flex items-center  space-x-2 w-full text-left px-4 py-3 disabled:text-gray-700 disabled:dark:text-gray-400 disabled:uppercase disabled:border-gray-300 disabled:pt-2 disabled:pb-0", // Tab width and alignment
    },
  },
  tabitemcontainer: {
    base: "flex-grow  w-full overflow-y-auto h-full ",
  },
});

const AboutDlg = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const {
    state: { config },
  } = useAppState();

  const { logs, loading, error } = useLogFile(isOpen);

  return (
    <Modal show={isOpen} onClose={() => onClose()} position="center" size="6xl">
      <Modal.Header>About DUFT</Modal.Header>
      <Modal.Body className="flex flex-col overflow-hidden ">
        <div className="flex h-[400px] flex-col overflow-hidden">
          <Tabs aria-label="Default tabs" variant="pills" theme={customTheme}>
            <Tabs.Item active title="About DUFT" icon={MdDashboard}>
              <DuftHeader />
              <div className="text-default pt-2">
                <h3 className="pb-4 text-xl font-semibold">About DUFT</h3>
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p>DUFT Platform Version {config?.version}</p>
                    <p>Python Path: {config?.pythonPath}</p>
                    <p>Python Version: {config?.pythonVersion}</p>
                    <p>Server: {config?.serverBaseURL}</p>

                    <p className="pt-4">Backed by Django/Python</p>
                    <p>Powered by ReactJS / Tailwind / Flowbite</p>
                    <p>Built on Macs</p>
                  </div>
                </div>
              </div>
            </Tabs.Item>
            <Tabs.Item title="Hall of Fame" icon={HiUserCircle}>
              <div className="w-full">
                <DuftHeader />
                <div className="text-default pt-2">
                  <h3 className="text-xl font-semibold">Credits</h3>
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                      <h4 className="mb-3 text-base font-semibold">
                        Product Owner
                      </h4>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        <p>Fitti Weissglas</p>
                      </div>
                      <h4 className="mb-3 mt-6 text-base font-semibold">
                        Country Product Owners
                      </h4>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        <p>Rosaline Hendricks</p>
                        <p>Beatrice Octavian</p>
                        <p>Ian Manyama</p>
                      </div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                      <h4 className="mb-3 text-base font-semibold">
                        Backend Team
                      </h4>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        <p>Fitti Weissglas</p>
                        <p>Erick Mwailunga</p>
                      </div>
                      <h4 className="mb-3 mt-6 text-base font-semibold">
                        Frontend Team
                      </h4>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        <p>Jamie Arodi</p>
                        <p>Goodluck Mlungusye</p>
                        <p>Herobiam Heita</p>
                        <p>Trevor Omondi</p>
                        <p>Fitti Weissglas</p>
                      </div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                      <h4 className="mb-3 text-base font-semibold">3DL Team</h4>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        <p>Bernard Siele</p>
                        <p>Davidson Gikandi</p>
                      </div>
                      <h4 className="mb-3 mt-6 text-base font-semibold">
                        Implementation Team
                      </h4>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        <p>Asen Mwandemele</p>
                        <p>Praise Zimunya</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Tabs.Item>

            <Tabs.Item title="Extensions" disabled={true}></Tabs.Item>
            <Tabs.Item title={config?.settings?.name} icon={MdDashboard}>
              <div className="w-full">
                <ExtensionHeader />
                <div className="text-default pt-2">
                  <h3 className="text-xl font-semibold">Credits</h3>
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                      <h4 className="mb-3 text-base font-semibold">
                        Product Owners
                      </h4>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {config?.settings?.credits?.productOwners?.map(
                          (owner, index) => <p key={index}>{owner}</p>
                        )}
                      </div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                      <h4 className="mb-3 text-base font-semibold">
                        Development Team
                      </h4>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {config?.settings?.credits?.developers?.map(
                          (developer, index) => <p key={index}>{developer}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <h3 className="py-4 text-xl font-semibold">
                    About Quantum Extension
                  </h3>
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <p>
                        {config?.settings?.name} Version{" "}
                        {config?.settings?.version}
                      </p>
                      <p>Repository: {config?.settings.repository}</p>
                    </div>
                  </div>
                  <h3 className="py-4 text-xl font-semibold">
                    Additional Information
                  </h3>
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      An additional line of information can go here.
                    </div>
                  </div>
                </div>
              </div>
            </Tabs.Item>
            <Tabs.Item title="System" disabled={true}></Tabs.Item>
            <Tabs.Item title="Log File" icon={MdDashboard}>
              <div className="text-default mb-4 p-4">
                <div>
                  <h3 className="text-highlight-800 dark:text-highlight-200 pb-1 text-2xl font-semibold">
                    Log File
                  </h3>
                  <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    {loading ? (
                      <div className="flex justify-center p-4">
                        <Spinner size="lg" />
                      </div>
                    ) : error ? (
                      <div className="text-red-500">{error}</div>
                    ) : (
                      <div className="max-h-[300px] overflow-y-auto font-mono text-sm text-gray-600 dark:text-gray-300">
                        {logs.map((log, index) => (
                          <div key={index} className="whitespace-pre-wrap py-1">
                            {log}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Tabs.Item>
          </Tabs>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex w-full justify-end">
          <Button onClick={() => onClose()} color="primary">
            Close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default AboutDlg;
