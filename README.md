# Medical Data DApp

## Overview

This project demonstrates a decentralized application (DApp) that allows users to upload medical files to IPFS and record the IPFS hash on the Ethereum blockchain. The frontend is built with React, and the backend is built with Node.js and Express. The smart contract is developed using Solidity and deployed with Truffle. Ganache is used as the local Ethereum blockchain for development and testing.

## Project Architecture

1. **Frontend**:
   - React: User interface for data submission.
   - JavaScript: Handles interactions with IPFS and Ethereum blockchain using Web3.js and IPFS HTTP client.

2. **Backend**:
   - Node.js: Server to interact with the Ethereum blockchain and IPFS.
   - Express.js: Framework for building the backend server.
   - IPFS: Decentralized storage for the data.
   - Ethereum Smart Contract: Manages the submission of IPFS hashes to the blockchain.
   - Truffle Suite: Framework for smart contract development, compilation, and migration.
   - Ganache: Local Ethereum blockchain for development and testing.

## Directory Structure
medical-data-dApp/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── DataForm.js
│   │   ├── App.js
│   │   ├── index.js
│   ├── public/
│   ├── package.json
├── server/
│   ├── routes/
│   │   └── ipfs.js
│   ├── index.js
│   ├── package.json
├── contracts/
│   └── IPFSStorage.sol
├── migrations/
│   ├── 1_initial_migration.js
│   ├── 2_deploy_contracts.js
├── test/
├── truffle-config.js
└── README.md

## Prerequisites

- Node.js
- Truffle
- Ganache (CLI or GUI)
- MetaMask (for interacting with the DApp in a browser)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-repo/ipfs-ethereum-dapp.git
cd ipfs-ethereum-dapp
```

### 2. Install Dependencies

``` bash
cd client
npm install

- 
cd server
npm install
```

### 3. Start Ganache

Start Ganache CLI:

``` bash
ganache-cli
```

### 4. Run IPFS Locally

```bash
brew install ipfs
ipfs init
ipfs daemon
```

### 5. Deploy the Smart Contract

```bash
truffle compile
truffle migrate
```

### 6. Configure the Backend

Update server/routes/ipfs.js with your smart contract’s ABI and address:

```javascript
const contractABI = [
  // Replace with your contract ABI
];
const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your deployed contract address
```

### 7. Start the Backend Server

```bash
cd server
node index.js
```

### 8. Start the React Frontend

```bash
cd client
npm start
```

### 9. Access the DApp

Open your browser and go to http://localhost:3000.