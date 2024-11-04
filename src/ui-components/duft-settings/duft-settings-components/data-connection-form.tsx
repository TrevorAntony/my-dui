/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable jsx-a11y/label-has-associated-control */
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

  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const formHasChanges = useRef(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    formHasChanges.current = true;
  };

  const fetchData = (conn) => {
    if (conn) {
      fetch(`${config.apiBaseUrl}/data-connections/${conn.id}/parameters`)
        .then((response) => response.json())
        .then((data) => {
          setFormData(data);
          formHasChanges.current = false;
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
      formHasChanges.current = false;
    }
  };

  useEffect(() => {
    setFormData({
      server: "",
      username: "",
      password: "",
    });
    if (!connection) return;

    if (formHasChanges.current) {
      const userConfirmed = window.confirm(
        "You have unsaved changes. Do you want to discard them and proceed?",
      );

      if (userConfirmed) {
        fetchData(connection);
      } else {
        return;
      }
    } else {
      fetchData(connection);
    }
  }, [connection]);

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
            className="focus:border-highlight-500 w-1/2 rounded px-3 py-2 focus:ring-0"
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
              className="focus:border-highlight-500 w-full rounded px-3 py-2 focus:ring-0"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-highlight-850 absolute right-2 top-3 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            type="submit"
            className="bg-highlight-500 hover:bg-highlight-700 w-[65px] rounded-md px-2 py-1 text-sm font-semibold text-white"
          >
            Save
          </Button>
          <Button
            type="button"
            onClick={() => handleConnectionClick(null)}
            className="border-highlight-200 text-highlight-850 hover:bg-highlight-100 w-[65px] rounded-md border bg-white px-2 py-1 text-sm font-semibold"
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
