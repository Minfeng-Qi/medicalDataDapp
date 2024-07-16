const express = require('express');
const { create } = require('ipfs-http-client');
const { Web3 } = require('web3');
const multer = require('multer');
const router = express.Router();
require('dotenv').config();

const ipfs = create({
    host: '127.0.0.1',
    port: 5001,
    protocol: 'http'
  });

const web3 = new Web3('http://localhost:8545');

const contractABI = [
    {
        "anonymous": false,
        "inputs": [
            {
            "indexed": true,
            "internalType": "address",
            "name": "user",
            "type": "address"
            },
            {
            "indexed": false,
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
            }
        ],
        "name": "FileUploaded",
        "type": "event"
    },
    {
        "inputs": [
          {
            "internalType": "string",
            "name": "_ipfsHash",
            "type": "string"
          }
        ],
        "name": "uploadFile",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getFiles",
        "outputs": [
          {
            "internalType": "string[]",
            "name": "",
            "type": "string[]"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    }
];
const contractAddress = "0x2FCa22FF0FD7319a33E8f863a4c0350248439fD3"; // Replace with your contract address
const contract = new web3.eth.Contract(contractABI, contractAddress);

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
      const { address } = req.body;
      if (!req.file) {
        throw new Error('No file uploaded');
      }
      if (!address) {
        throw new Error('No address provided');
      }
  
      const fileBuffer = req.file.buffer;
      console.log('Received file:', req.file);
      console.log('Received address:', address);
  
      const result = await ipfs.add(fileBuffer);
      const ipfsHash = result.path;
      console.log('IPFS hash:', ipfsHash);

      // Estimate gas required for the transaction
      const gasEstimate = await contract.methods.uploadFile(ipfsHash).estimateGas({ from: address });
      console.log('Gas estimate:', gasEstimate);

      // Convert gasEstimate to BigInt and add extra gas as BigInt
      const gasLimit = BigInt(gasEstimate) + BigInt(10000);

      // Send the transaction with the estimated gas limit
      await contract.methods.uploadFile(ipfsHash).send({ from: address, gas: gasLimit.toString() });
      console.log('File uploaded to blockchain with address:', address);
      
      res.status(200).send({ ipfsHash });
    } catch (error) {
        console.error('Error in /upload route:', error);
        res.status(400).send({ error: error.message });
  }
});
  
module.exports = router;