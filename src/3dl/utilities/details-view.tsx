import React from "react";

interface DetailsViewProps {
  columnName: string;
  config: { [key: string]: string };
  children: React.ReactNode;
}

const DetailsView: React.FC<DetailsViewProps> = ({
  columnName,
  config,
  children,
}) => {
  const modifiedChildren = React.Children.map(children, (child) =>
    React.isValidElement(child)
      ? React.cloneElement(child, {
          columnName,
          config,
        })
      : child
  );

  return <>{modifiedChildren}</>;
};

export default DetailsView;
