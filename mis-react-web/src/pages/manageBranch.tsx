import { useEffect, useState } from "react";
import axios from "axios";
import AddBranchModal from "../components/AddBranchModal";
import AddSourceNameModal from "../components/AddSourceNameModal";
import DatasheetModal from "../components/DailyDataSheetModal";
import BranchFormProgress from "../components/BranchFormProgress";
import { BranchFormProvider, useBranchForm } from "../context/BranchFormContext";
import { Branch, Area, DailyForm, MonthlyForm, SourceType } from "../types/branch";
import ConfirmModal from '../components/ConfirmModal';

const ManageBranchContent: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [sourceTypes, setSourceTypes] = useState<SourceType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => () => {});
  
  const {
    formData,
    currentStep,
    setCurrentStep,
    updateBranch,
    updateSourceTypes,
    updateSourceNames,
    updateDailyFields,
    updateMonthlyFields,
    resetForm
  } = useBranchForm();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    axios.get("http://localhost:5000/api/branches", config)
      .then(res => setBranches(res.data))
      .catch(err => console.error("Failed to fetch branches", err));

    axios.get("http://localhost:5000/api/areas", config)
      .then(res => setAreas(res.data))
      .catch(err => console.error("Failed to fetch areas", err));

    axios.get("http://localhost:5000/api/source-types", config)
      .then(res => setSourceTypes(res.data))
      .catch(err => console.error("Failed to fetch source types", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    // Transform formData to match backend expectations
    const payload = {
      areaId: formData.branch.areaId,
      branchName: formData.branch.branchName,
      sourceTypes: formData.sourceTypes.map(st => ({
        id: st.id,
        sourceNames: formData.sourceNames
          .filter(sn => sn.sourceTypeId === st.id)
          .map(sn => sn.sourceName)
      }))
    };
    try {
      await axios.post(
        "http://localhost:5000/api/branch/full-create",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Branch and all related data saved successfully!");
      resetForm();
      setShowModal(false);
      // Refresh branches list
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get("http://localhost:5000/api/branches", config);
      setBranches(res.data);
    } catch (err: any) {
      alert("Failed to save: " + (err.response?.data?.message || err.message));
    }
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  // Wrapper functions for modal navigation to match expected signatures
  const handleNextStep = () => handleNext();
  const handlePreviousStep = () => handlePrevious();
  const handleFinalSubmit = () => handleSubmit({ preventDefault: () => {} } as React.FormEvent);

  const handleStepSubmit = async () => {
    if (currentStep === 1) {
      // Simulate branch submit (replace with your actual submit logic)
      await handleSubmit({ preventDefault: () => {} } as React.FormEvent);
      setConfirmMessage('Branch created! Proceed to add source names?');
      setOnConfirmAction(() => () => {
        setCurrentStep(2);
        setShowConfirm(false);
      });
      setShowConfirm(true);
    } else if (currentStep === 2) {
      // Simulate source name submit (replace with your actual submit logic)
      setConfirmMessage('Source names saved! Proceed to Daily/Monthly forms?');
      setOnConfirmAction(() => () => {
        setCurrentStep(3);
        setShowConfirm(false);
      });
      setShowConfirm(true);
    } else if (currentStep === 3) {
      setConfirmMessage('Daily form saved! Proceed to Monthly form?');
      setOnConfirmAction(() => () => {
        setCurrentStep(4);
        setShowConfirm(false);
      });
      setShowConfirm(true);
    } else if (currentStep === 4) {
      // Final submit
      await handleSubmit({ preventDefault: () => {} } as React.FormEvent);
      setShowModal(false);
      setCurrentStep(1);
    }
  };

  const handleCancel = () => setShowConfirm(false);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AddBranchModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onSubmit={handleStepSubmit}
            branch={formData.branch}
            setBranch={updateBranch}
            sourceTypes={formData.sourceTypes}
            setSourceTypes={updateSourceTypes}
            areas={areas}
            handleClear={resetForm}
            allSourceTypes={sourceTypes || []}
          />
        );
      case 2:
        return (
          <AddSourceNameModal
            show={showModal}
            onClose={() => setShowModal(false)}
            branches={branches}
            branchId={selectedBranchId || 0}
            setBranchId={setSelectedBranchId}
            areas={areas}
            sourceNames={formData.sourceNames}
            setSourceNames={updateSourceNames}
            sourceTypes={sourceTypes}
            onPrevious={handlePrevious}
            onNext={handleStepSubmit}
          />
        );
      case 3:
        return (
          <DatasheetModal
            show={showModal}
            title="Forms for Daily Datasheet"
            fields={formData.dailyFields}
            setFields={updateDailyFields as (fields: DailyForm | MonthlyForm) => void}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
            onClose={() => setShowModal(false)}
          />
        );
      case 4:
        return (
          <DatasheetModal
            show={showModal}
            title="Forms for Monthly Datasheet"
            fields={formData.monthlyFields}
            setFields={updateMonthlyFields as (fields: DailyForm | MonthlyForm) => void}
            onPrevious={handlePreviousStep}
            onNext={handleFinalSubmit}
            onClose={() => setShowModal(false)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-xl p-8 w-full max-w-3xl shadow mx-auto mt-16">
      <h2 className="text-3xl font-medium text-center mb-6">Manage Branch</h2>
      <div className="flex justify-end mb-2">
        <button
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
          onClick={() => setShowModal(true)}
        >
          Add Branch
        </button>
      </div>
      {showModal && <BranchFormProgress />}
      {renderCurrentStep()}
      {showModal && (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleStepSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {currentStep === 4 ? 'Submit' : 'Next'}
          </button>
        </div>
      )}
      <ConfirmModal
        show={showConfirm}
        message={confirmMessage}
        onConfirm={onConfirmAction}
        onCancel={handleCancel}
      />
      <div className="w-full overflow-x-auto">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="min-w-[600px] w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">Branch</th>
                <th className="px-4 py-2">Area</th>
                <th className="px-4 py-2">Active</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch) => (
                <tr key={branch.id} className="text-center">
                  <td className="px-4 py-2">{branch.branchName}</td>
                  <td className="px-4 py-2">
                    {areas.find(a => a.id === branch.areaId)?.areaName}
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={branch.isActive}
                      className="accent-green-600 w-5 h-5"
                      readOnly
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ManageBranch: React.FC = () => {
  return (
    <BranchFormProvider>
      <ManageBranchContent />
    </BranchFormProvider>
  );
};

export default ManageBranch;