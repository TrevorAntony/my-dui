import { Tabs, Badge } from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";

export function BadgedTab() {
  return (
    <Tabs aria-label="Default tabs" variant="underline">
      <Tabs.Item
        active
        title={
          <div className="flex items-center gap-2">
            <span>Profile</span>
            <Badge color="info">50</Badge>
          </div>
        }
        icon={HiUserCircle}
      >
        <span className="font-medium p-4 text-gray-800 dark:text-white">
          Profile tab's associated content
        </span>
      </Tabs.Item>
      <Tabs.Item
        title={
          <div className="flex items-center gap-2">
            <span>Dashboard</span>
            <Badge color="info">10</Badge>
          </div>
        }
        icon={MdDashboard}
      >
        <span className="font-medium p-4 text-gray-800 dark:text-white">
          Dashboard tab's associated content
        </span>
      </Tabs.Item>
      <Tabs.Item
        title={
          <div className="flex items-center gap-2">
            <span>Settings</span>
            <Badge color="info">5</Badge>
          </div>
        }
        icon={HiAdjustments}
      >
        <span className="font-medium p-4 text-gray-800 dark:text-white">
          Settings tab's associated content
        </span>
      </Tabs.Item>
      <Tabs.Item
        title={
          <div className="flex items-center gap-2">
            <span>Contacts</span>
            <Badge color="info">20</Badge>
          </div>
        }
        icon={HiClipboardList}
      >
        <span className="font-medium p-4 text-gray-800 dark:text-white">
          Contacts tab's associated content
        </span>
      </Tabs.Item>
    </Tabs>
  );
}
