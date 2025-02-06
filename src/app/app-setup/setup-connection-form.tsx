import { useEffect, useState } from "react";
import type { Connection } from "../../features/app-shell/duft-settings/resources";
import { client } from "../../core/api/DuftHttpClient/local-storage-functions";
import { Button, Card, Label, TextInput } from "flowbite-react";
import ToastNotification from "../../utils/notification-toast";

interface DataConnectionFormProps {
  connection: Connection;
  onSaved: (success: boolean) => void;
  onFormChange: () => void;
}

const SetupConnectionForm: React.FC<DataConnectionFormProps> = ({
  connection,
  onSaved,
  onFormChange,
}) => {
  const [formData, setFormData] = useState<{ name: string; value: string }[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [testQueryInput, setTestQueryInput] = useState(connection.testquery || "SELECT 1");

  useEffect(() => {
    setTestQueryInput(connection.testquery || "SELECT 1");
    const fetchData = async () => {
      try {
        const response = await client.getConnectionParameters(connection.id);
        // Handle response structure
        const connectionData = response?.data || response;
        
        if (connectionData) {
          // Map existing values to form fields
          const fields = connection.params.map((param) => {
            let value = '';
            
            // Handle different data structures
            if (connectionData.data && connectionData.data[param.name]) {
              value = connectionData.data[param.name];
            } else if (connectionData[param.name]) {
              value = connectionData[param.name];
            }
            
            // Special handling for serverURL to server mapping
            if (param.name === 'serverURL' && !value && connectionData.server) {
              value = connectionData.server;
            }

            return {
              name: param.name,
              value: String(value || '')
            };
          });
          
          setFormData(fields);
        }
      } catch (error) {
        console.error('Error loading connection data:', error);
        // Initialize empty form if no data exists
        setFormData(connection.params.map(param => ({
          name: param.name,
          value: ''
        })));
      }
    };

    fetchData();
  }, [connection]);

  const testConnection = async (connectionId: string): Promise<boolean> => {
    try {
      let testResponse;

      if (isDatabaseConnection(connection)) {
        // For database connections (including ANA)
        testResponse = await client.getQueryData({
          query: testQueryInput,
          data_connection_id: connectionId,
          format: "json"
        });
      } else {
        // For API endpoints
        const urlParam = formData.find(f => f.name === 'serverURL' || f.name === 'server')?.value;
        if (!urlParam) {
          throw new Error('No server URL configured');
        }
        testResponse = await fetch(urlParam);
        if (!testResponse.ok) {
          throw new Error(`Server responded with status: ${testResponse.status}`);
        }
      }

      if (testResponse && !testResponse.error) {
        setToastMessage("Connection test successful!");
        setToastType("success");
        return true;
      } else {
        throw new Error(testResponse?.error || 'Connection test failed');
      }
    } catch (error: any) {
      setToastMessage(`Connection test failed: ${error.message}`);
      setToastType("error");
      return false;
    } finally {
      setShowToast(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const formattedData = formData.reduce((acc, field) => {
        if (field.value.trim() !== '') {
          acc[field.name] = field.value;
        }
        return acc;
      }, {});
      
      //Save the connection parameters
      const saveResponse = await client.updateConnectionParameters(connection.id, formattedData);
      if (!saveResponse) {
        throw new Error('Failed to save connection parameters');
      }
      // Then test the connection
      const isValid = await testConnection(connection.id);
      onSaved(isValid);
    } catch (error: any) {
      setToastMessage(`Error: ${error.message}`);
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    setFormData(prev =>
      prev.map(field =>
        field.name === fieldName
          ? { ...field, value: e.target.value }
          : field
      )
    );
    onFormChange();
  };

  const isDatabaseConnection = (connection: Connection) => {
    const dbSpecificParams = ['port', 'database', 'type'];
    return connection.params.some(param => dbSpecificParams.includes(param.name));
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {connection.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {connection.description}
          </p>

          <div className="space-y-4">
            {connection.params.map((param) => {
              const fieldData = formData.find((field) => field.name === param.name);
              return (
                <div key={param.name}>
                  <div className="mb-2 block">
                    <Label htmlFor={param.name} value={param.label} />
                  </div>
                  <div className="relative">
                    <TextInput
                      id={param.name}
                      type={param.type === "password" && !showPassword ? "password" : "text"}
                      value={fieldData?.value || ""}
                      onChange={(e) => handleChange(e, param.name)}
                    />
                    {param.type === "password" && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {/* Modified condition for test query input */}
            {isDatabaseConnection(connection) && (
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="testQuery" value="Test Query" />
                  <p className="text-sm text-gray-500">
                    Query that will be used to test this database connection
                  </p>
                </div>
                <div className="relative">
                  <TextInput
                    id="testQuery"
                    type="text"
                    value={testQueryInput}
                    onChange={(e) => setTestQueryInput(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="mt-6 flex justify-start">
          <Button
            type="submit"
            disabled={isSaving}
            color="primary"
          >
            {isSaving ? "Saving..." : "Save Connection"}
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

export default SetupConnectionForm;
