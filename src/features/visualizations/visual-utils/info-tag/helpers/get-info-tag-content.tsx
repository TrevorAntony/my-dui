import React from "react";
import InfoTag from "../info-tag";
const getInfoTagContents = (children) => {
  return React.Children.toArray(children).filter((child) => {
    // Ensure it's a valid React element
    if (!React.isValidElement(child)) {
      return false;
    }
    // Check if the child is an InfoTag component
    return child.type === InfoTag;
  });
};

export default getInfoTagContents;
