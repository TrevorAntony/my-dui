import React from 'react';
import { MantineReactTable } from 'mantine-react-table';
import ChartComponent from '../ui-elements/chart-component';

const SmartDataTable = ({ data, header }) => {

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>No data available</div>;
  }

  // Generate columns from data keys
  const columns = Object.keys(data[0]).map((key) => ({
    accessorKey: key,
    header: key.charAt(0).toUpperCase() + key.slice(1),
  }));

  return (
    <ChartComponent header={header}>
      <MantineReactTable
        columns={columns}
        data={data}
        enableSorting
        enableGlobalFilter
        enableColumnResizing
        enablePagination
        enableRowSelection
        initialState={{ pagination: { pageSize: 5 } }}
      />
    </ChartComponent>
  );
};

export default SmartDataTable;
