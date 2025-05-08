import React from "react";

interface AddBranchModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  form: any;
  setForm: (form: any) => void;
  areas: { id: number; areaName: string }[];
  handleClear: () => void;
}

const sourceTypes = [
  "Deep Well - Electric",
  "Deep Well - Genset Operated",
  "Shallow Well",
  "Spring - Gravity",
  "Spring - Power-driven",
  "Bulk",
  "WTP",
  "Booster"
];

const AddBranchModal: React.FC<AddBranchModalProps> = ({
  show,
  onClose,
  onSubmit,
  form,
  setForm,
  areas,
  handleClear,
}) => {
  if (!show) return null;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSourceTypeChange = (type: string) => {
    setForm({
      ...form,
      sourceTypes: form.sourceTypes.includes(type)
        ? form.sourceTypes.filter((t: string) => t !== type)
        : [...form.sourceTypes, type]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-200 rounded-xl p-8 w-full max-w-md shadow-lg relative">
        <h2 className="text-2xl font-semibold text-center mb-6">Edit Branch</h2>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <label className="text-left">Area</label>
          <select
            name="areaId"
            value={form.areaId}
            onChange={handleInput}
            className="rounded px-2 py-1 border"
            required
          >
            <option value="">Select Area (default JV)</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>{area.areaName}</option>
            ))}
          </select>
          <label className="text-left">Branch Name</label>
          <input
            name="branchName"
            value={form.branchName}
            onChange={handleInput}
            className="rounded px-2 py-1 border"
            required
          />
          <div className="mt-2 mb-2">
            <div className="font-semibold mb-1">Source Type</div>
            {sourceTypes.map((type) => (
              <div key={type}>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={form.sourceTypes.includes(type)}
                    onChange={() => handleSourceTypeChange(type)}
                    className="mr-2"
                  />
                  {type}
                </label>
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-8 py-2 rounded-lg hover:bg-green-700 transition mt-4"
          >
            Next
          </button>
        </form>
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

export default AddBranchModal;