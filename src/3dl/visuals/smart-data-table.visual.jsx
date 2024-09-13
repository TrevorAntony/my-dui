import React, {
  // useEffect,
  useState,
  // useRef,
  useCallback,
  useDeferredValue,
} from "react";
import { MantineReactTable } from "mantine-react-table";
import { useDataContext } from "../utilities/DataSet";
import { useLayout } from "../utilities/Dashboard";
import { Modal, Button } from "flowbite-react";

const SmartDataTable = ({
  container: ContainerComponent,
  header = "Smart Data Table",
  subHeader = header,
  variant = "card",
  children,
  tableMaxHeight = "500px",
  showToolbar,
  ...props
}) => {
  const { data, updaterFunction } = useDataContext();
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
          updaterFunction();
        }
      }
    },
    [updaterFunction],
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

  const columns = Object.keys(deferredData[0]).map((key) => {
    const hasMatchingChild = React.Children.toArray(children).some(
      (child) => React.isValidElement(child) && child.props.columnName === key,
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
      // onGlobalFilterChange={(event) => console.log(event)}
      initialState={{ pagination: { pageSize: 10 } }}
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
      <div className="block w-full items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
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
            <div className="space-y-6">{renderedChild}</div>
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
