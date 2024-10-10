import React, { useState } from "react";
import { useDataContext } from "../3dl/context/DataContext";
import { HiOutlineExternalLink } from "react-icons/hi";
import DuftModal from "./duft-modal";
import TileSkeleton from "../ui-components/tile-skeleton";

interface DuftTileProps {
  title: string;
  backgroundColor?: string;
  color?: string;
  children?: React.ReactNode;
  modalWidth?: "narrow" | "medium" | "wide"; // Width options
  modalHeight?: "small" | "medium" | "large"; // Height options
}

const DuftTile: React.FC<DuftTileProps> = ({
  title,
  children,
  modalWidth,
  modalHeight, // Default to medium height
}) => {
  const { data } = useDataContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isValidData =
    data &&
    Array.isArray(data) &&
    data.length > 0 &&
    typeof data[0] === "object";

  if (!isValidData) {
    return <TileSkeleton />;
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

  const iconStyle: React.CSSProperties = {
    position: "absolute",
    top: "8px",
    right: "8px",
    color: "#A9A9A9", // Adjust the icon color as needed
  };

  const tileClasses =
    React.Children.count(children) > 0
      ? "cursor-pointer transition duration-300 ease-in-out hover:bg-gray-100 hover:shadow-lg"
      : "";

  // Format firstValue with comma delimiter for thousands
  const formattedFirstValue =
    typeof firstValue === "number" ? firstValue.toLocaleString() : firstValue;

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        className={`relative flex h-auto flex-col justify-between rounded-lg bg-white p-3 shadow dark:bg-gray-800 sm:p-4 xl:p-5 ${tileClasses}`}
        onClick={handleClick}
        style={{
          cursor: React.Children.count(children) > 0 ? "pointer" : "default",
        }}
      >
        <div
          style={titleStyle}
          className="text-highlight-900 dark:text-highlight-100"
        >
          {title}
        </div>
        <div style={valueContainerStyle}>
          <div style={valueStyle} className="text-black dark:text-white">
            {formattedFirstValue}
          </div>
          <div style={secondaryValueStyle}>{secondValue || ""}</div>
        </div>
        {React.Children.count(children) > 0 && (
          <HiOutlineExternalLink style={iconStyle} size={20} />
        )}
      </div>
      <DuftModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={title}
        modalWidth={modalWidth} // Pass width prop to modal
        modalHeight={modalHeight} // Pass height prop to modal
      >
        {children}
      </DuftModal>
    </>
  );
};

export default DuftTile;
