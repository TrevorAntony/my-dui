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
      <tr
        key={row.id}
        className="border-b bg-white hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
      >
        {headers
          ?.filter((header) => visibleColumns[header])
          .map((header) => {
            const hasMatchingChild = React.Children.toArray(children).some(
              (child) =>
                React.isValidElement(child) && child.props.columnName === header
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
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
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
