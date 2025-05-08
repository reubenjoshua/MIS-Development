import React from "react";

interface DatasheetModalProps {
  show: boolean;
  title: string;
  fieldsList: string[];
  fields: { [key: string]: boolean };
  setFields: (fields: { [key: string]: boolean }) => void;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
  // Optional props for source type dropdown
  sourceTypes?: string[];
  selectedSourceType?: string;
  setSelectedSourceType?: (type: string) => void;
}

const DatasheetModal: React.FC<DatasheetModalProps> = ({
  show,
  title,
  fieldsList,
  fields,
  setFields,
  onPrevious,
  onNext,
  onClose,
  sourceTypes,
  selectedSourceType,
  setSelectedSourceType,
}) => {
  if (!show) return null;

  const handleCheckbox = (field: string) => {
    setFields({ ...fields, [field]: !fields[field] });
  };

  // Split fields for two-column layout
  const mid = Math.ceil(fieldsList.length / 2);
  const leftFields = fieldsList.slice(0, mid);
  const rightFields = fieldsList.slice(mid);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-200 rounded-xl p-8 w-full max-w-2xl shadow-lg relative">
        <div className="text-left mb-2">Edit Branch</div>
        <h2 className="text-2xl font-semibold text-center mb-6">{title}</h2>
        {sourceTypes && setSelectedSourceType && (
          <div className="flex justify-center mb-4">
            <select
              className="rounded px-2 py-1 border"
              value={selectedSourceType || ""}
              onChange={e => setSelectedSourceType(e.target.value)}
            >
              <option value="">Source Type</option>
              {sourceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        )}
        <div className="flex flex-wrap gap-x-12 gap-y-2 justify-center mb-6">
          <div>
            {leftFields.map(field => (
              <div key={field}>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={fields[field] || false}
                    onChange={() => handleCheckbox(field)}
                    className="mr-2"
                  />
                  {field}
                </label>
              </div>
            ))}
          </div>
          <div>
            {rightFields.map(field => (
              <div key={field}>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={fields[field] || false}
                    onChange={() => handleCheckbox(field)}
                    className="mr-2"
                  />
                  {field}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-6">
          <button
            className="bg-gray-800 text-white px-8 py-2 rounded-lg hover:bg-gray-900 transition"
            onClick={onPrevious}
          >
            Previous
          </button>
          <button
            className="bg-green-600 text-white px-8 py-2 rounded-lg hover:bg-green-700 transition"
            onClick={onNext}
          >
            Next
          </button>
        </div>
        <button
          type="button"
          className="absolute top-2 right-4 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default DatasheetModal;