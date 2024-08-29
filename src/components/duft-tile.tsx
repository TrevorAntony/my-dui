import React, { useState } from "react";
import { useDataContext } from "../3dl/utilities/DataContainer";
import { Modal, Button } from "flowbite-react";

interface DuftTileProps {
  title: string;
  backgroundColor?: string;
  color?: string;
  children?: React.ReactNode;
}

const DuftTile: React.FC<DuftTileProps> = ({ title, children }) => {
  const data = useDataContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Defensive checks for data
  const isValidData =
    data &&
    Array.isArray(data) &&
    data.length > 0 &&
    typeof data[0] === "object";

  if (!isValidData) {
    return <div>No valid data available</div>;
  }

  const [firstKey, secondKey] = Object.keys(data[0]);
  const firstValue = data[0][firstKey];
  const secondValue = data[0][secondKey];

  const handleClick = () => {
    if (React.Children.count(children) > 0) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "16px",
    marginBottom: "5px",
  };

  const valueContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const valueStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: "bold",
  };

  const secondaryValueStyle: React.CSSProperties = {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#A9A9A9", // Lighter gray color for secondary value
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        className="flex h-auto cursor-pointer flex-col justify-between rounded-lg bg-white p-3 shadow transition duration-300 ease-in-out hover:bg-gray-100 hover:shadow-lg dark:bg-gray-800 sm:p-4 xl:p-5"
        onClick={handleClick}
      >
        <div
          style={titleStyle}
          className="text-highlight-900 dark:text-highlight-100"
        >
          {title}
        </div>
        <div style={valueContainerStyle}>
          <div style={valueStyle} className="text-black dark:text-white">
            {firstValue}
          </div>
          <div style={secondaryValueStyle}>{secondValue || ""}</div>
        </div>
      </div>
      <Modal show={isModalOpen} onClose={handleCloseModal} size="3xl">
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>{title}</strong>
        </Modal.Header>
        <Modal.Body className="max-h-[700px] overflow-y-auto">
          <div className="space-y-6">{children}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DuftTile;
