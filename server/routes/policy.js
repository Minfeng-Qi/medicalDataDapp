const express = require('express');
const { Web3 } = require('web3');
const router = express.Router();
require('dotenv').config();

const web3 = new Web3('http://localhost:7545');
const policyABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "enum Policy.DataType",
        "name": "",
        "type": "uint8"
      }
    ],
    "name": "doctorHasAccess",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "pure",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "enum Policy.DataType",
        "name": "dataType",
        "type": "uint8"
      }
    ],
    "name": "nurseHasAccess",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "patientID",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "dataOwnerID",
        "type": "string"
      },
      {
        "internalType": "enum Policy.DataType",
        "name": "dataType",
        "type": "uint8"
      }
    ],
    "name": "patientHasAccess",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];
const policyAddress = "0x26cb317dC21a056e33b955D1c73d7C53ED08E608";
const policyContract = new web3.eth.Contract(policyABI, policyAddress);

router.get('/doctorHasAccess', async (req, res) => {
  const { userDepartment, dataType } = req.query;
  try {
    const hasAccess = await policyContract.methods.doctorHasAccess(userDepartment, dataType).call();
    res.status(200).send({ hasAccess });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get('/nurseHasAccess', async (req, res) => {
  const { dataType } = req.query;
  try {
    const hasAccess = await policyContract.methods.nurseHasAccess(dataType).call();
    res.status(200).send({ hasAccess });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get('/patientHasAccess', async (req, res) => {
  const { patientID, dataOwnerID } = req.query;
  try {
    const hasAccess = await policyContract.methods.patientHasAccess(patientID, dataOwnerID).call();
    res.status(200).send({ hasAccess });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
