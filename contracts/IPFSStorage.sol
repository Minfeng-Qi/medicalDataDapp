// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IPFSStorage {
    mapping (address => string[]) private userFiles;

    event FileUploaded(address indexed user, string ipfsHash);

    function uploadFile(string memory _ipfsHash) public {
        userFiles[msg.sender].push(_ipfsHash);
        emit FileUploaded(msg.sender, _ipfsHash);
    }

    function getFiles() public view returns (string[] memory) {
        return userFiles[msg.sender];
    }
}