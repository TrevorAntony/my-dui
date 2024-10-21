import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const NavbarSidebarLayout: React.FC = () => {
  return (
    <div className="layout">
      <header>Navbar</header> {/* The navigation bar */}
      <div className="main-content">
        <aside>
          <ul>
            <li>
              <NavLink
                to="/a"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Link A
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/b"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Link B
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/c"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Link C
              </NavLink>
            </li>
          </ul>
        </aside>
        <main>
          <h1 className="text-3xl font-bold underline">Hello world!</h1>
          <Outlet /> {/* Routed content will be injected here */}
        </main>
      </div>
    </div>
  );
};

export default NavbarSidebarLayout;
