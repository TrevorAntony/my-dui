import React, { useState } from "react";
import { MantineReactTable } from "mantine-react-table";
import { useDataContext } from "../utilities/DataContainer";
import { useLayout } from "../utilities/Dashboard";
import { Modal, Button } from "flowbite-react";

const SmartDataTable = ({
  container: ContainerComponent,
  header = "Smart Data Table",
  subHeader = header,
  variant = "card",
  children,
  ...props
}) => {
  const data = useDataContext();
  const layout = useLayout();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [renderedChild, setRenderedChild] = useState(null);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>No data available</div>;
  }

  // Handle clicking on any cell
  const handleCellClick = (key, row) => {
    setSelectedRowData(row);

    // Check if any child has a columnName prop matching the key
    const matchingChild = React.Children.toArray(children).find(
      (child) => React.isValidElement(child) && child.props.columnName === key,
    );

    if (matchingChild) {
      const clonedChild = React.cloneElement(matchingChild, {
        config: row,
      });
      setRenderedChild(clonedChild);
    } else {
      setRenderedChild(null);
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRowData(null);
    setRenderedChild(null);
  };

  // Generate columns from data keys
  const columns = Object.keys(data[0]).map((key) => {
    // Check if any child has a columnName prop matching the key
    const hasMatchingChild = React.Children.toArray(children).some(
      (child) => React.isValidElement(child) && child.props.columnName === key,
    );

    return {
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1),
      // Conditional rendering for each column cell
      Cell: ({ cell }) =>
        hasMatchingChild ? (
          <button
            className="text-blue-500 underline"
            onClick={() => handleCellClick(key, cell.row.original)}
          >
            {cell.getValue()}
          </button>
        ) : (
          <span>{cell.getValue()}</span>
        ),
    };
  });

  // Content to be rendered inside the ChartComponent
  const content = (
    <div
      style={{
        height: "auto",
        overflow: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        width: layout === "single-layout" ? "100%" : "auto",
      }}
    >
      <MantineReactTable
        columns={columns}
        enableStickyHeader
        data={data}
        enableGlobalFilter
        enablePagination={false}
        enableRowSelection
        initialState={{ pagination: { pageSize: 10 } }}
        {...props}
      />
    </div>
  );

  // Wrap the content based on the variant and layout
  const wrappedContent =
    layout === "single-layout" ? (
      <div className="block w-full items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        {content}
      </div>
    ) : (
      content
    );

  // Conditionally wrap the ChartComponent in ContainerComponent if provided
  return (
    <>
      {ContainerComponent && layout !== "single-layout" ? (
        <ContainerComponent
          header={header}
          subHeader={subHeader}
          variant={variant}
        >
          {wrappedContent}
        </ContainerComponent>
      ) : (
        wrappedContent
      )}

      {isModalOpen && selectedRowData && (
        <Modal show={isModalOpen} onClose={handleCloseModal} size="3xl">
          <Modal.Header>
            <strong>{selectedRowData.name || "More info"}</strong>
          </Modal.Header>
          <Modal.Body className="max-h-[700px] overflow-y-auto">
            <div className="space-y-6">
              {/* Render the matched child component at the bottom of the modal */}
              {renderedChild}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button color="primary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default SmartDataTable;
