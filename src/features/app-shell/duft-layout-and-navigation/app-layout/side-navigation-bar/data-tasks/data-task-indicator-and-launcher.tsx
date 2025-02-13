import { FC, useState, useRef, useEffect } from "react";
import { renderModalContent } from "../../../../../visualizations/visual-utils/modals/helpers/modalContentHelper";
import DataTaskDialog from "./data-task-dialog";
import config from "../../../../../../config";
import {
  channel,
  createEventSource,
} from "../../../../../../utils/data-task-utils";

const DataTaskIndicatorAndLauncher: FC = function () {
  const [data, setData] = useState<{
    isRunning?: boolean;
    message?: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [modalContent]);

  useEffect(() => {
    const eventSource = createEventSource(
      `${config.apiBaseUrl || window.location.origin}/sse/dte/`
    );

    if (eventSource) {
      eventSource.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);

        setData(parsedData);

        if (parsedData.isRunning) {
          setIsModalOpen(true);

          channel.postMessage({
            type: "TOGGLE_MODAL",
            isModalOpen: true,
          });
        }

        const { message, dataTask } = parsedData;

        const maxLength = 150;

        const isValidMessage =
          dataTask &&
          dataTask !== "script_start" &&
          dataTask !== "script_complete" &&
          dataTask !== "scriptError" &&
          message?.length <= maxLength;

        if (isValidMessage) {
          setModalContent((prevContent) => [...prevContent, message]);
        }
      };

      eventSource.onerror = (error) => {
        console.error("EventSource failed:", error);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }

    return undefined;
  }, [config.apiBaseUrl]);

  useEffect(() => {
    channel.onmessage = (event) => {
      if (event.data.type === "TOGGLE_MODAL") {
        setIsModalOpen(event.data.isModalOpen);
        if (!event.data.isModalOpen) {
          setModalContent([]);
        }
      }
    };
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent([]);
    channel.postMessage({ type: "TOGGLE_MODAL", isModalOpen: false });
    window.location.reload();
  };

  const divStyle = {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: data?.isRunning ? "green" : "red",
    cursor: "pointer",
  };

  const content = renderModalContent(modalContent);
  return (
    <>
      <div className="flex items-center justify-center gap-x-5">
        <div style={divStyle}></div>
      </div>
      <DataTaskDialog
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Running data task "
        executeButtonText="Run data task"
        disableButtons={data?.isRunning}
        hideCloseButton={data?.isRunning}
        isLoading={data?.isRunning}
      >
        <div ref={contentRef} className="h-[180px] overflow-y-auto pb-8">
          {content}
        </div>
      </DataTaskDialog>
    </>
  );
};

export default DataTaskIndicatorAndLauncher;
