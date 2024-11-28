import type { CustomFlowbiteTheme } from "flowbite-react";

export const userDropdownTheme = {
  floating: {
    base: "z-10 w-fit rounded-lg bg-white divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600",
    content: "py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200",
    target: "w-fit dark:text-white",
  },
  content: "py-1",
  item: {
    base: "flex items-center justify-start py-2 px-4 text-sm text-gray-700 cursor-pointer w-full hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white",
    icon: "mr-2 h-4 w-4"
  },
  header: {
    base: "block py-2 px-4 text-sm text-gray-700 dark:text-gray-200",
  },
  divider: {
    base: "my-1 h-px bg-gray-100 dark:bg-gray-600",
  }
};

const flowbiteTheme: CustomFlowbiteTheme = {
  
  badge: {
    root: {
      color: {
        info: "bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-800 group-hover:bg-blue-200 dark:group-hover:bg-blue-300",
        primary:
          "bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-800 group-hover:bg-blue-200 dark:group-hover:bg-blue-300",
      },
      size: {
        xl: "px-3 py-2 text-base rounded-md",
      },
    },
    icon: {
      off: "rounded-full px-2 py-1",
    },
  },

  button: {
    base: "p-0.5",
    color: {
      gray: "text-gray-900 bg-white border border-gray-200 enabled:hover:bg-gray-100 enabled:hover:text-blue-700 focus:ring-blue-700 focus:text-blue-700 dark:bg-transparent dark:text-gray-400 dark:border-gray-600 dark:enabled:hover:text-white dark:enabled:hover:bg-gray-700 focus:ring-2",
      info: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
      primary: "min-w-[7.5rem] flex items-center justify-center text-white bg-highlight-600 enabled:hover:bg-highlight-800 focus:ring-4 focus:outline-none focus:ring-highlight-300 font-medium rounded-lg text-sm text-center dark:bg-highlight-600 dark:hover:bg-blue-700 dark:focus:ring-highlight-900 dark:enabled:hover:bg-highlight-700",
      secondary: "min-w-[7.5rem] flex items-center justify-center ms-3 text-sm font-medium text-gray-800 focus:outline-none bg-gray-50 rounded-lg border border-gray-300 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-600 dark:text-white dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-700",
    },
    inner: {
      base: "flex items-center transition-all duration-200 p-0 ", // Reduced margin
    },
    outline: {
      color: {
        gray: "border border-gray-200 dark:border-gray-500",
      },
    },
    pill: {
      "off": "rounded-lg",
      "on": "rounded-full"
    },
    size: {
      "xs": "px-2 py-1 text-xs",
      "sm": "px-3 py-1.5 text-sm",
      "md": "px-4 py-2 text-sm",
      "lg": "px-5 py-2.5 text-base",
      "xl": "px-6 py-3 text-base"
    }    
  },
  dropdown: {
    floating: {
      base: "z-10 w-fit rounded-xl divide-y divide-gray-100 shadow",
      content: "rounded-xl text-sm text-gray-700 dark:text-gray-200",
      target: "w-fit dark:text-white",
    },
    content: "",
  },
  modal: {

    "root": {
      "base": "fixed inset-x-0 top-0 z-50 h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full",
      "show": {
        "on": "flex bg-gray-900 bg-opacity-50 dark:bg-opacity-80",
        "off": "hidden"
      },
      "sizes": {
        "sm": "max-w-sm",
        "md": "max-w-md",
        "lg": "max-w-lg",
        "xl": "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
        "6xl": "max-w-6xl",
        "7xl": "max-w-7xl"
      },
      "positions": {
        "top-left": "items-start justify-start",
        "top-center": "items-start justify-center",
        "top-right": "items-start justify-end",
        "center-left": "items-center justify-start",
        "center": "items-center justify-center",
        "center-right": "items-center justify-end",
        "bottom-right": "items-end justify-end",
        "bottom-center": "items-end justify-center",
        "bottom-left": "items-end justify-start"
      }
    },
    "content": {
      "base": "relative h-full w-full p-4 md:h-auto",
      "inner": "relative flex max-h-[90dvh] flex-col rounded-lg bg-white shadow dark:bg-gray-700"
    },
    "body": {
      "base": "flex-1 overflow-auto p-6",
      "popup": "pt-0"
    },
    "header": {
      "base": "flex items-start justify-between rounded-t border-b p-5 dark:border-gray-600",
      "popup": "border-b-0 p-2",
      "title": "text-xl font-medium text-gray-900 dark:text-white",
      "close": {
        "base": "ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white",
        "icon": "h-5 w-5"
      }
    },
    "footer": {
      "base": "flex items-center space-x-2 rounded-b border-gray-200 p-6 dark:border-gray-600",
      "popup": "border-t"
    }

  },
  navbar: {
    root: {
      base: "fixed z-30 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"
    },

  },
  sidebar: {
    root: {
      base: "flex fixed top-0 left-0 z-20 flex-col flex-shrink-0 pt-16 h-full duration-75 border-r border-gray-200 lg:flex transition-width dark:border-gray-700 bg-white",
      inner:
        "h-full overflow-y-auto overflow-x-hidden rounded bg-white py-4 px-3 dark:bg-gray-800",
    },
    itemGroup: {
      base: "mt-4 space-y-2 border-t border-gray-200 pt-4 first:mt-0 first:border-t-0 first:pt-0 dark:border-gray-700"
    },
    item: {
      base: "flex items-center justify-center rounded-lg p-2 text-base font-medium text-gray-900 hover:bg-highlight-200 dark:text-white dark:hover:bg-highlight-600",
      active:
        "bg-green-100 dark:bg-green-700 text-base font-medium text-red-900",
      icon: {
        base: "h-6 w-6 flex-shrink-0 text-highlight-500 transition duration-75 group-hover:text-highlight-600 dark:text-highlight-400 dark:group-hover:text-white",
        active: "text-highlight-200 dark:text-gray-100",
      },
    },
    collapse: {
      button:
        "group flex w-full items-center rounded-lg p-2 text-base font-medium text-gray-900 transition duration-75 hover:bg-highlight-200 dark:text-white dark:hover:bg-gray-700",
      icon: {
        base: "h-6 w-6 flex-shrink-0 text-highlight-500 transition duration-75 group-hover:text-highlight-600 dark:text-highlight-400 dark:group-hover:text-white",
        open: {
          off: "text-highlight-800",
          on: "text-highlight-500",
        },
      },
    },
    // icon: {
    //   base: "h-6 w-6 flex-shrink-0 text-highlight-500 transition duration-75 group-hover:text-highlight-600 dark:text-highlight-400 dark:group-hover:text-white",
    //   active: "text-highlight-200 dark:text-gray-100",
    // },
  },
  textarea: {
    base: "block w-full text-sm p-4 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50",
  },
  textInput: {
    field: {
      input: {
        colors: {
          info: "border-blue-500 bg-blue-50 text-blue-900 placeholder-blue-700 focus:border-blue-500 focus:ring-blue-500 dark:border-blue-400 dark:bg-blue-100 dark:focus:border-blue-500 dark:focus:ring-blue-500",
        },
        withIcon: {
          on: "!pl-12",
        },
      },
    },
  },
  toggleSwitch: {
    toggle: {
      checked: {
        color: {
          blue: "bg-blue-700 border-blue-700",
        },
      },
    },
  },
  tabs: {
    base: "flex flex-col",
    tablist: {
      base: "flex text-center",
      variant: {
        default: "flex-wrap border-b border-gray-200 dark:border-gray-700",
        underline:
          "-mb-px flex-wrap border-b border-gray-200 dark:border-gray-700",
        pills:
          "flex-wrap space-x-2 text-sm font-medium text-gray-500 dark:text-gray-400",
        fullWidth:
          "grid w-full grid-flow-col divide-x divide-gray-200 rounded-none text-sm font-medium shadow dark:divide-gray-700 dark:text-gray-400",
      },
      tabitem: {
        base: "flex items-center justify-center rounded-t-lg p-4 font-medium first:ml-0 focus:outline-none focus:ring-0 focus:ring-red-300 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",
        variant: {
          default: {
            base: "rounded-t-lg",
            active: {
              on: "bg-gray-100 text-red-600 dark:bg-gray-800 dark:text-red-500 ",
              off: "text-gray-500 hover:bg-gray-50 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300 ",
            },
          },
          underline: {
            base: "rounded-t-lg",
            active: {
              on: "bg-highlight-50 dark:bg-highlight-950 active rounded-t-lg border-b-2 border-highlight-600 text-highlight-900 dark:text-highlight-100 dark:border-highlight-800 ",
              off: "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300",
            },
          },
          pills: {
            base: "",
            active: {
              on: "rounded-lg text-highlight-900 hover:bg-highlight-300 dark:hover:bg-highlight-600 dark:text-white bg-highlight-200 dark:bg-highlight-900",
              off: "rounded-lg text-highlight-800 hover:bg-highlight-100 dark:hover:bg-highlight-600 dark:text-white ",
            },
          },
          fullWidth: {
            base: "ml-0 flex w-full rounded-none first:ml-0",
            active: {
              on: "active rounded-none bg-gray-100 p-4 text-gray-900 dark:bg-gray-700 dark:text-white",
              off: "rounded-none bg-white hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white",
            },
          },
        },
        icon: "mr-2 h-5 w-5",
      },
    },

    tabpanel: "",
    tabitemcontainer: {
      "base": "flex-grow",
      "variant": {
        "default": "",
        "underline": "",
        "pills": "",
        "fullWidth": ""
      }
    },
  },
};

export default flowbiteTheme;


