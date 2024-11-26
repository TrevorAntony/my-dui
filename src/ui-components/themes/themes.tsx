import flowbiteTheme from "../../flowbite-theme";

export function mergeDeep2<T extends Record<string, any>>(target: T, source: Partial<T>): T {
    for (const key in source) {
      if (typeof source[key] === 'object' && source[key] !== null && key in target) {
        Object.assign(source[key], mergeDeep2(target[key], source[key]));
      }
    }
    return { ...target, ...source };
  }
  
  

  export const verticalTabTheme = mergeDeep2(flowbiteTheme.tabs, {
    base: " flex  w-full h-full",
    tablist: {
      base: "flex flex-col w-[200px] space-y-2  !space-x-0 !flex-nowrap mr-4 ", // Vertical alignment and spacing
      tabitem: {
        base: "flex items-center  space-x-2 w-full text-left px-4 py-3 disabled:text-gray-700 disabled:dark:text-gray-400 disabled:uppercase disabled:border-gray-300 disabled:pt-2 disabled:pb-0", // Tab width and alignment
      },
    },
    tabitemcontainer: {
      base: "flex-grow  w-full overflow-y-auto h-full "
    }
  });

  