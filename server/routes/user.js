const express = require('express');
const { Web3 } = require('web3');
const router = express.Router();
require('dotenv').config();

const web3 = new Web3('http://localhost:7545'); // 确保Ganache正在运行，并且端口正确

const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "userID",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "userName",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "userAddress",
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
    "name": "UserAdded",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "lastUserID",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
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
        "name": "userName",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "role",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "department",
        "type": "string"
      }
    ],
    "name": "addUser",
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
        "name": "userID",
        "type": "bytes32"
      }
    ],
    "name": "deleteUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
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
        "name": "newRole",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "newDepartment",
        "type": "string"
      }
    ],
    "name": "updateUser",
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
        "name": "userID",
        "type": "bytes32"
      }
    ],
    "name": "getUser",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "userName",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "userAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "role",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "department",
            "type": "string"
          }
        ],
        "internalType": "struct UserManagement.User",
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
        "internalType": "bytes32",
        "name": "userID",
        "type": "bytes32"
      }
    ],
    "name": "getUserHash",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];
const contractAddress = "0xCf3DbB6D0beD713Be34AB6E3dFc661Db9Bf2ab1c"; // Replace with your contract address
const contract = new web3.eth.Contract(contractABI, contractAddress);

// 添加用户
router.post('/addUser', async (req, res) => {
  try {
    const { userName, userAddress, role, department } = req.body;
    if (!userName || !userAddress || !role || !department) {
      throw new Error('Missing userName, userAddress, role or department');
    }

    // Estimate gas required for the transaction
    const gasEstimate = await contract.methods.addUser(userName, userAddress, role, department).estimateGas({ from: userAddress });

    // 获取当前的 gas 价格
    const gasPrice = await web3.eth.getGasPrice();

    // Send the transaction with the estimated gas limit and gas price
    const result = await contract.methods.addUser(userName, userAddress, role, department)
      .send({ from: userAddress, gas: gasEstimate, gasPrice });

    // 手动捕获事件
    const events = await contract.getPastEvents('UserAdded', {
      fromBlock: result.blockNumber,
      toBlock: result.blockNumber // 确保只查找相关区块
    });

    if (events.length === 0) {
      throw new Error('UserAdded event not found in transaction receipt or past events');
    }

    const userID = events[0].returnValues.userID;
    res.status(200).send({ userID });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// 删除用户
router.post('/deleteUser', async (req, res) => {
  try {
    const { userID } = req.body;
    if (!userID) {
      throw new Error('Missing userID');
    }

    // 获取用户地址
    const accounts = await web3.eth.getAccounts();
    const fromAddress = accounts[0];

    // Estimate gas required for the transaction
    const gasEstimate = await contract.methods.deleteUser(userID).estimateGas({ from: fromAddress });

    // 获取当前的 gas 价格
    const gasPrice = await web3.eth.getGasPrice();

    // Send the transaction with the estimated gas limit and gas price
    await contract.methods.deleteUser(userID).send({ from: fromAddress, gas: gasEstimate, gasPrice });

    res.status(200).send({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// 更新用户
router.post('/updateUser', async (req, res) => {
  try {
    const { userID, newRole, newDepartment } = req.body;
    if (!userID || !newRole || !newDepartment) {
      throw new Error('Missing userID, newRole or newDepartment');
    }

    // 获取用户地址
    const accounts = await web3.eth.getAccounts();
    const fromAddress = accounts[0];

    // Estimate gas required for the transaction
    const gasEstimate = await contract.methods.updateUser(userID, newRole, newDepartment).estimateGas({ from: fromAddress });

    // 获取当前的 gas 价格
    const gasPrice = await web3.eth.getGasPrice();

    // Send the transaction with the estimated gas limit and gas price
    const result = await contract.methods.updateUser(userID, newRole, newDepartment).send({ from: fromAddress, gas: gasEstimate, gasPrice });

    // 手动捕获事件
    const events = await contract.getPastEvents('UserUpdated', {
      fromBlock: result.blockNumber,
      toBlock: result.blockNumber // 确保只查找相关区块
    });

    if (events.length === 0) {
      throw new Error('UserUpdated event not found in transaction receipt or past events');
    }

    const newUserID = events[0].returnValues.newUserID;
    res.status(200).send({ newUserID });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});


module.exports = router;
