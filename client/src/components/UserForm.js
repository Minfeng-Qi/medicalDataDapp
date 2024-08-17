import React, { useState } from 'react';
import axios from 'axios';

const UserForm = () => {
  const [userName, setUserName] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [userID, setUserID] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [status, setStatus] = useState('');

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/user/addUser', {
        userName,
        userAddress,
        role,
        department,
      });
      setStatus(`User added successfully. User ID: ${response.data.userID}`);
    } catch (error) {
      setStatus(`Error: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/user/deleteUser', { userID });
      setStatus('User deleted successfully.');
    } catch (error) {
      setStatus(`Error: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/user/updateUser', {
        userID,
        newRole,
        newDepartment,
      });
      setStatus(`User updated successfully. New User ID: ${response.data.newUserID}`);
    } catch (error) {
      setStatus(`Error: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  return (
    <div>
      <h2>User Management</h2>
      <form onSubmit={handleAddUser}>
        <label>
          User Name:
          <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
        </label>
        <br />
        <label>
          User Address:
          <input type="text" value={userAddress} onChange={(e) => setUserAddress(e.target.value)} />
        </label>
        <br />
        <label>
          Role:
          <input type="text" value={role} onChange={(e) => setRole(e.target.value)} />
        </label>
        <br />
        <label>
          Department:
          <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} />
        </label>
        <br />
        <button type="submit">Add User</button>
      </form>
      <br />
      <form onSubmit={handleDeleteUser}>
        <label>
          User ID:
          <input type="text" value={userID} onChange={(e) => setUserID(e.target.value)} />
        </label>
        <br />
        <button type="submit">Delete User</button>
      </form>
      <br />
      <form onSubmit={handleUpdateUser}>
        <label>
          User ID:
          <input type="text" value={userID} onChange={(e) => setUserID(e.target.value)} />
        </label>
        <br />
        <label>
          New Role:
          <input type="text" value={newRole} onChange={(e) => setNewRole(e.target.value)} />
        </label>
        <br />
        <label>
          New Department:
          <input type="text" value={newDepartment} onChange={(e) => setNewDepartment(e.target.value)} />
        </label>
        <br />
        <button type="submit">Update User</button>
      </form>
      <p>{status}</p>
    </div>
  );
};

export default UserForm;
