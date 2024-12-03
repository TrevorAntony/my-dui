import React, { useRef } from "react";
import { useDataContext } from "../context/DataContext";
import DataTable from "../tables/DataTable";
import PivotTable from "../tables/PivotTable";
import { DuftTab, DuftTabset } from "../../ui-components/tab-components";

interface PreviewQueryProps {
  children?: React.ReactElement<{ query?: string }>;
  container?: React.ElementType;
}

const PreviewQuery: React.FC<PreviewQueryProps> = ({
  children,
  container: Container,
}) => {
  const queryRef = useRef<HTMLTextAreaElement>(null);

  const { query, setQuery } = useDataContext();

  const handleUpdateQuery = () => {
    const queryValue = queryRef.current?.value;
    if (queryValue) {
      setQuery(queryValue);
    }
  };

  const content = (
    <div className="mb-5 flex w-full flex-col items-start overflow-x-auto">
      {/* Query Input Section */}
      <textarea
        ref={queryRef}
        placeholder={query}
        className="mb-3 h-36 w-full resize-none rounded border border-black p-3 text-lg focus:outline-none"
      />
      <button
        onClick={handleUpdateQuery}
        className="self-end rounded bg-pink-600 px-4 py-2 text-sm font-bold text-white hover:bg-pink-700"
      >
        Update Query
      </button>

      <DuftTabset>
        <DuftTab title="Data Table">
          <div className="mt-4 w-full max-w-[1465px] overflow-x-auto">
            <DataTable variant="card" />
          </div>
        </DuftTab>
        <DuftTab title="Pivot Table">
          <div className="mt-4 w-full overflow-x-auto">
            <PivotTable />
          </div>
        </DuftTab>
      </DuftTabset>

      {children}
    </div>
  );

  return Container ? <Container>{content}</Container> : content;
};

export default PreviewQuery;
