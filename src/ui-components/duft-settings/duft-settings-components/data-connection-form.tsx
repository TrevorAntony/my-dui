import { useEffect, useState, useRef } from "react";
import type { FC } from "react";
import { Button } from "flowbite-react";
import config from "../../../config";
import type { DataConnectionFormProps } from "../resources";
import ToastNotification from "../../notification-toast";

const DataConnectionForm: FC<DataConnectionFormProps> = ({
  connection,
  handleConnectionClick,
}) => {
  const [formData, setFormData] = useState({
    server: "",
    username: "",
    password: "",
  });
  const [initialFormData, setInitialFormData] = useState({
    server: "",
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const formHasChanges = useRef(false); // Tracks if form has changes

  // Handle form changes and set change tracking
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    formHasChanges.current = true; // Mark form as changed
  };

  // Function to fetch data for the new connection
  const fetchData = (conn) => {
    if (conn) {
      fetch(`${config.apiBaseUrl}/data-connections/${conn.id}/parameters`)
        .then((response) => response.json())
        .then((data) => {
          setFormData(data);
          setInitialFormData(data);
          formHasChanges.current = false; // Reset tracking on new fetch
        })
        .catch((error) =>
          console.error("Error fetching connection details:", error),
        );
    } else {
      setFormData({
        server: "",
        username: "",
        password: "",
      });
      setInitialFormData({
        server: "",
        username: "",
        password: "",
      });
      formHasChanges.current = false; // Reset tracking when no connection
    }
  };

  // Effect to handle connection change
  useEffect(() => {
    setFormData({
      server: "",
      username: "",
      password: "",
    });
    if (!connection) return; // Do nothing if no connection is passed

    // Check if form has unsaved changes
    if (formHasChanges.current) {
      const userConfirmed = window.confirm(
        "You have unsaved changes. Do you want to discard them and proceed?",
      );

      if (userConfirmed) {
        // If confirmed, fetch the new connection's data
        fetchData(connection);
      } else {
        // If not confirmed, retain the current form state
        return;
      }
    } else {
      // No unsaved changes, fetch data immediately
      fetchData(connection);
    }
  }, [connection]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch(`${config.apiBaseUrl}/data-connections/${connection.id}/parameters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Failed to update. Server responded with an error.");
        }
      })
      .then(() => {
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
          <label htmlFor="username" className="mb-2 block font-semibold">
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-1/2 rounded border px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block font-semibold">
            Password
          </label>
          <div className="relative w-1/2">
            <input
              id="password"
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
        <div className="flex space-x-2">
          <Button
            type="submit"
            className="w-[65px] rounded-md bg-highlight-500 px-2 py-1 text-sm font-semibold text-white hover:bg-highlight-700"
          >
            Save
          </Button>
          <Button
            type="button"
            onClick={() => handleConnectionClick(null)}
            className="w-[65px] rounded-md border border-highlight-200 bg-white px-2 py-1 text-sm font-semibold text-highlight-850 hover:bg-highlight-100"
          >
            Cancel
          </Button>
        </div>
      </form>

      <ToastNotification
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default DataConnectionForm;
