import React, { useState } from 'react';
import axios from 'axios';

const PolicyCheck = () => {
  const [userDepartment, setUserDepartment] = useState('');
  const [dataType, setDataType] = useState('');
  const [patientID, setPatientID] = useState('');
  const [dataOwnerID, setDataOwnerID] = useState('');
  const [accessStatus, setAccessStatus] = useState('');

  const checkDoctorAccess = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/policy/doctorHasAccess', {
        params: { userDepartment, dataType }
      });
      setAccessStatus(`Doctor access: ${response.data.hasAccess}`);
    } catch (error) {
      setAccessStatus(`Error: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  const checkNurseAccess = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/policy/nurseHasAccess', {
        params: { dataType }
      });
      setAccessStatus(`Nurse access: ${response.data.hasAccess}`);
    } catch (error) {
      setAccessStatus(`Error: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  const checkPatientAccess = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/policy/patientHasAccess', {
        params: { patientID, dataOwnerID }
      });
      setAccessStatus(`Patient access: ${response.data.hasAccess}`);
    } catch (error) {
      setAccessStatus(`Error: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  return (
    <div>
      <h1>Policy Check</h1>
      <div>
        <label>
          User Department:
          <input type="text" value={userDepartment} onChange={(e) => setUserDepartment(e.target.value)} />
        </label>
        <label>
          Data Type:
          <input type="text" value={dataType} onChange={(e) => setDataType(e.target.value)} />
        </label>
        <button onClick={checkDoctorAccess}>Check Doctor Access</button>
        <button onClick={checkNurseAccess}>Check Nurse Access</button>
      </div>
      <div>
        <label>
          Patient ID:
          <input type="text" value={patientID} onChange={(e) => setPatientID(e.target.value)} />
        </label>
        <label>
          Data Owner ID:
          <input type="text" value={dataOwnerID} onChange={(e) => setDataOwnerID(e.target.value)} />
        </label>
        <button onClick={checkPatientAccess}>Check Patient Access</button>
      </div>
      <p>{accessStatus}</p>
    </div>
  );
};

export default PolicyCheck;
