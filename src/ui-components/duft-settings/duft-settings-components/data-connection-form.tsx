/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable jsx-a11y/label-has-associated-control */

import type { FC } from "react";
import { useEffect, useState, useRef } from "react";
import { Button } from "flowbite-react";
import config from "../../../config";
import ToastNotification from "../../notification-toast";
import type { Connection, DataConnectionFormProps } from "../resources";
import DuftModal from "../../../components/duft-modal";

const DataConnectionForm: FC<DataConnectionFormProps> = ({
  connection,
  handleConnectionClick,
}) => {
  const [formData, setFormData] = useState<{ name: string; value: string }[]>(
    [],
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const formHasChanges = useRef(false);
  const previousConnection = useRef<Connection | null>(null);

  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
  const [nextConnection, setNextConnection] = useState<Connection | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
  ) => {
    setFormData((prevFormData) =>
      prevFormData.map((field) =>
        field.name === fieldName ? { ...field, value: e.target.value } : field,
      ),
    );
    formHasChanges.current = true;
  };

  const fetchData = (conn: Connection) => {
    if (conn) {
      fetch(`${config.apiBaseUrl}/data-connections/${conn.id}/parameters`)
        .then((response) => response.json())
        .then((data) => {
          const fields = conn.params.map((param) => ({
            name: param.name,
            value: data[param.name] || "",
          }));
          setFormData(fields);
          formHasChanges.current = false;
          previousConnection.current = conn;
        })
        .catch((error) =>
          console.error("Error fetching connection details:", error),
        );
    } else {
      setFormData([]);
      formHasChanges.current = false;
    }
  };

  const handleConfirmUnsavedChanges = () => {
    setShowUnsavedChangesModal(false);
    fetchData(nextConnection);
  };

  const handleCancelUnsavedChanges = () => {
    setShowUnsavedChangesModal(false);
    handleConnectionClick(previousConnection.current);
  };

  useEffect(() => {
    if (!connection || connection === previousConnection.current) return;

    if (formHasChanges.current) {
      setNextConnection(connection);
      setShowUnsavedChangesModal(true);
    } else {
      fetchData(connection);
    }
  }, [connection, handleConnectionClick]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = formData.reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {});

    fetch(`${config.apiBaseUrl}/data-connections/${connection.id}/parameters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),
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
      {/* <div className="overflow-auto"> */}
      <form onSubmit={handleSubmit}>
        {connection.params.map((param) => {
          const fieldData = formData.find((field) => field.name === param.name);
          return (
            <div key={param.name} className="mb-4">
              <label htmlFor={param.name} className="mb-2 block font-semibold">
                {param.label}
              </label>
              <div className="relative w-1/2">
                <input
                  id={param.name}
                  type={
                    param.type === "password" && !showPassword
                      ? "password"
                      : "text"
                  }
                  name={param.name}
                  value={fieldData?.value || ""}
                  onChange={(e) => handleChange(e, param.name)}
                  className="w-full rounded px-3 py-2 pr-10 focus:border-highlight-500 focus:ring-0"
                />
                {param.type === "password" && fieldData?.value && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-3 text-sm text-highlight-850"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
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
      {/* </div> */}
      <ToastNotification
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />

      <DuftModal
        isOpen={showUnsavedChangesModal}
        onClose={handleCancelUnsavedChanges}
        onExecute={handleConfirmUnsavedChanges}
        title="Unsaved Changes"
        executeButtonText="Discard Changes"
        cancelButtonText="Cancel"
        modalWidth="narrow"
        modalHeight="tiny"
      >
        <p>
          You have unsaved changes. Do you want to discard them and proceed?
        </p>
      </DuftModal>
    </>
  );
};

export default DataConnectionForm;
