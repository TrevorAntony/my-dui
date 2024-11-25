import ChartSkeleton from "../../ui-components/chart-skeleton";
import EmptyState from "../ui-elements/empty-state";

// Helper function to recursively render JSON data
const renderJson = (data) => {
  if (Array.isArray(data)) {
    return (
      <ul>
        {data.map((item, index) => (
          <li key={index}>{renderJson(item)}</li>
        ))}
      </ul>
    );
  } else if (typeof data === "object" && data !== null) {
    return (
      <ul>
        {Object.entries(data).map(([key, value], index) => (
          <li key={index}>
            <strong>{key}:</strong> {renderJson(value)}
          </li>
        ))}
      </ul>
    );
  } else {
    return <span>{String(data)}</span>;
  }
};

// JSONVisual component that renders the JSON data
const JSONVisual = ({
  data,
  loading,
}: {
  data: unknown;
  loading?: boolean;
}) => {
  if (loading) {
    return <ChartSkeleton />;
  }
  if (!data) {
    return <EmptyState message="No JSON data available" />;
  }

  return (
    <div
      style={{
        whiteSpace: "pre-wrap",
        padding: "10px",
        border: "1px solid #ccc",
        margin: "10px 0",
      }}
    >
      <h3>JSON Data</h3>
      {renderJson(data)}
    </div>
  );
};

export default JSONVisual;
