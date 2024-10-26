import type { Connection, DataConnectionsResponse } from "../resources";

const DataConnectionSelector = ({
  dataConnections,
  selectedConnection,
  handleConnectionClick,
}: {
  dataConnections: DataConnectionsResponse;
  selectedConnection: Connection;
  handleConnectionClick: (connection: Connection) => void;
}) => (
  <nav className="w-64 border-r border-gray-300 p-4">
    <h3 className="mb-4 text-lg font-semibold">Data Connections</h3>

    {/* System Connections */}
    <div>
      <h4 className="mb-2 text-base font-semibold">System Connections</h4>
      <ul className="mb-4 space-y-2">
        {dataConnections?.system?.map((connection, index) => (
          <li
            key={index}
            className={`cursor-pointer rounded px-3 py-2 hover:bg-gray-100 ${
              selectedConnection?.id === connection.id
                ? "bg-highlight-100 font-semibold text-highlight-700"
                : ""
            }`}
          >
            <button
              type="button"
              className="w-full text-left"
              onClick={() => handleConnectionClick(connection)}
            >
              {connection.name || `System Connection ${index + 1}`}
            </button>
          </li>
        ))}
      </ul>
    </div>

    {/* User Connections */}
    <div>
      <h4 className="mb-2 text-base font-semibold">User Connections</h4>
      <ul className="space-y-2">
        {dataConnections?.user?.map((connection, index) => (
          <li
            key={index}
            className={`cursor-pointer rounded px-3 py-2 hover:bg-gray-100 ${
              selectedConnection?.id === connection.id
                ? "bg-highlight-100 font-semibold text-highlight-700"
                : ""
            }`}
          >
            <button
              type="button"
              className="w-full text-left"
              onClick={() => handleConnectionClick(connection)}
            >
              {connection.name || `User Connection ${index + 1}`}
            </button>
          </li>
        ))}
      </ul>
    </div>
  </nav>
);

export default DataConnectionSelector;
