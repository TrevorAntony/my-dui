import { Tabs } from "flowbite-react";
import { HiUserCircle, HiAdjustments, HiClipboardList } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import {
  DuftGrid,
  DuftGridFullRow,
  DuftGridHeader,
} from "../ui-components/grid-components";

const TabLayoutTester: React.FC = () => {
  return (
    <>
      <TabSample />
      <DuftGrid>
        <DuftGridFullRow>
          <DuftGridHeader>Tabs</DuftGridHeader>
        </DuftGridFullRow>
        <div className="text-highlight">
          This text will use the highlight color
        </div>
        <div className="w-full"></div>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"></div>
      </DuftGrid>
    </>
  );
};

const TabSample: React.FC = function () {
  return (
    <div>
      <Tabs aria-label="Tabs with underline">
        <Tabs.Item active title="Profile" icon={HiUserCircle}>
          This is{" "}
          <span className="font-medium text-gray-800 dark:text-white">
            Profile tab's associated content
          </span>
          . Clicking another tab will toggle the visibility of this one for the
          next. The tab JavaScript swaps classes to control the content
          visibility and styling.
        </Tabs.Item>
        <Tabs.Item title="Dashboard" icon={MdDashboard}>
          This is{" "}
          <span className="font-medium text-gray-800 dark:text-white">
            Dashboard tab's associated content
          </span>
          . Clicking another tab will toggle the visibility of this one for the
          next. The tab JavaScript swaps classes to control the content
          visibility and styling.
        </Tabs.Item>
        <Tabs.Item
          title={
            <div className="flex items-center space-x-2">
              <span>Settings</span>
              <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                5
              </span>
            </div>
          }
          icon={HiAdjustments}
        >
          This is{" "}
          <span className="font-medium text-gray-800 dark:text-white">
            Settings tab's associated content
          </span>
          . Clicking another tab will toggle the visibility of this one for the
          next. The tab JavaScript swaps classes to control the content
          visibility and styling.
        </Tabs.Item>
        <Tabs.Item title="Contacts" icon={HiClipboardList}>
          This is{" "}
          <span className="font-medium text-gray-800 dark:text-white">
            Contacts tab's associated content
          </span>
          . Clicking another tab will toggle the visibility of this one for the
          next. The tab JavaScript swaps classes to control the content
          visibility and styling.
        </Tabs.Item>
        <Tabs.Item disabled title="Disabled">
          Disabled content
        </Tabs.Item>
      </Tabs>
    </div>
  );
};

export default TabLayoutTester;
