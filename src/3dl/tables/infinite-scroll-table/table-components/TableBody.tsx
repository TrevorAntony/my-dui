/* eslint-disable @typescript-eslint/no-explicit-any */
//TO:DO replace the explicit anys with table data types once added
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
                React.isValidElement(child) &&
                child.props.columnName === header,
            );

            const formatDate = (value: string) => {
              return new Date(value).toLocaleString();
            };

            const cellValue =
              row.isDate && row.isDate[header]
                ? formatDate(row[header])
                : row[header];

            return (
              <td
                key={`${row.id}-${header}`}
                className="border-b border-gray-300 p-4 dark:text-white"
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
                {cellValue}
              </td>
            );
          })}
      </tr>
    ))}
  </tbody>
);

export default TableBody;
