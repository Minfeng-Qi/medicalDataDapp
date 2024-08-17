// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Policy {
    enum Role { Doctor, Nurse, Patient }
    enum DataType { NursingRecord, MedicalRecord, Prescription }

    mapping(Role => mapping(DataType => bool)) private accessControl;

    constructor() {
        // 定义基础访问权限
        accessControl[Role.Doctor][DataType.NursingRecord] = true;
        accessControl[Role.Doctor][DataType.MedicalRecord] = true;
        accessControl[Role.Doctor][DataType.Prescription] = true;

        accessControl[Role.Nurse][DataType.NursingRecord] = true;
        accessControl[Role.Nurse][DataType.MedicalRecord] = false;
        accessControl[Role.Nurse][DataType.Prescription] = false;

        accessControl[Role.Patient][DataType.NursingRecord] = false;
        accessControl[Role.Patient][DataType.MedicalRecord] = true;
        accessControl[Role.Patient][DataType.Prescription] = false;
    }

    // 定义医生的权限，医生可以访问所有类型的数据，无论科室或数据类型
    function doctorHasAccess(string memory, string memory, DataType) public pure returns (bool) {
        return true;
    }

    // 定义护士的权限，依旧可以访问护理记录
    function nurseHasAccess(DataType dataType) public view returns (bool) {
        return accessControl[Role.Nurse][dataType];
    }

    // 定义患者的权限
    function patientHasAccess(bytes32 patientID, string memory dataOwnerID, DataType dataType) public view returns (bool) {
        return keccak256(abi.encodePacked(patientID)) == keccak256(abi.encodePacked(dataOwnerID)) && 
               accessControl[Role.Patient][dataType];
    }
}
