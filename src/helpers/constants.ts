import type { SidebarConfig } from "../types/side-bar-config";

export const defaultSidebarConfig: SidebarConfig = {
  system: {
    home: {
      title: "Home",
      icon: "home-icon",
      dashboard: "/",
    },
    menu: [],
    dataTasks: [],
  },
  user: {
    menu: [],
  },
};

export const cascadeDefaultOptions = {
  contentKey: "data",
  width: "100%",
  height: "100%",
  nodeWidth: 900,
  nodeHeight: 300,
  childrenSpacing: 200,
  siblingSpacing: 100,
  fontSize: "20px",
  fontWeight: 300,
  fontColor: "black",
  borderWidth: 2,
  borderColorHover: "#b0decb",
  nodeBGColorHover: "#b0decb",
  nodeBGColor: "#eff8f4",
  highlightOnHover: true,
  enableExpandCollapse: false,
  direction: "left",
  enableToolbar: false,
  canvasStyle: {
    background: "white",
  },
  nodeTemplate: (node: Record<string, unknown>) => {
    const { value } = node;
    const formattedValue = Number(value).toLocaleString();
    if (!value) {
      return `
      <div 
      id=${node["id"]}
        style="
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        height: 100%;
        padding-left: 5%;
        cursor: pointer;
      "
      >
        <div style="font-size: 3.5em; line-height: 1.50; font-weight: 700">0</div>
        <div style="font-size: 1.8em;">${node["label"]}</div>
      </div>
    `;
    }

    return `
      <div 
      id=${node["id"]}
        style="
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        height: 100%;
        padding-left: 5%;
        cursor: pointer;
      "
      >
        <div style="font-size: 3.5em; line-height: 1.50; font-weight: 700">${formattedValue}</div>
        <div style="font-size: 1.8em;">${node["label"]}</div>
      </div>
    `;
  },
};
