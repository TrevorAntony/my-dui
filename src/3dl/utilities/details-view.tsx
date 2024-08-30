import React from "react";

interface DetailsViewProps {
  columnName: string; // this exists here only to be read by its parent
  query: string;
  children: React.ReactNode;
  config: { [key: string]: string };
}

const DetailsView: React.FC<DetailsViewProps> = ({
  columnName,
  query,
  config,
  children,
}) => {
  const processQuery = (query: string, config: { [key: string]: string }) => {
    return query.replace(/\$\{(\w+)\}/g, (match, placeholder) => {
      return config[placeholder] || match;
    });
  };

  const processedQuery = processQuery(query, config);

  // Clone children and add the processedQuery as the `query` prop
  const modifiedChildren = React.Children.map(children, (child) =>
    React.isValidElement(child)
      ? React.cloneElement(child, { query: processedQuery })
      : child
  );

  return <>{modifiedChildren}</>;
};

export default DetailsView;
