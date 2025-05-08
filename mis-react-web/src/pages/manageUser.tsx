import { useEffect, useState } from "react";
import axios from "axios";
import AddUserModal from "../components/AddUserModal";

// Define a User type for type safety
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  areaName?: string;
  branchName?: string;
  roleName?: string;
  isActive: boolean;
  username: string;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    role: "",
    branch: "",
    area: "",
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: ""
  });
  const [areas, setAreas] = useState([]);
  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);

  const handleClear = () => {
    setForm({
      role: "",
      branch: "",
      area: "",
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: ""
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the payload for the backend
    const payload = {
      userName: form.username,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      roleId: Number(form.role),
      areaId: Number(form.area),
      branchId: Number(form.branch),
    };

    try {
      await axios.post("http://localhost:5000/api/auth/register", payload);
      // Optionally, fetch users again to update the table
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get("http://localhost:5000/api/users", config);
      setUsers(res.data);
      setShowModal(false);
      handleClear();
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
        "Failed to create user. Please check your input."
      );
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    axios.get("http://localhost:5000/api/users", config)
      .then(res => setUsers(res.data))
      .catch(err => {
        console.error("Failed to fetch users", err);
      });

    axios.get("http://localhost:5000/api/areas", config)
      .then(res => setAreas(res.data))
      .catch(err => console.error("Failed to fetch areas", err));

    axios.get("http://localhost:5000/api/roles", config)
      .then(res => setRoles(res.data))
      .catch(err => console.error("Failed to fetch roles", err));

    axios.get("http://localhost:5000/api/branches", config)
      .then(res => setBranches(res.data))
      .catch(err => console.error("Failed to fetch branches", err));
  }, []);

  return (
    <div className="rounded-xl p-8 w-full max-w-5xl shadow mx-auto mt-16">
      <h2 className="text-3xl font-medium text-center mb-6">Manage Users</h2>
      <div className="flex justify-end mb-2">
        <button
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
          onClick={() => setShowModal(true)}
        >
          Add User
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">First Name</th>
              <th className="px-4 py-2">Last Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Area</th>
              <th className="px-4 py-2">Branch</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Active</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.id || idx} className="text-center">
                <td className="px-4 py-2">{user.firstName}</td>
                <td className="px-4 py-2">{user.lastName}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.areaName || ""}</td>
                <td className="px-4 py-2">{user.branchName || ""}</td>
                <td className="px-4 py-2">{user.roleName || ""}</td>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={user.isActive}
                    className="accent-green-600 w-5 h-5"
                    readOnly
                  />
                </td>
                <td className="px-4 py-2">{user.username}</td>
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
      <AddUserModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        handleClear={handleClear}
        areas={areas}
        roles={roles}
        branches={branches}
      />
    </div>
  );
}