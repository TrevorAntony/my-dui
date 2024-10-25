import { useState, useEffect } from "react";
import { Toast } from "flowbite-react"; // Import Toast component
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
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      },
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Failed to update. Server responded with an error.");
        }
      })
      .then((data) => {
        setToastMessage("Data connection updated successfully!");
        setToastType("success");
        setShowToast(true);
        setTimeout(() => (window.location.href = "/"), 1000);
      })
      .catch((error) => {
        console.error("Error saving connection details:", error);
        setToastMessage("Failed to save data.");
        setToastType("error");
        setShowToast(true);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="mb-2 block font-semibold">Server</label>
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
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-3 text-sm text-highlight-850"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="rounded-md bg-highlight-500 px-4 py-2 font-semibold text-white hover:bg-highlight-700"
        >
          Save
        </button>
      </form>

      {/* Toast notification */}
      {showToast && (
        <div className="fixed right-4 top-4 z-50">
          <Toast>
            <div
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                toastType === "success"
                  ? "bg-green-200 text-green-500"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {toastType === "success" ? "✓" : "✕"}
            </div>
            <div className="ml-3 text-sm font-normal">{toastMessage}</div>
            <Toast.Toggle onClick={() => setShowToast(false)} />
          </Toast>
        </div>
      )}
    </>
  );
};

const SettingsDisplay = () => {
  const dataConnections = useDataConnections();
  const [selectedConnection, setSelectedConnection] = useState(
    dataConnections.system?.[0],
  );

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
                className={`cursor-pointer rounded px-3 py-2 hover:bg-gray-100 ${
                  selectedConnection?.id === connection.id
                    ? "bg-highlight-100 font-semibold text-highlight-700"
                    : ""
                }`}
                onClick={() => handleConnectionClick(connection)}
              >
                {connection.name || `System Connection ${index + 1}`}
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
                className={`cursor-pointer rounded px-3 py-2 hover:bg-gray-100 ${
                  selectedConnection?.id === connection.id
                    ? "bg-highlight-100 font-semibold text-highlight-700"
                    : ""
                }`}
                onClick={() => handleConnectionClick(connection)}
              >
                {connection.name || `User Connection ${index + 1}`}
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
