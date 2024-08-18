import { FC, ReactNode } from "react";
import { Sidebar } from "flowbite-react"; // Adjust according to your imports

type SidebarGroupProps = {
  title?: string;
  children: ReactNode;
};

const SidebarGroup: FC<SidebarGroupProps> = ({ title, children }) => {
  return (
    <Sidebar.ItemGroup>
      {title && (
        <div className="pl-3 pb-2 text-gray-400 uppercase text-[80%]">
          {title}
        </div>
      )}
      {children}
    </Sidebar.ItemGroup>
  );
};

export default SidebarGroup;
