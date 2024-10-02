import React, { useState, useCallback, useDeferredValue } from "react";
import { MantineReactTable } from "mantine-react-table";
import { useLayout } from "../ui-elements/single-layout";
import { useDataContext } from "../context/DataContext";
import { Modal, Button } from "flowbite-react";
import DuftModal from "../../components/duft-modal";

const SmartDataTable = ({
  container: ContainerComponent,
  header = "Smart Data Table",
  subHeader = header,
  variant = "card",
  children,
  tableMaxHeight = "500px",
  showToolbar,
  exportData,
  ...props
}) => {
  const { data, pageUpdater, handleSearchChange } = useDataContext();
  const layout = useLayout();

  // Defer the data update
  const deferredData = useDeferredValue(data);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [renderedChild, setRenderedChild] = useState(null);

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        if (scrollHeight - scrollTop - clientHeight <= 1) {
          pageUpdater();
        }
      }
    },
    [pageUpdater]
  );

  if (
    !deferredData ||
    !Array.isArray(deferredData) ||
    deferredData.length === 0
  ) {
    return <div>No data available</div>;
  }

  const handleCellClick = (key, row) => {
    setSelectedRowData(row);

    const matchingChild = React.Children.toArray(children).find(
      (child) => React.isValidElement(child) && child.props.columnName === key
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

  const columns = Object.keys(deferredData[0]).map((key) => {
    const hasMatchingChild = React.Children.toArray(children).some(
      (child) => React.isValidElement(child) && child.props.columnName === key
    );

    return {
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1),
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

  const content = (
    <MantineReactTable
      columns={columns}
      enableTopToolbar={showToolbar}
      enableBottomToolbar={showToolbar}
      enableStickyHeader
      data={deferredData}
      enableGlobalFilter
      enablePagination={false}
      enableRowSelection
      onGlobalFilterChange={(event) => handleSearchChange?.(event)}
      {...props}
      mantineTableContainerProps={{
        // ref: tableContainerRef,
        sx: { maxHeight: tableMaxHeight },
        onScroll: (event) => fetchMoreOnBottomReached(event.target), //think about how to configure this based on the page size
      }}
    />
  );

  const wrappedContent =
    layout === "single-layout" ? (
      <div className="mt-4">
        {/* "block w-full items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800" */}
        {content}
      </div>
    ) : (
      content
    );

  return (
    <>
      {ContainerComponent && layout !== "single-layout" ? (
        <ContainerComponent
          header={header}
          subHeader={subHeader}
          variant={variant}
          exportData={exportData}
        >
          {wrappedContent}
        </ContainerComponent>
      ) : (
        wrappedContent
      )}
      <DuftModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedRowData?.name || "More info"}
        modalHeight="medium"
        modalWidth="wide"
      >
        {renderedChild}
      </DuftModal>
    </>
  );
};

export default SmartDataTable;
