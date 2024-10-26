import { useEffect, useState } from "react";
import type { FC } from "react";
import { Toast } from "flowbite-react";
import config from "../../../config";
import type { DataConnectionFormProps } from "../resources";

const DataConnectionForm: FC<DataConnectionFormProps> = ({ connection }) => {
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
      fetch(`${config.apiBaseUrl}/data-connections/${connection.id}/parameters`)
        .then((response) => response.json())
        .then((data) => setFormData(data))
        .catch((error) =>
          console.error("Error fetching connection details:", error),
        );
    }
  }, [connection]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
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

export default DataConnectionForm;
