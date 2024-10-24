import { useState, useEffect } from "react";
import config from "../../config";

const useDataConnections = () => {
  const [dataConnections, setDataConnections] = useState([]);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/data-connections`)
      .then((response) => response.json())
      .then((data) => setDataConnections(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return dataConnections;
};

const DataConnectionForm = ({ connection }) => {
  const [formData, setFormData] = useState({
    server: "",
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // New state for toggling password visibility

  useEffect(() => {
    setFormData({
      server: "",
      username: "",
      password: "",
    });

    if (connection) {
      fetch(
        `http://localhost:8000/api/v2/data-connections/${connection.id}/parameters`,
      )
        .then((response) => response.json())
        .then((data) => setFormData(data))
        .catch((error) =>
          console.error("Error fetching connection details:", error),
        );
    }
  }, [connection]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(
      `http://localhost:8000/api/v2/data-connections/${connection.id}/parameters`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      },
    )
      .then((response) => response.json())
      .then((data) => console.log("Data saved:", data))
      .catch((error) =>
        console.error("Error saving connection details:", error),
      );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="mb-2 block font-semibold">Server</label>
        {/* Display server name as plain text */}
        <p className="text-sm text-gray-700">{formData.server || "N/A"}</p>
      </div>
      <div className="mb-4">
        <label className="mb-2 block font-semibold">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-1/2 rounded border px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="mb-2 block font-semibold">Password</label>
        <div className="relative w-1/2">
          <input
            type={showPassword ? "text" : "password"} // Toggle between text and password
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
            className="absolute right-2 top-3 text-sm text-highlight-850"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <button
        type="submit"
        className="rounded bg-highlight-500 px-4 py-2 font-semibold text-white"
      >
        Save
      </button>
    </form>
  );
};

const SettingsDisplay = () => {
  const dataConnections = useDataConnections();
  const [selectedConnection, setSelectedConnection] = useState(null);

  const handleConnectionClick = (connection) => {
    setSelectedConnection(connection);
  };

  return (
    <div className="flex h-full">
      {/* Side Navigation */}
      <nav className="w-64 border-r border-gray-300 p-4">
        <h3 className="mb-4 text-lg font-semibold">Data Connections</h3>

        {/* System Connections */}
        <div>
          <h4 className="text-md mb-2 font-semibold">System Connections</h4>
          <ul className="mb-4 space-y-2">
            {dataConnections.system?.map((connection, index) => (
              <li
                key={index}
                className="cursor-pointer rounded px-3 py-2 hover:bg-gray-100"
                onClick={() => handleConnectionClick(connection)}
              >
                {connection.name || `System Connection ${index + 1}`}
                <p className="text-sm text-gray-600">
                  {connection.description}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* User Connections */}
        <div>
          <h4 className="text-md mb-2 font-semibold">User Connections</h4>
          <ul className="space-y-2">
            {dataConnections.user?.map((connection, index) => (
              <li
                key={index}
                className="cursor-pointer rounded px-3 py-2 hover:bg-gray-100"
                onClick={() => handleConnectionClick(connection)}
              >
                {connection.name || `User Connection ${index + 1}`}
                <p className="text-sm text-gray-600">
                  {connection.description}
                </p>
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
