import React, { useEffect, useState } from 'react';
import { userService, User, areaService, branchService, roleService, authService } from '../services/api';
import AddUserModal from '../components/AddUserModal';

// sdfsasdf
interface Area {
  id: number;
  areaName: string;
}

interface Branch {
  id: number;
  branchName: string;
}

interface Role {
  id: number;
  roleName: string;
}

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addUserOpen, setAddUserOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersData, areasData, branchesData, rolesData] = await Promise.all([
        userService.getAllUsers(),
        areaService.getAllAreas(),
        branchService.getAllBranches(),
        roleService.getAllRoles()
      ]);
      setUsers(usersData);
      setAreas(areasData);
      setBranches(branchesData);
      setRoles(rolesData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getAreaName = (areaId: number) => {
    const area = areas.find(a => a.id === areaId);
    return area ? area.areaName : 'N/A';
  };

  const getBranchName = (branchId: number) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.branchName : 'N/A';
  };

  const getRoleName = (roleId: number) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.roleName : 'N/A';
  };

  return (
    <>
      <div className="bg-gray-200 min-h-screen rounded-xl p-8">
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Manage Users</h2>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
          <button
            style={{ background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 20px', fontWeight: 'bold', cursor: 'pointer' }}
            onClick={() => setAddUserOpen(true)}
          >
            Add User
          </button>
        </div>
        <div style={{ overflowX: 'auto', background: 'white', borderRadius: '8px', padding: '16px' }}>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div style={{ color: 'red' }}>{error}</div>
          ) : users.length === 0 ? (
            <div>No users found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f3f4f6' }}>
                  <th style={thStyle}>First Name</th>
                  <th style={thStyle}>Last Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Area</th>
                  <th style={thStyle}>Branch</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}>Active</th>
                  <th style={thStyle}>Username</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: User) => (
                  <tr key={user.id} style={{ textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>
                    <td style={tdStyle}>{user.firstName}</td>
                    <td style={tdStyle}>{user.lastName}</td>
                    <td style={tdStyle}>{user.email}</td>
                    <td style={tdStyle}>{getAreaName(user.areaId || 0)}</td>
                    <td style={tdStyle}>{getBranchName(user.branchId || 0)}</td>
                    <td style={tdStyle}>{getRoleName(user.roleId || 0)}</td>
                    <td style={tdStyle}>
                      <input type="checkbox" checked={user.isActive} readOnly style={{ accentColor: '#16a34a' }} />
                    </td>
                    <td style={tdStyle}>{user.userName}</td>
                    <td style={tdStyle}>
                      <button style={{ background: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', padding: '4px 16px', cursor: 'pointer' }}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <AddUserModal
        open={addUserOpen}
        onClose={() => setAddUserOpen(false)}
        onCreate={async (form) => {
          try {
            await authService.register({
              ...form,
              areaId: Number(form.areaId),
              branchId: Number(form.branchId),
              roleId: Number(form.roleId),
            });
            setAddUserOpen(false);
            fetchData();
          } catch (err) {
            alert('Failed to create user');
          }
        }}
        roles={roles}
        branches={branches}
        areas={areas}
      />
    </>
  );
};

const thStyle: React.CSSProperties = {
  padding: '8px',
  fontWeight: 'bold',
  borderBottom: '2px solid #e5e7eb',
};

const tdStyle: React.CSSProperties = {
  padding: '8px',
};

export default ManageUsers; 