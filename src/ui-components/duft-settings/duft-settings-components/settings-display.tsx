import { useState } from "react";
import { useDataConnections } from "../resources";
import DataConnectionForm from "./data-connection-form";

const SettingsDisplay = () => {
  const dataConnections = useDataConnections();
  const [selectedConnection, setSelectedConnection] = useState(null);

  const handleConnectionClick = (connection) => {
    setSelectedConnection(connection);
  };

  return (
    <div className="flex h-full">
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

      {/* Separator */}
      <div className="w-px bg-gray-300" />

      {/* Content Area */}
      <div className="flex-1 p-4">
        {selectedConnection ? (
          <div>
            <h3 className="text-lg font-semibold">
              {selectedConnection.name} Configuration
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              {selectedConnection.description}
            </p>
            <DataConnectionForm connection={selectedConnection} />
          </div>
        ) : (
          <p>Select a connection to view details.</p>
        )}
      </div>
    </div>
  );
};

export default SettingsDisplay;
