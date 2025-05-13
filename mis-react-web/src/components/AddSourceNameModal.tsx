import React, { useState, useEffect } from 'react';
import { SourceName, SourceType, Branch, Area } from '../types/branch';
import axios from 'axios';

interface AddSourceNameModalProps {
  show: boolean;
  onClose: () => void;
  branches: Branch[];
  branchId: number;
  setBranchId: (id: number) => void;
  areas: Area[];
  areaId?: number;
  setAreaId?: (id: number) => void;
  sourceNames: SourceName[];
  setSourceNames: (names: SourceName[]) => void;
  sourceTypes: SourceType[];
  onPrevious: () => void;
  onNext: () => void;
}

const AddSourceNameModal: React.FC<AddSourceNameModalProps> = ({
  show,
  onClose,
  branches,
  branchId,
  setBranchId,
  areas,
  areaId: controlledAreaId,
  setAreaId: setControlledAreaId,
  sourceNames,
  setSourceNames,
  sourceTypes,
  onPrevious,
  onNext,
}) => {
  const [newSourceName, setNewSourceName] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState<number>(sourceTypes[0]?.id || 0);
  const [areaId, setAreaId] = useState<number>(areas[0]?.id || 0);

  useEffect(() => {
    if (show && branchId && areaId) {
      axios.get(`http://localhost:5000/api/branch/${branchId}/source-names?areaId=${areaId}`)
        .then(res => {
          console.log('Fetched source names:', res.data);
          setSourceNames(Array.isArray(res.data) ? res.data : []);
        })
        .catch(err => console.error('Failed to fetch source names', err));
    } else {
      setSourceNames([]); // Clear when no branch or area selected
    }
    // eslint-disable-next-line
  }, [show, branchId, areaId]);

  useEffect(() => {
    if (controlledAreaId !== undefined && setControlledAreaId) {
      setAreaId(controlledAreaId);
    }
  }, [controlledAreaId]);

  if (!show) return null;

  const handleAddSourceName = async () => {
    if (newSourceName.trim() && selectedTypeId && areaId) {
      try {
        // Step 1: Create the SourceName
        const sourceNameRes = await axios.post('http://localhost:5000/api/source-name', {
          sourceName: newSourceName.trim(),
          sourceTypeId: selectedTypeId,
          isActive: true
        });
        const sourceNameId = sourceNameRes.data.id;
        // Step 2: Create the BranchSourceName
        await axios.post('http://localhost:5000/api/branch-source-name', {
          branchId,
          sourceNameId,
          isActive: true
        });
        // Refetch source names after successful creation
        axios.get(`http://localhost:5000/api/branch/${branchId}/source-names?areaId=${areaId}`)
          .then(res => {
            setSourceNames(Array.isArray(res.data) ? res.data : []);
          });
        setNewSourceName('');
        setSelectedTypeId(sourceTypes[0]?.id || 0);
        setAreaId(areas[0]?.id || 0);
      } catch (err) {
        alert('Failed to add source name.');
      }
    }
  };

  const handleRemoveSourceName = (index: number) => {
    setSourceNames(sourceNames.filter((_, i) => i !== index));
  };

  const handleTypeChange = (index: number, newTypeId: number) => {
    setSourceNames(sourceNames.map((sn, i) =>
      i === index ? { ...sn, sourceTypeId: newTypeId } : sn
    ));
  };

  const safeSourceNames = Array.isArray(sourceNames) ? sourceNames : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl relative">
        <h2 className="text-2xl font-semibold text-center mb-6">Add Source Name</h2>
        <select
          value={branchId}
          onChange={e => setBranchId(Number(e.target.value))}
          className="mb-4 rounded px-2 py-1 border w-full"
        >
          <option value="">Select Branch</option>
          {branches.map(branch => (
            <option key={branch.id} value={branch.id}>{branch.branchName}</option>
          ))}
        </select>
        <select
          value={areaId}
          onChange={e => setAreaId(Number(e.target.value))}
          className="mb-4 rounded px-2 py-1 border w-full"
        >
          <option value="">Select Area</option>
          {areas.map(area => (
            <option key={area.id} value={area.id}>{area.areaName}</option>
          ))}
        </select>
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newSourceName}
              onChange={(e) => setNewSourceName(e.target.value)}
              placeholder="Enter source name"
              className="flex-1 rounded px-2 py-1 border"
            />
            <select
              value={selectedTypeId}
              onChange={e => setSelectedTypeId(Number(e.target.value))}
              className="rounded px-2 py-1 border"
            >
              {sourceTypes.map(st => (
                <option key={st.id} value={st.id}>{st.sourceType}</option>
              ))}
            </select>
            <button
              onClick={handleAddSourceName}
              className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {safeSourceNames.map((source, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span>
                  {source.sourceName || "(No name)"}
                  {(source as any).sourceTypeName
                    ? ` (Type: ${(source as any).sourceTypeName})`
                    : sourceTypes.find(st => st.id === source.sourceTypeId)
                      ? ` (Type: ${sourceTypes.find(st => st.id === source.sourceTypeId)?.sourceType})`
                      : ''}
                </span>
                <select
                  value={source.sourceTypeId}
                  onChange={e => handleTypeChange(index, Number(e.target.value))}
                  className="rounded px-2 py-1 border ml-2"
                >
                  {sourceTypes.map(st => (
                    <option key={st.id} value={st.id}>{st.sourceType}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleRemoveSourceName(index)}
                  className="text-red-600 hover:text-red-700 ml-2"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onPrevious}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Previous
          </button>
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Next
            </button>
          )}
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