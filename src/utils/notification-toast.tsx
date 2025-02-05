import { Toast } from "flowbite-react";
import type { FC } from "react";

const ToastNotification: FC<{
  show: boolean;
  message: string;
  type: string;
  onClose: () => void;
}> = ({ show, message, type, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed right-4 top-4 z-50">
      <Toast>
        <div
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
            type === "success"
              ? "bg-green-200 text-green-500"
              : "bg-red-200 text-red-800"
          }`}
        >
          {type === "success" ? "✓" : "✕"}
        </div>
        <div className="ml-3 text-sm font-normal">{message}</div>
        <Toast.Toggle onClick={onClose} />
      </Toast>
    </div>
  );
};

export default ToastNotification;
