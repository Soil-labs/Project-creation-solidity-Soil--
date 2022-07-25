// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;


import "@openzeppelin/contracts/access/Ownable.sol"; 

contract Project is Ownable {
    uint256 public numberOfMembers;
    string public name;
    string public desc;
    struct Member {
        address member;
        string[] role;
        bool access;
    }
    mapping(address => Member) public Members;
    event NewMemberAdded(address newMember, string[] role);
    event MemberRevoked(address member);
    constructor(address _owner,string memory _name, string memory _desc, string[] memory _adminsrole) {
        transferOwnership(_owner);
        numberOfMembers = 0;
        Members[_owner] = Member(_owner, _adminsrole, true);
        numberOfMembers += 1;
        emit NewMemberAdded(_owner, _adminsrole);
        name = _name;
        desc = _desc;
        
    }
    function addMember(address _dev, string[] memory _role) public onlyOwner {
        require(Members[_dev].member == address(0), "Member Alerady Exists");
        Members[_dev] = Member(_dev, _role, true);
        numberOfMembers += 1;
        emit NewMemberAdded(_dev, _role);
    }

    function revokeMember(address _dev) public onlyOwner {
        Members[_dev].access = false;
        numberOfMembers -= 1;
        emit MemberRevoked(_dev);
    }

    function changeRole(address _dev, string[] memory _newrole) public onlyOwner {
        Members[_dev].role = _newrole;
    }

    function getRoles(address _dev) public view returns(string[] memory roles) {
        return Members[_dev].role;
    }
    function updateProjectName(string memory _name) public onlyOwner {
        name = _name;
    }
    function updateProjectDescription(string memory _desc) public onlyOwner {
        desc = _desc;
    }
}