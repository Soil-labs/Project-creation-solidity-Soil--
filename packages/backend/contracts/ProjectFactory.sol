// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol"; 
import "./Project.sol";

contract ProjectFactory is Ownable {
    struct ProjectDesc {
        address project;
        address champ;
        string projecetName;
    }
    mapping(address => ProjectDesc[]) public projects;
    mapping(address => uint256) public numberOfProjects;

    function createProject(address _champ, string calldata _projectName, string calldata _desc, string[] calldata _adminroles)public {
        Project newProject = new Project(_champ, _projectName, _desc, _adminroles);
        projects[_champ].push(ProjectDesc(address(newProject), _champ, _projectName));
        numberOfProjects[_champ] += 1;
    }
}
