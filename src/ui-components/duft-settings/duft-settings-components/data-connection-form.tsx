/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable jsx-a11y/label-has-associated-control */

import type { FC } from "react";
import { useEffect, useState, useRef } from "react";
import { Button, Modal } from "flowbite-react";
import ToastNotification from "../../notification-toast";
import type { Connection, DataConnectionFormProps } from "../resources";
import { client } from "../../..";

const DataConnectionForm: FC<DataConnectionFormProps> = ({
  connection,
  handleConnectionClick,
}) => {
  const [formData, setFormData] = useState<{ name: string; value: string }[]>(
    []
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
    fieldName: string
  ) => {
    setFormData((prevFormData) =>
      prevFormData.map((field) =>
        field.name === fieldName ? { ...field, value: e.target.value } : field
      )
    );
    formHasChanges.current = true;
  };

  const fetchData = async (conn: Connection) => {
    if (conn) {
      try {
        const data = await client.getConnectionParameters(conn.id);
        const fields = conn.params.map((param) => ({
          name: param.name,
          value: data[param.name] || "",
        }));
        setFormData(fields);
        formHasChanges.current = false;
        previousConnection.current = conn;
      } catch (error) {
        console.error("Error fetching connection details:", error);
      }
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formattedData = formData.reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {});

    try {
      await client.updateConnectionParameters(connection.id, formattedData);
      setToastMessage("Data connection updated successfully!");
      setToastType("success");
      setShowToast(true);
      setTimeout(() => {
        handleConnectionClick(null);
      }, 1000);
    } catch (error) {
      console.error("Error saving connection details:", error);
      setToastMessage("Error on saving data connection details");
      setToastType("error");
      setShowToast(true);
    }
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
                  className="focus:border-highlight-500 w-full rounded px-3 py-2 pr-10 focus:ring-0 dark:bg-gray-600 dark:text-white"
                />
                {param.type === "password" && fieldData?.value && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-highlight-850 dark:text-highlight-400 absolute right-2 top-3 text-sm"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
        <div className="flex space-x-2">
          <Button type="submit" color="primary">
            Save
          </Button>
          <Button
            type="button"
            onClick={() => handleConnectionClick(null)}
            color="secondary"
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

      <Modal
        show={showUnsavedChangesModal}
        onClose={() => handleCancelUnsavedChanges()}
        position="center"
        size="3xl"
      >
        <Modal.Header>Unsaved Changes</Modal.Header>
        <Modal.Body className="flex flex-col overflow-hidden ">
          <div className="text-default">
            You have unsaved changes. Do you want to discard them and proceed?
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex w-full justify-end">
            <Button
              onClick={() => handleCancelUnsavedChanges()}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleConfirmUnsavedChanges()}
              color="secondary"
            >
              Discard Changes
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DataConnectionForm;
