import React, { useState } from "react";
import "./AddUserModal.css";

type AddUserModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (form: UserForm) => void;
  roles: { id: number; roleName: string }[];
  branches: { id: number; branchName: string }[];
  areas: { id: number; areaName: string }[];
};

type UserForm = {
  roleId: string;
  branchId: string;
  areaId: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
};

const initialForm: UserForm = {
  roleId: "",
  branchId: "",
  areaId: "",
  firstName: "",
  lastName: "",
  email: "",
  userName: "",
  password: "",
};

const AddUserModal: React.FC<AddUserModalProps> = ({
  open,
  onClose,
  onCreate,
  roles,
  branches,
  areas,
}) => {
  const [form, setForm] = useState<UserForm>(initialForm);

  if (!open) return null;
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClear = () => setForm(initialForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Add a User</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            Role
            <select
              name="roleId"
              value={form.roleId}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.roleName}</option>
              ))}
            </select>
          </label>
          <label>
            Branch
            <select
              name="branchId"
              value={form.branchId}
              onChange={handleChange}
              required
            >
              <option value="">Select Branch</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>{branch.branchName}</option>
              ))}
            </select>
          </label>
          <label>
            Area
            <select
              name="areaId"
              value={form.areaId}
              onChange={handleChange}
              required
            >
              <option value="">Select Area</option>
              {areas.map(area => (
                <option key={area.id} value={area.id}>{area.areaName}</option>
              ))}
            </select>
          </label>
          <input
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            required
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="userName"
            placeholder="Username"
            value={form.userName}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <div className="modal-buttons">
            <button type="button" className="modal-clear" onClick={handleClear}>
              Clear all
            </button>
            <button type="submit" className="modal-create">
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal; 