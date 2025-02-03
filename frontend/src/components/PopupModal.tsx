import React, { useState } from "react";
import { Clipboard, ClipboardCheck } from "lucide-react";

interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  formUrl: string;
}

const PopupModal: React.FC<PopupModalProps> = ({ isOpen, onClose, formUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset "Copied" state after 2s
    } catch (err) {
      console.error("Failed to copy URL", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Form Created Successfully!</h2>
        <p className="mb-2 text-gray-700">Access your form using the link below:</p>

        {/* URL Display Box with Copy Button */}
        <div className="relative bg-gray-100 p-3 rounded-md mb-4">
          <textarea
            readOnly
            value={formUrl}
            className="bg-transparent w-full text-blue-800 underline text-sm px-2 py-2 focus:outline-none resize-none h-28"
          />
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 border border-gray-300 bg-gray-100 hover:bg-gray-200 p-2 rounded-md transition-colors"
          >
            {copied ? <ClipboardCheck className="w-5 h-5 text-green-600" /> : <Clipboard className="w-5 h-5" />}
          </button>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
