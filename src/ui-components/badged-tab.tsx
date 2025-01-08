import React, { FC, ReactNode, ReactElement, cloneElement, isValidElement , useState} from 'react';
import clsx from "clsx";
import { Tabs, Badge } from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
// import { MdDashboard } from "react-icons/md";
// import { DuftTabset } from "./tab-components";
import type { IconType } from "react-icons";

interface BadgedDuftTabProps {
  active?: boolean;
  title: string;
  badgeContent?: string | number;
  icon?: IconType;
  children: ReactNode;
}

export const BadgedDuftTab: FC<BadgedDuftTabProps> = ({
  active = false,
  title,
  badgeContent,
  icon: Icon,
  children,
}) => {
  return (
    <Tabs.Item
      active={active}
      title={
        <div className="flex items-center gap-2">
          <span>{title}</span>
          {badgeContent && <Badge color="info">{badgeContent}</Badge>}
        </div>
      }
      icon={Icon}
    >
      {children}
    </Tabs.Item>
  );
};

// sample usage

{
  /* <BadgedDuftTab active title="Profile" badgeContent="50" icon={HiUserCircle}>
  <span className="font-medium p-4 text-gray-800 dark:text-white">
    Profile tab's associated content
  </span>
</BadgedDuftTab> */
}


// export const BadgedTab: FC = () => {
//   return (
//     <DuftTabset>
//       <Tabs.Item
//         active
//         title={
//           <div className="flex items-center gap-2">
//             <span>Profile</span>
//             <Badge color="info">50</Badge>
//           </div>
//         }
//         icon={HiUserCircle}
//       >
//         <span className="font-medium p-4 text-gray-800 dark:text-white">
//           Profile tab's associated content
//         </span>
//       </Tabs.Item>

//       <Tabs.Item
//         title={
//           <div className="flex items-center gap-2">
//             <span>Dashboard</span>
//             <Badge color="info">10</Badge>
//           </div>
//         }
//         icon={MdDashboard}
//       >
//         <span className="font-medium p-4 text-gray-800 dark:text-white">
//           Dashboard tab's associated content
//         </span>
//       </Tabs.Item>

//       <Tabs.Item
//         title={
//           <div className="flex items-center gap-2">
//             <span>Settings</span>
//             <Badge color="info">5</Badge>
//           </div>
//         }
//         icon={HiAdjustments}
//       >
//         <span className="font-medium p-4 text-gray-800 dark:text-white">
//           Settings tab's associated content
//         </span>
//       </Tabs.Item>

//       <Tabs.Item
//         title={
//           <div className="flex items-center gap-2">
//             <span>Contacts</span>
//             <Badge color="info">20</Badge>
//           </div>
//         }
//         icon={HiClipboardList}
//       >
//         <span className="font-medium p-4 text-gray-800 dark:text-white">
//           Contacts tab's associated content
//         </span>
//       </Tabs.Item>
//     </DuftTabset>
//   );
// };



interface CustomTabProps {
  title: string;
  icon?: IconType;
  badgeContent?: string | number;
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

const CustomTab: FC<CustomTabProps> = ({
  title,
  icon: Icon,
  badgeContent,
  active = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center gap-2 px-4 py-2 text-base font-medium focus:outline-none",
        active
          ? "bg-highlight-50 dark:bg-highlight-950 active rounded-t-lg border-b-2 border-highlight-600 text-highlight-900 dark:text-highlight-100 dark:border-highlight-800"
          : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
      )}
    >
      {Icon && <Icon className="w-6 h-6" />}
      <span className="text-base">{title}</span>
      {badgeContent && (
        <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-highlight-150 text-default dark:bg-highlight-700">
          {badgeContent}
        </span>
      )}
    </button>
  );
};

interface CustomTabSetProps {
  children: ReactNode;
  activeTabId?: string | number;
  onTabChange?: (tabId: string | number) => void;
}

export const CustomTabSet: FC<CustomTabSetProps> = ({
  children,
  activeTabId,
  onTabChange,
}) => {
  // If no activeTabId is provided, default to the first tab
  const [currentTab, setCurrentTab] = useState(activeTabId || React.Children.toArray(children)[0]?.props.title);

  const handleTabClick = (tabId: string | number) => {
    setCurrentTab(tabId);
    if (onTabChange) onTabChange(tabId);
  };

  return (
    <div>
      {/* Tab buttons rendering */}
      <div className="flex">
        {React.Children.map(children, (child: ReactElement<CustomTabProps>) => {
          if (isValidElement(child) && child.type === CustomTab) {
            return cloneElement(child, {
              active: currentTab === child.props.title,
              onClick: () => handleTabClick(child.props.title),
            });
          }
          return child;  // If it's not a CustomTab, return the child as is
        })}
      </div>

      {/* Tab content rendering below */}
      <div className="mt-4">
        {React.Children.map(children, (child: ReactElement<CustomTabProps>) => {
          if (isValidElement(child) && child.type === CustomTab) {
            return currentTab === child.props.title ? (
              <div>{child.props.children}</div>
            ) : null;
          }
          return null;  // Return nothing for non- CustomTab elements
        })}
      </div>
    </div>
  );
};

export const BadgedTab: FC = () => {
  return (
    <CustomTabSet activeTabId="profile" onTabChange={() => {}}>
      <CustomTab title="Profile" icon={HiUserCircle} badgeContent={50}>
        <p className="font-medium text-gray-800 dark:text-white">
          Profile tab's associated content.
        </p>
      </CustomTab>

      <CustomTab title="Settings" icon={HiAdjustments} badgeContent={5}>
        <p className="font-medium text-gray-800 dark:text-white">
          Settings tab's associated content.
        </p>
      </CustomTab>

      <CustomTab title="Contacts" icon={HiClipboardList} badgeContent={20}>
        <p className="font-medium text-gray-800 dark:text-white">
          Contacts tab's associated content.
        </p>
      </CustomTab>
    </CustomTabSet>
  );
}; 




// interface CustomTabProps {
//   title: string;
//   icon?: IconType;
//   badgeContent?: string | number;
//   active?: boolean;
//   onClick?: () => void;
// }

// const CustomTab: FC<CustomTabProps> = ({
//   title,
//   icon: Icon,
//   badgeContent,
//   active = false,
//   onClick,
// }) => {
//   return (
//     <button
//       onClick={onClick}
//       className={clsx(
//         "flex items-center gap-2 px-4 py-2 text-base font-medium focus:outline-none", 
//         active
//           ? "bg-highlight-50 dark:bg-highlight-950 active rounded-t-lg border-b-2 border-highlight-600 text-highlight-900 dark:text-highlight-100 dark:border-highlight-800"
//           : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
//       )}
//     >
//       {Icon && <Icon className="w-6 h-6" />}
//       <span className="text-base">{title}</span> 
//       {badgeContent && (
//         <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-highlight-150 text-default dark:bg-highlight-700">
//           {badgeContent}
//         </span>
//       )}
//     </button>
//   );
// };
// interface TabContentProps {
//   tabId: string | number;
//   children: ReactNode;
// }

// const TabContent: FC<TabContentProps> = ({ tabId, children }) => {
//   return <div data-tab-id={tabId}>{children}</div>;
// };

// interface CustomTabSetProps {
//   tabs: {
//     id: string | number;
//     title: string;
//     icon?: IconType;
//     badgeContent?: string | number;
//   }[];
//   activeTabId?: string | number;
//   onTabChange?: (tabId: string | number) => void;
//   children: ReactNode;
// }

// export const CustomTabSet: FC<CustomTabSetProps> = ({
//   tabs,
//   activeTabId,
//   onTabChange,
//   children,
// }) => {
//   const [currentTab, setCurrentTab] = useState(activeTabId || tabs[0]?.id);

//   const handleTabClick = (tabId: string | number) => {
//     setCurrentTab(tabId);
//     if (onTabChange) onTabChange(tabId);
//   };

//   const activeContent = React.Children.toArray(children).find(
//     (child: any) => child.props.tabId === currentTab
//   );

//   return (
//     <div>
//       <div className="flex">
//         {tabs.map((tab) => (
//           <CustomTab
//             key={tab.id}
//             title={tab.title}
//             icon={tab.icon}
//             badgeContent={tab.badgeContent}
//             active={currentTab === tab.id}
//             onClick={() => handleTabClick(tab.id)}
//           />
//         ))}
//       </div>
//       <div>{activeContent}</div>
//     </div>
//   );
// };

// export const BadgedTab: FC = () => {
//   const tabs = [
//     { id: "profile", title: "Profile", icon: HiUserCircle, badgeContent: "50" },
//     { id: "settings", title: "Settings", icon: HiAdjustments, badgeContent: "5" },
//     { id: "contacts", title: "Contacts", icon: HiClipboardList, badgeContent: "20" },
//   ];

//   return (
//     <CustomTabSet
//       tabs={tabs}
//       activeTabId="profile"
//       onTabChange={() => {}}
//     >
//       <TabContent tabId="profile">
//         <p className="font-medium p-4 text-gray-800 dark:text-white">
//           Profile tab's associated content.
//         </p>
//       </TabContent>
//       <TabContent tabId="settings">
//         <p className="font-medium p-4 text-gray-800 dark:text-white">
//           Settings tab's associated content.
//         </p>
//       </TabContent>
//       <TabContent tabId="contacts">
//         <p className="font-medium p-4 text-gray-800 dark:text-white">
//           Contacts tab's associated content.
//         </p>
//       </TabContent>
//     </CustomTabSet>
//   );
// };

