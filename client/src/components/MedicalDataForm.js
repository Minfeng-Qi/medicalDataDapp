import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Web3 from 'web3';

const MedicalDataForm = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [address, setAddress] = useState('');
  const [dataOwner, setDataOwner] = useState('');
  const [dataType, setDataType] = useState('');

  useEffect(() => {
    const web3Instance = new Web3('http://localhost:7545');
    web3Instance.eth.getAccounts()
      .then(accounts => {
        setAddress(accounts[0]);
      })
      .catch(err => {
        setStatus(`Error: ${err.message}`);
      });
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddData = async (e) => {
    e.preventDefault();

    if (!file) {
      setStatus('Please select a file first.');
      return;
    }

    if (!dataOwner || !dataType) {
      setStatus('Please enter data owner and data type.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('address', address);
      formData.append('dataOwner', dataOwner);
      formData.append('dataType', dataType);

      const response = await axios.post('http://localhost:5000/api/medicalData/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setStatus(`File uploaded to IPFS with hash: ${response.data.ipfsHash}`);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleAddData}>
      <label htmlFor="fileInput">Select File:</label>
      <input type="file" id="fileInput" onChange={handleFileChange} />
      
      <label htmlFor="dataOwner">Data Owner:</label>
      <input type="text" id="dataOwner" value={dataOwner} onChange={(e) => setDataOwner(e.target.value)} />
      
      <label htmlFor="dataType">Data Type:</label>
      <input type="text" id="dataType" value={dataType} onChange={(e) => setDataType(e.target.value)} />
      
      <button type="submit">Add Data</button>
      <div>{status}</div>
    </form>
  );
};

export default MedicalDataForm;
