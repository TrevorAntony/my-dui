import React, { FC, ReactNode, ReactElement } from "react";
import { Tabs } from "flowbite-react";
import iconMap from "./helpers/tab-icons-registry";
import { useDataContext } from "../../../core/context/DataContext";
import useDuftQuery from "../../data-components/hooks/useDuftQuery";
import Dataset from "../../data-components/data-set";

interface DuftTabChildren {
  children: ReactNode;
}

const DuftTabset: React.FC<DuftTabChildren> = ({ children }) => {
  const processedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const { icon, showBadge, title, badgeQuery } =
        child.props as DuftTabProps;
      const isBadgeAvailable = showBadge === "true";
      const ResolvedIcon = icon ? iconMap[icon as string] : undefined;
      const modifiedTitle = isBadgeAvailable ? (
        <Dataset useQuery={useDuftQuery} query={badgeQuery}>
          <Badge title={title as string} />
        </Dataset>
      ) : (
        title
      );
      return React.cloneElement(child as ReactElement<DuftTabProps>, {
        icon: ResolvedIcon,
        title: modifiedTitle,
      });
    }
    return child;
  });

  return (
    <Tabs aria-label="Default tabs" variant="underline">
      {processedChildren}
    </Tabs>
  );
};

interface DuftTabProps {
  title: ReactNode;
  children: ReactNode;
  active?: boolean;
  icon?: string | React.ElementType;
  showBadge?: string;
  badgeQuery?: string;
}

const DuftTab: React.FC<DuftTabProps> = ({ title, children, active }) => {
  return (
    <Tabs.Item active={active} title={title}>
      {children}
    </Tabs.Item>
  );
};

interface BadgeData {
  title?: string;
  value?: number;
}

const Badge: FC<BadgeData> = ({ title }) => {
  const { data } = useDataContext();
  if (!data || data.length === 0) {
    return <span className="text-default text-base">{title}</span>;
  }
  const dataItem = (data as BadgeData[])[0].value;
  return (
    <div className="flex items-center space-x-2">
      <span className="text-default text-base">{title}</span>
      <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-highlight-150 text-default dark:bg-highlight-700">
        {dataItem}
      </span>
    </div>
  );
};

export { DuftTabset, DuftTab };
