// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract UserManagement {
    struct User {
        string userName;
        address userAddress;
        string role;
        string department;
    }

    mapping(bytes32 => User) private users;
    bytes32 public lastUserID; // 保存最后一个添加的用户的ID

    event UserAdded(bytes32 indexed userID, string userName, address indexed userAddress, string role, string department);

    /**
     * @notice Adds a user to the contract storage
     * @param userName The name of the user
     * @param userAddress The address of the user
     * @param role The role of the user
     * @param department The department of the user
     * @return userID The unique identifier of the user, hashed using keccak256
     */
    function addUser(
        string memory userName,
        address userAddress,
        string memory role,
        string memory department
    ) 
        public 
        returns (bytes32) 
    {
        bytes32 userID = keccak256(abi.encodePacked(userName, userAddress, role, department));
        users[userID] = User(userName, userAddress, role, department);
        lastUserID = userID; // 更新最后一个添加的用户的ID
        emit UserAdded(userID, userName, userAddress, role, department);
        
        // 添加日志信息
        require(users[userID].userAddress == userAddress, "User not added correctly.");
        return userID;
    }

    /**
     * @notice Deletes a user from the contract storage
     * @param userID The unique identifier of the user
     */
    function deleteUser(bytes32 userID) public {
        delete users[userID];
    }

    /**
     * @notice Updates a user's role and/or department
     * @param userID The unique identifier of the user
     * @param newRole The new role of the user
     * @param newDepartment The new department of the user
     * @return newUserID The new unique identifier of the user, hashed using keccak256
     */
    function updateUser(
        bytes32 userID,
        string memory newRole,
        string memory newDepartment
    ) 
        public 
        returns (bytes32) 
    {
        User storage user = users[userID];
        require(bytes(user.userName).length > 0, "User does not exist.");

        if (bytes(newRole).length != 0) {
            user.role = newRole;
        }
        if (bytes(newDepartment).length != 0) {
            user.department = newDepartment;
        }

        bytes32 newUserID = keccak256(abi.encodePacked(user.userName, user.userAddress, user.role, user.department));
        users[newUserID] = user;
        if (newUserID != userID) {
            delete users[userID];
        }
        return newUserID;
    }

    /**
     * @notice Retrieves a user from the contract storage
     * @param userID The unique identifier of the user
     * @return The User struct containing userName, userAddress, role, and department
     */
    function getUser(bytes32 userID) public view returns (User memory) {
        require(bytes(users[userID].userName).length > 0, "User does not exist.");
        return users[userID];
    }

    /**
     * @notice Retrieves the hash of a user from the contract storage
     * @param userID The unique identifier of the user
     * @return The hash of the user's data
     */
    function getUserHash(bytes32 userID) public view returns (bytes32) {
        User memory user = users[userID];
        require(bytes(user.userName).length > 0, "User does not exist.");
        return keccak256(abi.encodePacked(user.userName, user.userAddress, user.role, user.department));
    }
}
