import React, {
  FC,
  ReactNode,
  ReactElement,
  cloneElement,
  isValidElement,
  useState,
} from "react";
import clsx from "clsx";
import iconMap from "../helpers/tab-icons";
import { useDataContext } from "../3dl/context/DataContext";

interface CustomDuftTabProps {
  title: string;
  icon?: string;
  badgeContent?: string;
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

const CustomDuftTab: FC<CustomDuftTabProps> = ({
  title,
  icon,
  badgeContent,
  active = false,
  onClick,
}) => {
  const { data } = useDataContext();
  const Icon = icon ? iconMap[icon] : null;
  console.log("Hello Data: ", data);

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

interface CustomDuftTabSetProps {
  children: ReactNode;
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
}

const CustomDuftTabSet: FC<CustomDuftTabSetProps> = ({
  children,
  defaultTab,
  onTabChange,
}) => {
  const [currentTab, setCurrentTab] = useState(
    defaultTab ||
      React.Children.toArray(children).find(
        (child): child is React.ReactElement<CustomDuftTabProps> =>
          React.isValidElement(child) && child.type === CustomDuftTab
      )?.props.title
  );

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
    if (onTabChange) onTabChange(tabId);
  };

  return (
    <div>
      <div className="flex">
        {React.Children.map(
          children,
          (child: ReactElement<CustomDuftTabProps>) => {
            if (isValidElement(child) && child.type === CustomDuftTab) {
              return cloneElement(child, {
                active: currentTab === child.props.title,
                onClick: () => handleTabClick(child.props.title),
              });
            }
            return child;
          }
        )}
      </div>

      <div className="mt-4">
        {React.Children.map(
          children,
          (child: ReactElement<CustomDuftTabProps>) => {
            if (isValidElement(child) && child.type === CustomDuftTab) {
              return currentTab === child.props.title ? (
                <div>{child.props.children}</div>
              ) : null;
            }
            return null;
          }
        )}
      </div>
    </div>
  );
};

export { CustomDuftTabSet, CustomDuftTab };
