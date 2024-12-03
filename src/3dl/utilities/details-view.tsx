import React from "react";

interface DetailsViewProps {
  columnName: string;
  config: { [key: string]: string };
  children: React.ReactNode;
}

type ChildProps = {
  columnName?: string;
  config?: object;
};

const DetailsView: React.FC<DetailsViewProps> = ({
  columnName,
  config,
  children,
}) => {
  const modifiedChildren = React.Children.map(children, (child) =>
    React.isValidElement(child)
      ? React.cloneElement(child as React.ReactElement<ChildProps>, {
          columnName,
          config,
        })
      : child,
  );

  return <>{modifiedChildren}</>;
};

export default DetailsView;
