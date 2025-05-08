import { useEffect, useState } from "react";
import axios from "axios";
import AddBranchModal from "../components/AddBranchModal";
import AddSourceNameModal from "../components/AddSourceNameModal";
import DatasheetModal from "../components/DailyDataSheetModal";

interface Branch {
  id: number;
  branchName: string;
  areaId: number;
  isActive: boolean;
}

interface Area {
  id: number;
  areaName: string;
}

interface SourceName {
  id: number;
  sourceName: string;
}

const sourceTypesList = [
  "Deep Well - Electric",
  "Deep Well - Genset Operated",
  "Shallow Well",
  "Spring - Gravity",
  "Spring - Power-driven",
  "Bulk",
  "WTP",
  "Booster"
];

const dailyFields = [
  "Production Volume",
  "Operation Hours",
  "Number of Service Interruptions",
  "Electricity Consumption",
  "VFD Frequency",
  "Spot Flow",
  "Spot Pressure",
  "Time Spot Measurements were Taken",
  "Line Voltage [L1-L2]",
  "Line Voltage [L2-L3]",
  "Line Voltage [L3-L1]",
  "Line Current [L1-L2]",
  "Line Current [L2-L3]",
  "Line Current [L3-L1]",
];

const monthlyFields = [
  "Production Volume",
  "Operation Hours",
  "Number of Service Interruptions",
  "Total Number of Hours of Service Interruption",
  "Electricity Consumption",
  "Electricity Cost",
  "Bulk Cost",
  "Name of Bulk Provider",
  "WTP Raw Water Cost",
  "WTP Raw Water Source",
  "WTP Raw Water Volume",
  "Method of Disinfection",
  "Disinfectant Cost",
  "Disinfection Amount",
  "Other Treatment Cost",
  "Liters Consumed - Emergency Operations",
  "Fuel Cost - Emergency Operations",
  "Total Hours Used - Emergency Operations",
  "Liters Consumed - Genset Operated",
  "Fuel Cost - Genset Operated"
];

export default function ManageBranch() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  // Modal state and form state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    areaId: "",
    branchName: "",
    sourceTypes: [] as string[]
  });

  // Source Name Modal state
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [sourceNames, setSourceNames] = useState<SourceName[]>([]);
  const [newSourceName, setNewSourceName] = useState("");

  // Datasheet Modal state
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [showMonthlyModal, setShowMonthlyModal] = useState(false);
  const [selectedSourceType, setSelectedSourceType] = useState("");
  const [dailyFieldsState, setDailyFieldsState] = useState<{ [key: string]: boolean }>({});
  const [monthlyFieldsState, setMonthlyFieldsState] = useState<{ [key: string]: boolean }>({});

  const handleClear = () => setForm({ areaId: "", branchName: "", sourceTypes: [] });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);
    handleClear();
    setShowSourceModal(true); // Show AddSourceNameModal after Next
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    axios.get("http://localhost:5000/api/branches", config)
      .then(res => setBranches(res.data))
      .catch(err => console.error("Failed to fetch branches", err));

    axios.get("http://localhost:5000/api/areas", config)
      .then(res => setAreas(res.data))
      .catch(err => console.error("Failed to fetch areas", err));
  }, []);

  // Helper to get area name by id
  const getAreaName = (areaId: number) => {
    const area = areas.find(a => a.id === areaId);
    return area ? area.areaName : "";
  };

  // Add handleFullSave function
  const handleFullSave = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/api/branch/full-create",
        {
          branch: {
            areaId: form.areaId,
            branchName: form.branchName,
            isActive: true, // or from your form
          },
          sourceNames: sourceNames.map(sn => ({ sourceName: sn.sourceName })),
          daily: {
            selectedSourceType,
            fields: dailyFieldsState,
          },
          monthly: {
            fields: monthlyFieldsState,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Branch and all related data saved successfully!");
      setShowMonthlyModal(false);
      setForm({ areaId: "", branchName: "", sourceTypes: [] });
      setSourceNames([]);
      setDailyFieldsState({});
      setMonthlyFieldsState({});
      // Optionally, refresh branches
      const config = { headers: { Authorization: `Bearer ${token}` } };
      axios.get("http://localhost:5000/api/branches", config)
        .then(res => setBranches(res.data))
        .catch(err => console.error("Failed to fetch branches", err));
    } catch (err: any) {
      alert("Failed to save: " + (err.response?.data?.message || err.message));
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
      <div className="overflow-x-auto">
        <table className="min-w-full">
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
                <td className="px-4 py-2">{getAreaName(branch.areaId)}</td>
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
      <AddBranchModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        areas={areas}
        handleClear={handleClear}
      />
      <AddSourceNameModal
        show={showSourceModal}
        onClose={() => setShowSourceModal(false)}
        sourceNames={sourceNames}
        setSourceNames={setSourceNames}
        newSourceName={newSourceName}
        setNewSourceName={setNewSourceName}
        onPrevious={() => {
          setShowSourceModal(false);
          setShowModal(true);
        }}
        onNext={() => {
          setShowSourceModal(false);
          setShowDailyModal(true);
        }}
      />
      <DatasheetModal
        show={showDailyModal}
        title="Forms for Daily Datasheet"
        fieldsList={dailyFields}
        fields={dailyFieldsState}
        setFields={setDailyFieldsState}
        sourceTypes={sourceTypesList}
        selectedSourceType={selectedSourceType}
        setSelectedSourceType={setSelectedSourceType}
        onPrevious={() => {
          setShowDailyModal(false);
          setShowSourceModal(true);
        }}
        onNext={() => {
          setShowDailyModal(false);
          setShowMonthlyModal(true);
        }}
        onClose={() => setShowDailyModal(false)}
      />
      <DatasheetModal
        show={showMonthlyModal}
        title="Forms for Monthly Datasheet"
        fieldsList={monthlyFields}
        fields={monthlyFieldsState}
        setFields={setMonthlyFieldsState}
        onPrevious={() => {
          setShowMonthlyModal(false);
          setShowDailyModal(true);
        }}
        onNext={handleFullSave}
        onClose={() => setShowMonthlyModal(false)}
      />
    </div>
  );
}