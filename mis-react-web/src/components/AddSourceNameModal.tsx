import React from "react";

interface SourceName {
  id: number;
  sourceName: string;
}

interface AddSourceNameModalProps {
  show: boolean;
  onClose: () => void;
  sourceNames: SourceName[];
  setSourceNames: (names: SourceName[]) => void;
  newSourceName: string;
  setNewSourceName: (name: string) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const AddSourceNameModal: React.FC<AddSourceNameModalProps> = ({
  show,
  onClose,
  sourceNames,
  setSourceNames,
  newSourceName,
  setNewSourceName,
  onPrevious,
  onNext,
}) => {
  if (!show) return null;

  const handleAdd = () => {
    if (newSourceName.trim() === "") return;
    setSourceNames([
      ...sourceNames,
      { id: sourceNames.length + 1, sourceName: newSourceName }
    ]);
    setNewSourceName("");
  };

  const handleDelete = (id: number) => {
    setSourceNames(sourceNames.filter(sn => sn.id !== id));
  };

  const handleRename = (id: number) => {
    const newName = prompt("Enter new source name:");
    if (newName && newName.trim() !== "") {
      setSourceNames(
        sourceNames.map(sn =>
          sn.id === id ? { ...sn, sourceName: newName } : sn
        )
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-200 rounded-xl p-8 w-full max-w-xl shadow-lg relative">
        <div className="text-left mb-2">Edit Branch</div>
        <h2 className="text-2xl font-semibold text-center mb-6">Add a Source Name</h2>
        <table className="min-w-full mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Source Name</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sourceNames.map(sn => (
              <tr key={sn.id} className="text-center">
                <td className="px-4 py-2">{sn.id}</td>
                <td className="px-4 py-2">{sn.sourceName}</td>
                <td className="px-4 py-2">
                  <button
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition mr-2"
                    onClick={() => handleRename(sn.id)}
                  >
                    Rename
                  </button>
                  <button
                    className="bg-red-700 text-white px-4 py-1 rounded hover:bg-red-800 transition"
                    onClick={() => handleDelete(sn.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mb-6">
          <input
            className="rounded px-2 py-1 border w-1/2"
            value={newSourceName}
            onChange={e => setNewSourceName(e.target.value)}
            placeholder="Source Name"
          />
          <button
            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition ml-2"
            onClick={handleAdd}
          >
            Add
          </button>
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

export default AddSourceNameModal;