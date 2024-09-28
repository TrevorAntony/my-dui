import React from "react";

interface TableBodyProps {
  data: any[];
  headers: string[];
  visibleColumns: Record<string, boolean>;
  handleCellClick: (key: string, row: any) => void;
  children: React.ReactNode;
}

const TableBody: React.FC<TableBodyProps> = ({
  data,
  headers,
  visibleColumns,
  handleCellClick,
  children,
}) => (
  <tbody>
    {data?.map((row) => (
      <tr key={row.id}>
        {headers
          ?.filter((header) => visibleColumns[header])
          .map((header) => {
            const hasMatchingChild = React.Children.toArray(children).some(
              (child) =>
                React.isValidElement(child) && child.props.columnName === header
            );
            return (
              <td
                key={`${row.id}-${header}`}
                className="border-b border-gray-300 p-4"
                onClick={
                  hasMatchingChild
                    ? () => handleCellClick(header, row)
                    : undefined
                }
                style={{
                  cursor: hasMatchingChild ? "pointer" : "default",
                  textDecoration: hasMatchingChild ? "underline" : "none",
                }}
              >
                {row[header]}
              </td>
            );
          })}
      </tr>
    ))}
  </tbody>
);

export default TableBody;
