import type { NavigationConfig } from "../components/types";

export const modalPixelWidthMap = {
  mini: 400,
  narrow: 600,
  medium: 800,
  wide: 1000,
};

export const modalViewportHeightRatioMap = {
  tiny: 0.08,
  smaller: 0.19,
  small: 0.36,
  medium: 0.6,
  large: 0.8,
};

export const modalSymbolicWidthMap = {
  mini: "sm",
  narrow: "3xl",
  medium: "7xl",
  wide: "full",
};

export const modalViewportHeightMap = {
  tiny: "8vh",
  smaller: "15vh",
  small: "22vh",
  medium: "60vh",
  large: "80vh",
};

export const cascadeScaleMap = {
  standard: "40vh",
  medium: "60vh",
  large: "80vh",
};

export const defaultSidebarConfig: NavigationConfig = {
  system: {
    settings: { appName: "", footer: "" },
    home: {
      title: "",
      icon: "",
      dashboard: "",
    },
    menu: {
      header: "",
      items: [],
    },
    dataTasks: {
      header: "",
      items: [],
    },
  },
  user: {
    menu: {
      header: "",
      items: [],
    },
  },
};

export const defaultCascadeOptions = {
  contentKey: "data",
  width: "100%",
  height: "40vh",
  nodeWidth: 500,
  nodeHeight: 180,
  fontSize: "20px",
  fontWeight: 300,
  fontColor: "black",
  borderWidth: 2,
  borderColorHover: "#b0decb",
  nodeBGColorHover: "#b0decb",
  nodeBGColor: "#eff8f4",
  highlightOnHover: true,
  enableExpandCollapse: false,
  childrenSpacing: 200,
  siblingSpacing: 100,
  direction: "top",
  enableToolbar: false,
  canvasStyle: {
    background: "transparent",
  },
  nodeTemplate: (content: Record<string, unknown>) => {
    const nodeId = content["nodeId"];
    const label = content["label"];
    let value = content["value"];
    const query = content["query"];

    if (typeof value === "number") {
      const formatter = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
      value = formatter.format(value);
    }
    return `
      <div
        data-id="${nodeId}"
        data-label="${label}"
        data-value="${value}"
        data-query="${query}"
        class="apextree-node"
        style="display: flex; flex-direction: column; align-items: flex-start; height: auto; cursor: pointer; padding: 5%; justify-content: space-between; border-radius: 10px;">
        <div style="font-size: 1.5em; color: #333333;">${label}</div>
        <div style="font-size: 2.5em; line-height: 1.50; font-weight: 400;">${value}</div>
      </div>`;
  },
};