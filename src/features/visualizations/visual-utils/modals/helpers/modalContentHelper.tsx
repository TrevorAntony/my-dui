import React from "react";

/**
 * Helper function to render different types of modal content.
 * Handles string, number, array, and object content types.
 * Can be extended easily for new content types.
 */
export const renderModalContent = (
  modalContent: string | number | string[] | number[] | Record<string, unknown>,
): React.ReactNode => {
  if (modalContent === undefined || modalContent === null) return null;

  // Handle number content
  if (typeof modalContent === "number") {
    return <p>{modalContent}</p>;
  }

  // Handle string content
  if (typeof modalContent === "string") {
    return <p>{modalContent}</p>;
  }

  // Handle array content (string[] or number[])
  if (Array.isArray(modalContent)) {
    return (
      <ul className="space-y-4">
        {modalContent.map((item: string | number, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  }

  // Handle object content
  if (typeof modalContent === "object") {
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
