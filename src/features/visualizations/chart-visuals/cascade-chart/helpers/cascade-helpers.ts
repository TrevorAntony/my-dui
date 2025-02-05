import type { Cascade, CascadeNodeProps } from "../types/cascade";

export const cleanEmptyChildren = (node: Cascade) => {
  if (!node.children?.length) {
    delete node.children;
  } else {
    node.children.forEach(cleanEmptyChildren);
  }
};

const buildLookupTable = (
  cascadeArray: CascadeNodeProps[]
): Record<string, Cascade> => {
  const lookup: Record<string, Cascade> = {};

  cascadeArray.forEach((item) => {
    lookup[item.id] = {
      id: item.id,
      parentId: item.parentId,
      data: {
        nodeId: item.id,
        label: item.label,
        value: item.data ? item.data[0].value : 0,
        query: item.detailsViewQuery,
      },
      options: {
        nodeBGColorHover: item.options?.nodeBGColorHover || "#b0decb",
        nodeBGColor: item.options?.nodeBGColor || "#eff8f4",
        borderColorHover: item.options?.borderColorHover || "#90c6a4",
      },
      children: [],
    };
  });

  return lookup;
};

const assignChildrenToParents = (
  cascadeArray: CascadeNodeProps[],
  lookup: Record<string, Cascade>
) => {
  let root: Cascade | null = null;

  cascadeArray.forEach((item) => {
    if (item.parentId) {
      lookup[item.parentId]?.children?.push(lookup[item.id]);
    } else {
      root = lookup[item.id];
    }
  });

  return root;
};

export const createCascadeObject = (
  cascadeArray: CascadeNodeProps[],
  cleanEmptyChildren: (node: Cascade) => void
): Cascade | null => {
  const lookup = buildLookupTable(cascadeArray);
  const root = assignChildrenToParents(cascadeArray, lookup);

  if (root) cleanEmptyChildren(root);
  return root;
};
