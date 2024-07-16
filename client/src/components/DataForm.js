import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Web3 from 'web3';

const DataForm = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    const web3Instance = new Web3('http://localhost:8545');
    console.log('Web3 instance created:', web3Instance);

    web3Instance.eth.getAccounts()
      .then(accounts => {
        setAddress(accounts[0]);
        console.log('Ethereum accounts:', accounts);
      })
      .catch(err => {
        setStatus(`Error: ${err.message}`);
        console.log('Error fetching accounts:', err);
      });
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log('Selected file:', e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');

    if (!file) {
      setStatus('Please select a file first.');
      console.log('No file selected');
      return;
    }

    try {
      console.log('Uploading file:', file);
      const formData = new FormData();
      formData.append('file', file);  // Ensure this name matches 'file' in upload.single('file')
      formData.append('address', address);

      console.log('Form data:', formData.get('file'), formData.get('address'));

      const response = await axios.post('http://localhost:5001/api/ipfs/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('File uploaded to IPFS, response:', response);
      setStatus(`File uploaded to IPFS with hash: ${response.data.ipfsHash}`);
    } catch (error) {
      console.log('Error uploading file:', error.response || error.message || error);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="fileInput">Select File:</label>
      <input type="file" id="fileInput" onChange={handleFileChange} />
      <button type="submit">Upload</button>
      <div>{status}</div>
    </form>
  );
};

export default DataForm;