/* eslint-disable tailwindcss/no-custom-classname */
import {
  isValidArray,
  type Connection,
  type DataConnectionsResponse,
} from "../resources";

const DataConnectionSelector = ({
  dataConnections,
  selectedConnection,
  handleConnectionClick,
}: {
  dataConnections: DataConnectionsResponse;
  selectedConnection: Connection;
  handleConnectionClick: (connection: Connection) => void;
}) => {
  if (
    !dataConnections ||
    typeof dataConnections !== "object" ||
    Object.keys(dataConnections).length === 0
  ) {
    return <div>No data connections available.</div>;
  }

  const hasConnections = Object.keys(dataConnections).some((key) =>
    isValidArray(dataConnections[key])
  );

  if (!hasConnections) {
    return <div>No data connections available.</div>;
  }
  if (typeof handleConnectionClick !== "function") {
    console.error("handleConnectionClick is not a function");
    return null;
  }

  return (
    <nav className="w-64 border-r border-gray-300 p-4">
      <h3 className="mb-4 text-lg font-semibold">Data Connections</h3>

      {Object.keys(dataConnections).map((key) => (
        <div key={key}>
          <h4 className="mb-2 text-base font-semibold">{`${
            key.charAt(0).toUpperCase() + key.slice(1)
          } Connections`}</h4>
          <ul className="space-y-2">
            {Array.isArray(dataConnections[key]) ? (
              dataConnections[key].map(
                (connection: Connection, index: number) => (
                  <li
                    key={index}
                    className={`dark:hover:bg-highlight-800 cursor-pointer rounded px-3 py-2 hover:bg-gray-100 ${
                      selectedConnection?.id === connection.id
                        ? "bg-highlight-100 dark:bg-highlight-900 text-highlight-700 dark:text-highlight-200 dark:hover:bg-highlight-900 font-semibold"
                        : ""
                    }`}
                  >
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => handleConnectionClick(connection)}
                    >
                      {connection.name ||
                        `${
                          key.charAt(0).toUpperCase() + key.slice(1)
                        } Connection ${index + 1}`}
                    </button>
                  </li>
                )
              )
            ) : (
              <li>No connections available for {key}.</li>
            )}
          </ul>
          <div className="mb-4" /> {/* This empty div adds spacing */}
        </div>
      ))}
    </nav>
  );
};

export default DataConnectionSelector;
