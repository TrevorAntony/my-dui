import { Tabs } from "flowbite-react";
import type { FC, ReactNode } from "react";
import type { IconType } from "react-icons";

interface DuftTabChildren {
  children: ReactNode;
}

const DuftTabset: React.FC<DuftTabChildren> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="w-full">
      <Tabs aria-label="Tabs with underline" variant="underline">
        {children}
      </Tabs>
    </div>
  );
};

interface DuftTabProps {
  active?: boolean;
  title: ReactNode;
  icon?: IconType;
  children: ReactNode;
}

const DuftTab: FC<DuftTabProps> = ({
  active = false,
  title,
  icon: Icon,
  children,
}) => {
  return (
    <div className="w-full">
      <Tabs.Item active={active} title={title} icon={Icon}>
        {children}
      </Tabs.Item>
    </div>
  );
};

export { DuftTabset, DuftTab };
