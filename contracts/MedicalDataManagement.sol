// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract MedicalDataManagement {
    struct MedicalData {
        string dataType;
        string dataOwner;
        bytes ipfsCID; // Store as bytes
        string fileContent;
    }

    struct DataRecord {
        string dataType;
        string dataOwner;
        bytes ipfsCID;
        bytes32 dataID;
    }

    mapping(bytes32 => MedicalData) private medicalData;
    mapping(string => bytes32[]) private ownerToDataIDs; // 用于根据dataOwner检索dataID列表
    DataRecord[] private dataList; // 用于存储数据记录列表

    event LogMedicalData(bytes32 indexed dataID, string dataType, string dataOwner, bytes ipfsCID, string fileContent);

    /**
     * @notice Adds medical data to the contract storage
     * @param dataType The type of the medical data
     * @param dataOwner The owner of the medical data
     * @param ipfsCID The IPFS CID of the stored data
     * @param fileContent 文件内容
     * @return dataID The unique identifier of the stored data, hashed using keccak256
     */
    function addData(string memory dataType, string memory dataOwner, string memory ipfsCID, string memory fileContent) public returns (bytes32) {
        // 删除唯一性检查
        // 允许每个dataOwner存储多条数据记录
        bytes32 dataID = keccak256(abi.encodePacked(dataType, dataOwner, ipfsCID));
        
        bytes memory encryptedCID = encryptCID(ipfsCID); // Encrypt the IPFS CID
        medicalData[dataID] = MedicalData(dataType, dataOwner, encryptedCID, fileContent);
        dataList.push(DataRecord(dataType, dataOwner, encryptedCID, dataID)); // 将记录添加到列表中
        ownerToDataIDs[dataOwner].push(dataID); // 记录dataOwner到dataID的映射

        emit LogMedicalData(dataID, dataType, dataOwner, encryptedCID, fileContent);
        return dataID;
    }

    /**
     * @notice Encrypts the IPFS CID
     * @param ipfsCID The IPFS CID to be encrypted
     * @return The encrypted IPFS CID as bytes
     */
    function encryptCID(string memory ipfsCID) internal pure returns (bytes memory) {
        // Simple encryption logic (e.g., convert to bytes and reverse)
        bytes memory cidBytes = bytes(ipfsCID);
        bytes memory encrypted = new bytes(cidBytes.length);
        for (uint i = 0; i < cidBytes.length; i++) {
            encrypted[i] = cidBytes[cidBytes.length - 1 - i];
        }
        return encrypted;
    }

    /**
     * @notice Retrieves medical data from the contract storage
     * @param dataID The unique identifier of the stored data
     * @return The MedicalData struct containing dataType, dataOwner, encrypted ipfsCID, and fileContent
     */
    function getMedicalData(bytes32 dataID) public view returns (MedicalData memory) {
        MedicalData memory data = medicalData[dataID];
        require(bytes(data.dataType).length != 0, "Data does not exist");
        return data;
    }

    /**
     * @notice Retrieves all data IDs for a given data owner
     * @param dataOwner The owner of the medical data
     * @return An array of data IDs
     */
    function getUserDataIDs(string memory dataOwner) public view returns (bytes32[] memory) {
        return ownerToDataIDs[dataOwner];
    }

    /**
     * @notice Retrieves all data records
     * @return An array of DataRecord structs containing dataType, dataOwner, ipfsCID, and dataID
     */
    function getAllDataRecords() public view returns (DataRecord[] memory) {
        return dataList;
    }
}
