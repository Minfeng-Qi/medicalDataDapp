import React, { useState } from 'react';
import axios from 'axios';

const AccessControlForm = () => {
  const [userID, setUserID] = useState('');
  const [patientName, setPatientName] = useState(''); // 确保参数名称与合约中一致
  const [dataType, setDataType] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 调试输出
    console.log("Submitting form with values:");
    console.log("userID:", userID);
    console.log("patientName:", patientName);
    console.log("dataType:", dataType);

    if (!userID || !patientName || !dataType) {
      setStatus('Error: Missing userID, patientName or dataType');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/accessControl/loginUserAndViewPatientData', {
        userID,
        patientName,
        dataType,
      });
      setFileContent(response.data.fileContent);
      setStatus('File accessed successfully');
    } catch (error) {
      setStatus(`Error: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  return (
    <div>
      <h2>Access Control</h2>
      <form onSubmit={handleSubmit}>
        <label>
          User ID:
          <input type="text" value={userID} onChange={(e) => setUserID(e.target.value)} />
        </label>
        <br />
        <label>
          Patient Name:
          <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} /> {/* 确保使用 patientName */}
        </label>
        <br />
        <label>
          Data Type:
          <input type="text" value={dataType} onChange={(e) => setDataType(e.target.value)} />
        </label>
        <br />
        <button type="submit">Check Access</button>
      </form>
      <div>{status}</div>
      <div>{fileContent}</div>
    </div>
  );
};

export default AccessControlForm;
