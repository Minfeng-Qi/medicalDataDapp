import React, { useState } from 'react';
import axios from 'axios';

const GetUser = () => {
  const [userID, setUserID] = useState('');
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`http://localhost:5000/api/users/getUser/${userID}`);
      setUser(response.data);
      setStatus('User fetched successfully');
    } catch (error) {
      setStatus(`Error: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  return (
    <div>
      <h1>Get User</h1>
      <form onSubmit={handleSubmit}>
        <label>
          User ID:
          <input type="text" value={userID} onChange={(e) => setUserID(e.target.value)} />
        </label>
        <button type="submit">Get User</button>
      </form>
      {status && <p>{status}</p>}
      {user && (
        <div>
          <p>User Name: {user.userName}</p>
          <p>User Address: {user.userAddress}</p>
          <p>Role: {user.role}</p>
          <p>Department: {user.department}</p>
        </div>
      )}
    </div>
  );
};

export default GetUser;
