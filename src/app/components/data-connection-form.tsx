import { useEffect, useState } from "react";
import type { Connection } from "../../features/app-shell/duft-settings/resources";
import { client } from "../../core/api/DuftHttpClient/local-storage-functions";
import { useAppState } from "../../core/context/AppStateContext";
import { GlobalState } from "../../core/context/types";

interface DataConnectionFormProps {
  connection: Connection;
  onSaved: () => void;
}

const DataConnectionForm: React.FC<DataConnectionFormProps> = ({
  connection,
  onSaved,
}) => {
  const { dispatch } = useAppState();
  const [formData, setFormData] = useState<{ name: string; value: string }[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {

      try {
        const data = await client.getConnectionParameters(connection.id);
        const fields = connection.params.map((param) => ({
          name: param.name,
          value: data?.data?.[param.name] || "",
        }));
        setFormData(fields);
      } catch (error) {
      }
    };

    fetchData();
  }, [connection]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const formattedData = formData.reduce((acc, field) => {
        acc[field.name] = field.value;
        return acc;
      }, {});
      
      // First update connection parameters
      const connResponse = await client.updateConnectionParameters(connection.id, {
        data: formattedData
      });


      // Then update OOBE status
      const settingsPayload = {
        data: {
          debug: true,
          oobe: true,
          unittest: false
        }
      };
      
      const settingsResponse = await client.updateSettings(settingsPayload);

      if (settingsResponse.result === 'success') {
        dispatch({ type: "SET_STATE", payload: GlobalState.APP_MAIN });
      }

    } catch (error) {
    } finally {
      console.log("✨ Setup process complete");
      setIsSaving(false);
      onSaved();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="mb-4 text-lg font-semibold">{connection.name}</h3>
      <p className="mb-6 text-sm text-gray-600">{connection.description}</p>
      
      {connection.params.map((param) => {
        const fieldData = formData.find((field) => field.name === param.name);
        return (
          <div key={param.name} className="space-y-2">
            <label htmlFor={param.name} className="block text-sm font-medium">
              {param.label}
            </label>
            <div className="relative">
              <input
                id={param.name}
                type={param.type === "password" && !showPassword ? "password" : "text"}
                value={fieldData?.value || ""}
                onChange={(e) => {
                  setFormData(prev => 
                    prev.map(field => 
                      field.name === param.name 
                        ? { ...field, value: e.target.value }
                        : field
                    )
                  );
                }}
                className="w-full rounded-md border p-2"
              />
              {param.type === "password" && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 text-sm text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              )}
            </div>
          </div>
        );
      })}

      <div className="mt-6 flex gap-4">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onSaved}
          className="rounded border px-4 py-2 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default DataConnectionForm;
