const express = require('express');
const router = express.Router();
const { Web3 } = require('web3');
require('dotenv').config();

const web3 = new Web3('http://localhost:7545');

const contractABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "userManagementAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "medicalDataManagementAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "policyAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
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
        "name": "reason",
        "type": "string"
      }
    ],
    "name": "LogAccessDenied",
    "type": "event"
  },
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
        "indexed": true,
        "internalType": "bytes32",
        "name": "patientID",
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
        "name": "ipfsCID",
        "type": "string"
      }
    ],
    "name": "LogDataAccessed",
    "type": "event"
  },
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
        "name": "role",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "department",
        "type": "string"
      }
    ],
    "name": "LogUserLoggedIn",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "userID",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "dataOwner",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "dataType",
        "type": "string"
      }
    ],
    "name": "loginUserAndAccessData",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const contractAddress = "0x73007dC9d7736d57deDb80ACfceC60A3ebdBEe56"; // 确保这是正确的合约地址
const contract = new web3.eth.Contract(contractABI, contractAddress);

router.post('/loginUserAndViewPatientData', async (req, res) => {
  try {
      console.log('Received request body:', req.body); // 打印接收到的请求体以进行调试

      const { userID, patientName, dataType } = req.body;

      // 检查必需参数是否存在
      if (!userID || !patientName || !dataType) {
          throw new Error('Missing userID, patientName, or dataType');
      }

      // 传递到合约时明确表示 dataOwner
      const dataOwner = patientName;

      // 估算 gas 消耗
      const gasEstimate = await contract.methods.loginUserAndAccessData(userID, dataOwner, dataType).estimateGas({ from: web3.eth.accounts[0] });
      const gasPrice = await web3.eth.getGasPrice();

      // 调用合约方法
      const result = await contract.methods.loginUserAndAccessData(userID, dataOwner, dataType)
          .send({ from: web3.eth.accounts[0], gas: gasEstimate, gasPrice });

      console.log('Transaction result:', result);

      const fileContent = result.events.LogDataAccessed.returnValues.fileContent;
      res.status(200).send({ fileContent });
  } catch (error) {
      console.error('Error in /loginUserAndViewPatientData route:', error);
      res.status(400).send({ error: error.message });
  }
});



module.exports = router;
