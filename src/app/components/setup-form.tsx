import { useDataConnections, type Connection } from "../../features/app-shell/duft-settings/resources";
import DataConnectionForm from "./data-connection-form";

const SetupForm = () => {
  const dataConnections = useDataConnections();

  if (!dataConnections) {
    return <div>Loading...</div>;
  }

  // Get DUFT-SERVER-API connection directly
  const serverConnection = dataConnections.system.find(
    conn => conn.id === "DUFT-SERVER-API"
  );

  if (!serverConnection) {
    return <div>Server connection configuration not found.</div>;
  }
  return (
    <div className="flex flex-col">
      <DataConnectionForm
        connection={serverConnection}
        onSaved={() => {}}
      />
    </div>
  );
};

export default SetupForm;
