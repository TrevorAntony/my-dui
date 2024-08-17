import type { FC } from "react";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";

const SamplePage: FC = function () {
  return (
    <NavbarSidebarLayout>
      <div className="px-4 pt-6">
        <div>Sample Page Content</div>
      </div>
    </NavbarSidebarLayout>
  );
};

export default SamplePage;
