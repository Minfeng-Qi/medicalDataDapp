const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const { Web3 } = require('web3');
const multer = require('multer');
const router = express.Router();
require('dotenv').config();

const web3 = new Web3('http://localhost:7545');

const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "dataID",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "dataType",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "dataOwner",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "ipfsCID",
        "type": "bytes"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "fileContent",
        "type": "string"
      }
    ],
    "name": "LogMedicalData",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "dataType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "dataOwner",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "ipfsCID",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "fileContent",
        "type": "string"
      }
    ],
    "name": "addData",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "dataID",
        "type": "bytes32"
      }
    ],
    "name": "getMedicalData",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "dataType",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "dataOwner",
            "type": "string"
          },
          {
            "internalType": "bytes",
            "name": "ipfsCID",
            "type": "bytes"
          },
          {
            "internalType": "string",
            "name": "fileContent",
            "type": "string"
          }
        ],
        "internalType": "struct MedicalDataManagement.MedicalData",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "dataOwner",
        "type": "string"
      }
    ],
    "name": "getUserDataIDs",
    "outputs": [
      {
        "internalType": "bytes32[]",
        "name": "",
        "type": "bytes32[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getAllDataRecords",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "dataType",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "dataOwner",
            "type": "string"
          },
          {
            "internalType": "bytes",
            "name": "ipfsCID",
            "type": "bytes"
          },
          {
            "internalType": "bytes32",
            "name": "dataID",
            "type": "bytes32"
          }
        ],
        "internalType": "struct MedicalDataManagement.DataRecord[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];

const contractAddress = "0xF37D7fec1c839e1A45b23CbFc2eD8FFF47b33791"; // 确保这是一个有效的合约地址
const contract = new web3.eth.Contract(contractABI, contractAddress);

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
      const { address, dataOwner, dataType } = req.body;
      if (!req.file) {
          throw new Error('No file uploaded');
      }
      if (!address || !dataOwner || !dataType) {
          throw new Error('Missing address, dataOwner or dataType');
      }

      const fileBuffer = req.file.buffer;
      const fileContent = fileBuffer.toString('utf8');
      console.log('Received file:', req.file);
      console.log('Received address:', address);
      console.log('Received dataOwner:', dataOwner);
      console.log('Received dataType:', dataType);
      console.log('File content:', fileContent);

      const formData = new FormData();
      formData.append('file', fileBuffer, req.file.originalname);

      const ipfsUrl = 'http://127.0.0.1:5001/api/v0/add';

      // 使用 axios 发送 IPFS 请求
      const ipfsResponse = await axios.post(ipfsUrl, formData, {
          headers: {
              ...formData.getHeaders()
          }
      });

      const ipfsHash = ipfsResponse.data.Hash;
      console.log('IPFS hash:', ipfsHash);

      // Estimate gas required for the transaction
      const gasEstimate = await contract.methods.addData(dataType, dataOwner, ipfsHash, fileContent).estimateGas({ from: address });
      console.log('Gas estimate:', gasEstimate);

      // 获取当前的 gas 价格
      const gasPrice = await web3.eth.getGasPrice();
      console.log('Gas price:', gasPrice);

      // Send the transaction with the estimated gas limit and gas price
      await contract.methods.addData(dataType, dataOwner, ipfsHash, fileContent).send({ from: address, gas: gasEstimate, gasPrice });
      console.log('File uploaded to blockchain with address:', address);

      res.status(200).send({ ipfsHash });
  } catch (error) {
      console.error('Error in /upload route:', error);
      res.status(400).send({ error: error.message });
  }
});


module.exports = router;
