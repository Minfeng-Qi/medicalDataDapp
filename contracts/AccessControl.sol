// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./UserManagement.sol";
import "./MedicalDataManagement.sol";
import "./Policy.sol";

/**
 * @title AccessControl
 * @dev 合约用于管理用户会话和访问控制
 */
contract AccessControl {
    UserManagement private userManagement;
    MedicalDataManagement private medicalDataManagement;
    Policy private policy;

    struct UserSession {
        bool isLoggedIn;
        string role;
        string department;
    }

    mapping(address => UserSession) private userSessions;

    event LogUserLoggedIn(address indexed user, string role, string department);
    event LogAccessDenied(address indexed user, string reason);
    event LogDataAccessed(address indexed user, bytes32 indexed patientID, string dataType, string ipfsCID);

    /**
     * @dev 构造函数，初始化合约地址
     * @param userManagementAddress 用户管理合约地址
     * @param medicalDataManagementAddress 医疗数据管理合约地址
     * @param policyAddress 权限策略合约地址
     */
    constructor(
        address userManagementAddress,
        address medicalDataManagementAddress,
        address policyAddress
    ) {
        userManagement = UserManagement(userManagementAddress);
        medicalDataManagement = MedicalDataManagement(medicalDataManagementAddress);
        policy = Policy(policyAddress);
    }

    /**
     * @notice 用户登录并验证权限
     * @param userID 用户的唯一标识符
     * @param dataOwner 数据所有者的名字（Primary Key）
     * @param dataType 数据类型
     * @return 数据的IPFS CID或"false"表示权限不足
     */
    function loginUserAndAccessData(bytes32 userID, string memory dataOwner, string memory dataType) 
        public 
        returns (string memory) 
    {
        // 从UserManagement获取用户信息
        UserManagement.User memory user = userManagement.getUser(userID);

        // 验证用户是否存在
        if (bytes(user.userName).length > 0) {
            userSessions[msg.sender] = UserSession({
                isLoggedIn: true,
                role: user.role,
                department: user.department
            });
            emit LogUserLoggedIn(msg.sender, user.role, user.department);

            // 根据用户角色在Policy合约中检查访问权限
            bool hasAccess = false;
            if (keccak256(abi.encodePacked(user.role)) == keccak256(abi.encodePacked("Doctor"))) {
                // 医生可以访问所有类型的数据
                hasAccess = policy.doctorHasAccess(user.department, dataOwner, Policy.DataType.MedicalRecord);
            } else if (keccak256(abi.encodePacked(user.role)) == keccak256(abi.encodePacked("Nurse"))) {
                // 检查护士的权限
                hasAccess = policy.nurseHasAccess(Policy.DataType.MedicalRecord);
            } else if (keccak256(abi.encodePacked(user.role)) == keccak256(abi.encodePacked("Patient"))) {
                // 检查患者的权限
                hasAccess = policy.patientHasAccess(keccak256(abi.encodePacked(user.userAddress)), dataOwner, Policy.DataType.MedicalRecord);
            }

            // 如果用户有权限，访问MedicalDataManagement获取数据
            if (hasAccess) {
                return accessDataByOwner(dataOwner, dataType);
            } else {
                emit LogAccessDenied(msg.sender, "Access denied for the requested data type.");
                return "false";
            }
        } else {
            emit LogAccessDenied(msg.sender, "User does not exist.");
            return "false";
        }
    }

    /**
     * @notice 根据数据所有者和数据类型访问数据
     * @param dataOwner 数据所有者的名字（Primary Key）
     * @param dataType 数据类型
     * @return 数据的IPFS CID
     */
    function accessDataByOwner(string memory dataOwner, string memory dataType) internal returns (string memory) {
        // 从MedicalDataManagement获取与dataOwner相关的数据
        bytes32[] memory dataIDs = medicalDataManagement.getUserDataIDs(dataOwner);
        for (uint i = 0; i < dataIDs.length; i++) {
            bytes32 dataID = dataIDs[i];
            MedicalDataManagement.MedicalData memory medicalData = medicalDataManagement.getMedicalData(dataID);
            if (keccak256(abi.encodePacked(medicalData.dataType)) == keccak256(abi.encodePacked(dataType))) {
                string memory ipfsCID = bytesToString(medicalData.ipfsCID);
                emit LogDataAccessed(msg.sender, dataID, dataType, ipfsCID);
                return ipfsCID; // 返回IPFS CID
            }
        }
        return "false";
    }

    /**
     * @notice 将bytes转换为字符串
     * @param _bytes 要转换的bytes
     * @return 转换后的字符串
     */
    function bytesToString(bytes memory _bytes) internal pure returns (string memory) {
        return string(_bytes);
    }
}
