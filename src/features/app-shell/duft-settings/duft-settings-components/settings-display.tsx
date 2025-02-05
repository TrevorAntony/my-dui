import { useState } from "react";
import type { Connection } from "../resources";
import { useDataConnections } from "../resources";
import DataConnectionSelector from "./data-connections-side-nav";
import ConnectionContent from "./connections-content";

const SettingsDisplay = () => {
  const dataConnections = useDataConnections();
  const [selectedConnection, setSelectedConnection] =
    useState<Connection>(null);

  const handleConnectionClick = (connection?: Connection) => {
    setSelectedConnection(connection || null);
  };

  return (
    <div className="text-default flex h-full">
      <DataConnectionSelector
        dataConnections={dataConnections}
        selectedConnection={selectedConnection}
        handleConnectionClick={handleConnectionClick}
      />
      {/* Separator */}
      <div className="w-px overflow-y-auto bg-gray-300" />
      <ConnectionContent
        connection={selectedConnection}
        handleConnectionClick={handleConnectionClick}
      />
    </div>
  );
};

export default SettingsDisplay;
