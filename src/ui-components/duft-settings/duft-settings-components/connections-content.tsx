import type { FC } from "react";
import type { DataConnectionFormProps } from "../resources";
import DataConnectionForm from "./data-connection-form";

const ConnectionContent: FC<DataConnectionFormProps> = ({
  connection,
  handleConnectionClick,
}) => (
  <div className="h-full flex-1 overflow-y-auto p-4">
    {connection ? (
      <div>
        <h3 className="text-lg font-semibold">
          {connection.name} Configuration
        </h3>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {connection.description}
        </p>
        <DataConnectionForm
          connection={connection}
          handleConnectionClick={handleConnectionClick}
        />
      </div>
    ) : (
      <p>Select a connection to view details.</p>
    )}
  </div>
);

export default ConnectionContent;
