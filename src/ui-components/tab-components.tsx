import { Tabs } from "flowbite-react";
import { FC, ReactNode } from "react";
import { IconType } from "react-icons";

interface DuftTabChildren {
  children: ReactNode;
}

const DuftTabset: React.FC<DuftTabChildren> = ({ children }) => {
  return (
    <Tabs.Group aria-label="Tabs with underline" style="underline">
      {children}
    </Tabs.Group>
  );
};

interface DuftTabProps {
  active?: boolean;
  title: ReactNode;
  icon: IconType;
  children: ReactNode;
}

const DuftTab: FC<DuftTabProps> = ({
  active = false,
  title,
  icon: Icon,
  children,
}) => {
  return (
    <Tabs.Item active={active} title={title} icon={Icon}>
      {children}
    </Tabs.Item>
  );
};

export { DuftTabset, DuftTab };
