import type { FC, ReactNode } from "react";
import { Sidebar } from "flowbite-react";
import { useSidebarContext } from "../context/SidebarContext";

type SidebarGroupProps = {
  title?: string;
  children: ReactNode;
};

const SidebarGroup: FC<SidebarGroupProps> = ({ title, children }) => {
  const { isOpenOnSmallScreens } = useSidebarContext();
  return (
    <Sidebar.ItemGroup>
      {title && !isOpenOnSmallScreens && (
        <div className="pb-2 pl-3 text-[80%] uppercase text-gray-400">
          {title}
        </div>
      )}
      {children}
    </Sidebar.ItemGroup>
  );
};

export default SidebarGroup;
