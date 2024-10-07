import { DuftGridHeader } from "../ui-components/grid-components";
import { useDataContext } from "../3dl/context/DataContext";

const DashboardMeta = () => {
  const { data } = useDataContext();

  const renderTextWithPlaceholders = (text: string) => {
    // Regular expression to find placeholders in the format %propertyName%
    const placeholderRegex = /%(\w+)%/g;

    // Replace each placeholder with the corresponding data value or a default value
    return text.replace(placeholderRegex, (match, propertyName) => {
      return data[propertyName] || "Data not available";
    });
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {typeof data === "object" && data !== null && "header" in data && (
        <DuftGridHeader>
          {renderTextWithPlaceholders(data.header as string)}
        </DuftGridHeader>
      )}
      {typeof data === "object" && data !== null && "subheader" in data && (
        <span style={{ marginLeft: "10px" }}>
          {"Last refresh date: "}
          {renderTextWithPlaceholders(data.subheader as string)}
        </span>
      )}
    </div>
  );
};

export default DashboardMeta;
