import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const columns = [
  "Month",
  "Year",
  "Source Type",
  "Production Volume",
  "Operation Hours",
  "Number of Service Interruptions",
  "Total Number of Hours of Service Interruption",
  "Electricity Consumption",
  "Electricity Cost",
  "Bulk Cost",
  "Bulk Outtake",
  "Name of Bulk Provider",
  "WTP Raw Water Cost"
];

const extensionColumns = [
  "WTP Raw Water Volume",
  "Method of Disinfection",
  "Disinfectant Cost",
  "Disinfection Amount",
  "Brand and Type of Disinfectant",
  "Other Treatment Cost",
  "Liters Consumed Emergency Operations",
  "Fuel Cost Emergency Operations",
  "Total Hours Used Emergency Operations",
  "Liters Consumed Genset Operated",
  "Fuel Cost Genset Operated"
];

const MonthlyCollectionSheet: React.FC = () => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [sourceTypes, setSourceTypes] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedSourceType, setSelectedSourceType] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:5000/api/source-types", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      console.log("Source types response:", res.data);
      setSourceTypes(res.data);
    });
    axios.get("http://localhost:5000/api/branches", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      console.log("Branches response:", res.data);
      setBranches(res.data);
    });
  }, [token]);

  useEffect(() => {
    // Only fetch if both are selected
    if (selectedSourceType && selectedBranch) {
      setLoading(true);
      axios.get("http://localhost:5000/api/monthly-data", {
        params: {
          sourceTypeId: selectedSourceType,
          branchId: selectedBranch,
        },
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setTableData(res.data);
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      setTableData([]);
    }
  }, [selectedSourceType, selectedBranch, token]);

  const handleRowClick = (rowIdx: number) => {
    setExpandedRow(expandedRow === rowIdx ? null : rowIdx);
  };

  // Filter data by selectedDate
  const filteredData = selectedDate
    ? tableData.filter(row => {
        if (!row.date) return false;
        const rowDate = new Date(row.date).toISOString().slice(0, 10);
        const selected = selectedDate.toISOString().slice(0, 10);
        return rowDate === selected;
      })
    : tableData;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 rounded-2xl">
      <h1 className="text-3xl font-semibold mb-8 mt-2">Monthly Collection Sheet</h1>
      <div className="flex flex-row gap-4 mb-4 w-full max-w-6xl justify-between">
        <div className="flex gap-2 items-center">
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            className="border rounded-lg px-4 py-2 bg-gray-100"
            dateFormat="yyyy-MM-dd"
            placeholderText="Select a date"
            isClearable
          />
          <span className="ml-2">📅</span>
        </div>
        <div className="flex gap-2">
          <select
            className="border rounded px-2 py-1"
            value={selectedSourceType}
            onChange={e => setSelectedSourceType(e.target.value)}
          >
            <option value="">Source Type</option>
            {Array.isArray(sourceTypes) && sourceTypes.map((type: any) => (
              <option key={type.id} value={type.id}>{type.sourceType}</option>
            ))}
          </select>
          <select
            className="border rounded px-2 py-1"
            value={selectedBranch}
            onChange={e => setSelectedBranch(e.target.value)}
          >
            <option value="">Branch</option>
            {Array.isArray(branches) && branches.map((branch: any) => (
              <option key={branch.id} value={branch.id}>{branch.branchName}</option>
            ))}
          </select>
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
            Add
          </button>
        </div>
      </div>
      <div className="overflow-x-auto w-full max-w-6xl">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 border"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-gray-400">
                  Loading data...
                </td>
              </tr>
            )}
            {!loading && filteredData.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-gray-400">
                  No data available.
                </td>
              </tr>
            )}
            {!loading && filteredData.map((row, idx) => (
              <React.Fragment key={row.id}>
                <tr
                  className="cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => handleRowClick(idx)}
                >
                  {columns.map((col) => (
                    <td key={col} className="px-3 py-2 border text-sm">
                      {(row as any)[col]}
                    </td>
                  ))}
                </tr>
                {expandedRow === idx && (
                  <tr>
                    <td colSpan={columns.length} className="bg-gray-900">
                      <div className="flex flex-col p-4">
                        <div className="text-gray-200 font-semibold mb-2">
                          Table Extension &gt; Monthly
                        </div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full">
                            <thead>
                              <tr>
                                {extensionColumns.map((col) => (
                                  <th
                                    key={col}
                                    className="px-3 py-2 text-xs font-semibold text-gray-100 bg-gray-800 border"
                                  >
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                {extensionColumns.map((col) => (
                                  <td
                                    key={col}
                                    className="px-3 py-2 border text-gray-200 bg-gray-700"
                                  >
                                    {(row.extension as any)[col]}
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyCollectionSheet;