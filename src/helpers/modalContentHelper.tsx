import React from "react";

/**
 * Helper function to render different types of modal content.
 * Handles string, array, and object content types.
 * Can be extended easily for new content types.
 */
export const renderModalContent = (
  modalContent: string | string[] | Record<string, any>
): React.ReactNode => {
  if (!modalContent) return null;

  // Handle string content
  if (typeof modalContent === "string") {
    return <p>{modalContent}</p>;
  }

  // Handle array content
  if (Array.isArray(modalContent)) {
    return (
      <ul className="space-y-4">
        {modalContent.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  }

  // Handle object content
  if (typeof modalContent === "object" && modalContent !== null) {
    return (
      <ul className="space-y-4">
        {Object.entries(modalContent).map(([key, value], index) => (
          <li key={index}>
            <strong>{key}:</strong> {JSON.stringify(value)}
          </li>
        ))}
      </ul>
    );
  }

  // Default return in case no condition matches
  return null;
};
