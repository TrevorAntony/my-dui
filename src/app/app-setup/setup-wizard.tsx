import { useState, useEffect, useRef } from 'react';
import { Progress, Button, Modal } from 'flowbite-react';
import { useDataConnections } from "../../features/app-shell/duft-settings/resources";
import { HiCheck } from 'react-icons/hi';
import SetupConnectionForm from './setup-connection-form';
import { useAppState } from '../../core/context/AppStateContext';
import { GlobalState } from '../../core/context/types';
import { client } from '../../core/api/DuftHttpClient/local-storage-functions';

const SetupWizard = () => {
  const { dispatch } = useAppState();
  const dataConnections = useDataConnections();
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [modifiedConnections, setModifiedConnections] = useState<Set<string>>(new Set());
  
  //unsaved changes handling
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
  const [nextConnectionId, setNextConnectionId] = useState<string | null>(null);
  const formHasChanges = useRef(false);
  const handleConnectionClick = (connectionId: string) => {
    if (formHasChanges.current && connectionId !== selectedConnection) {
      setNextConnectionId(connectionId);
      setShowUnsavedChangesModal(true);
    } else {
      setSelectedConnection(connectionId);
    }
  };

  const handleConfirmUnsavedChanges = () => {
    setShowUnsavedChangesModal(false);
    if (nextConnectionId) {
      setSelectedConnection(nextConnectionId);
      formHasChanges.current = false;
    }
  };

  const handleCancelUnsavedChanges = () => {
    setShowUnsavedChangesModal(false);
    setNextConnectionId(null);
  };

  //set initial connection
  useEffect(() => {
    if (dataConnections?.system?.length > 0 && !selectedConnection) {
      setSelectedConnection(dataConnections.system[0].id);
    }
  }, [dataConnections, selectedConnection]);

  if (!dataConnections || !dataConnections.system || dataConnections.system.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
          No Connection Configurations Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The system connection configurations are missing or empty. 
          Please ensure the data_connections.json file exists and contains valid configurations.
        </p>
        <Button
          color="primary"
          onClick={() => dispatch({ type: "SET_STATE", payload: GlobalState.APP_READY })}
        >
          Retry Setup
        </Button>
      </div>
    );
  }

  const connections = [...dataConnections.system];
  const totalConnections = connections.length;

  const isANAConfigured = modifiedConnections.has('ANA');
  const completeSetup = async () => {
    if (!isANAConfigured) {
      console.error('ANA connection must be configured before completing setup');
      return;
    }
    try {
      await client.updateSettings({
        debug: true,
        oobe: true,
        unittest: false
      });
      dispatch({ type: "SET_STATE", payload: GlobalState.APP_MAIN });
    } catch (error) {
      console.error('Error updating OOBE status:', error);
    }
  };

  const handleConnectionUpdate = (success: boolean, connectionId: string) => {
    if (success) {
      setModifiedConnections(prev => new Set(prev).add(connectionId));
    } else {
      setModifiedConnections(prev => {
        const updated = new Set(prev);
        updated.delete(connectionId);
        return updated;
      });
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left sidebar with connections */}
        <div className="w-full md:w-64 flex flex-col gap-4">
          <div className="mb-4 flex flex-col gap-2">
            <Progress
              progress={(modifiedConnections.size / totalConnections) * 100}
              color="blue"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {modifiedConnections.size} connection(s) configured
            </p>
          </div>
          
          {connections.map((connection) => (
            <button
              key={connection.id}
              onClick={() => handleConnectionClick(connection.id)}
              className={`flex items-center p-4 rounded-lg transition-all ${
                selectedConnection === connection.id
                  ? 'bg-highlight-100 dark:bg-highlight-800 text-highlight-900 dark:text-white'
                  : modifiedConnections.has(connection.id)
                  ? 'bg-green-50 dark:bg-green-900 text-green-900 dark:text-green-100'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}
            >
              <div className="flex items-center gap-3">
                {modifiedConnections.has(connection.id) ? (
                  <HiCheck className="w-5 h-5" />
                ) : (
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600">
                    •
                  </span>
                )}
                <span className="text-sm font-medium">{connection.name}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right side with form */}
        <div className="flex-1">
          {selectedConnection && (
            <SetupConnectionForm
              connection={connections.find(c => c.id === selectedConnection)!}
              onSaved={(success) => {
                handleConnectionUpdate(success, selectedConnection);
                formHasChanges.current = false;
              }}
              onFormChange={() => {
                formHasChanges.current = true;
              }}
            />
          )}
        </div>
      </div>
      <Modal
        show={showUnsavedChangesModal}
        onClose={handleCancelUnsavedChanges}
        position="center"
        size="3xl"
      >
        <Modal.Header>Unsaved Changes</Modal.Header>
        <Modal.Body className="flex flex-col overflow-hidden">
          <div className="text-default">
            You have unsaved changes. Do you want to discard them and proceed?
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex w-full justify-end">
            <Button
              onClick={handleCancelUnsavedChanges}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmUnsavedChanges}
              color="secondary"
            >
              Discard Changes
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Footer with action button */}
      <div className="mt-6 flex justify-between items-center border-t pt-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The Analysis Database (ANA) connection must be configured to complete setup.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {modifiedConnections.size} connection(s) configured
            {!isANAConfigured && ' (ANA connection required)'}
          </p>
        </div>
        <Button
          color="primary"
          onClick={completeSetup}
          disabled={!isANAConfigured}
        >
          Complete Setup
        </Button>
      </div>
    </>
  );
};

export default SetupWizard;
