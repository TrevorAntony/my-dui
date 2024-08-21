import React from "react";

const DashboardRow = ({ children, data, style = {}, ...props }) => {
  const rowStyle = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap", // Allows wrapping on smaller screens
    alignItems: "flex-start", // Align items at the start
    gap: "1rem",
    backgroundColor: "#FFF", // Light gray background
    borderRadius: "8px", // Rounded corners
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
    padding: "1rem", // Padding inside the row
    margin: "0.25rem 0", // Margin outside the row
    ...style,
  };

  const responsiveStyle = {
    // Default styles for larger screens
    flexBasis: "calc(33.33% - 1rem)", // 3 items per row

    // Media query for medium screens (e.g., tablets)
    "@media (max-width: 768px)": {
      flexBasis: "calc(50% - 1rem)", // 2 items per row
    },

    // Media query for small screens (e.g., mobile)
    "@media (max-width: 480px)": {
      flexBasis: "100%", // 1 item per row
    },
  };

  // Pass down data and responsive styles to each child
  const childrenWithProps = React.Children.map(children, (child) =>
    React.cloneElement(child, { data, style: responsiveStyle })
  );

  return (
    <div style={rowStyle} {...props}>
      {childrenWithProps}
    </div>
  );
};

export default DashboardRow;
