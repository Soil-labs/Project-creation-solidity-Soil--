// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;


import "@openzeppelin/contracts/access/Ownable.sol"; 

contract Project is Ownable {
    string public name;
    string public desc;
    struct Member {
        address member;
        string role;
        bool access;
    }
    mapping(address => Member) public Members;
    event NewMemberAdded(address newMember, string role);
    event MemberRevoked(address member);
    constructor(address _owner,string memory _name, string memory _desc) {
        transferOwnership(_owner);
        name = _name;
        desc = _desc;
    }
    function addMember(address _dev, string memory _role) public onlyOwner {
        require(Members[_dev].member == address(0), "Member Alerady Exists");
        Members[_dev] = Member(_dev, _role, true);
        emit NewMemberAdded(_dev, _role);
    }

    function revokeMember(address _dev) public onlyOwner {
        Members[_dev].access = false;
        emit MemberRevoked(_dev);
    }

    // function changeRole(address _dev, string memory _newrole) public onlyOwner {
    //     Members[_dev].roles.push(_newrole);
    // }
}