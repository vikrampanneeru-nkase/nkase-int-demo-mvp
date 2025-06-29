import React from "react";

type ConfirmDialogProps = {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">{message}</h2>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Yes, Isolate
          </button>
        </div>
      </div>
    </div>
  );
};

