import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageBranch.css';

interface Branch {
  id: number;
  areaId: number;
  branchCode: number;
  branchName: string;
  isActive: boolean;
}

interface Area {
  id: number;
  areaCode: number;
  areaName: string;
  isActive: boolean;
}

const ManageBranch: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
      try {
        const [branchesRes, areasRes] = await Promise.all([
          axios.get('/api/branches', { headers }),
          axios.get('/api/areas', { headers }),
        ]);
        console.log('branchesRes.data:', branchesRes.data);
        console.log('areasRes.data:', areasRes.data);
        if (Array.isArray(branchesRes.data)) {
          setBranches(branchesRes.data);
        } else {
          setBranches([]);
          alert('Branches API did not return an array: ' + JSON.stringify(branchesRes.data));
        }
        if (Array.isArray(areasRes.data)) {
          setAreas(areasRes.data);
        } else {
          setAreas([]);
          alert('Areas API did not return an array: ' + JSON.stringify(areasRes.data));
        }
      } catch (error) {
        alert('Failed to fetch branches or areas');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getAreaName = (areaId: number) => {
    const area = areas.find(a => a.id === areaId);
    return area ? area.areaName : 'Unknown';
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="manage-branch-container">
      <h2>Manage Branch</h2>
      <button className="add-btn">Add Branch</button>
      <table className="branch-table">
        <thead>
          <tr>
            <th>Branch</th>
            <th>Area</th>
            <th>Active</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(branches) && branches.length > 0 ? (
            branches.map(branch => (
              <tr key={branch.id}>
                <td>{branch.branchName}</td>
                <td>{getAreaName(branch.areaId)}</td>
                <td>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={branch.isActive} readOnly />
                    <span className="slider"></span>
                  </label>
                </td>
                <td>
                  <button className="edit-btn">Edit</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No branches found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBranch; 