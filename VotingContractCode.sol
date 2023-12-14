// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    address public electionCommission;
    
    struct Election {
        uint256 id;
        string name;
        mapping(address => bool) isCandidate;
        address[] candidates;
        mapping(address => bool) hasVoted;
        mapping(address => uint256) votesReceived;
        bool isActive;
    }

    mapping(uint256 => Election) public elections;
    uint256 public nextElectionId;

    event ElectionCreated(uint256 indexed id, string indexed name, address indexed commission);
    event CandidateAdded(uint256 indexed electionId, address indexed candidate);
    event VoterAdded(uint256 indexed electionId, address indexed voter);
    event Voted(uint256 indexed electionId, address indexed voter, address indexed candidate);
    event ElectionEnded(uint256 indexed electionId, address indexed winner);

    modifier onlyCommission() {
        require(msg.sender == electionCommission, "Only the election commission can call this function");
        _;
    }

    modifier onlyActiveElection(uint256 electionId) {
        require(elections[electionId].isActive, "Election is not active");
        _;
    }

    constructor() {
        electionCommission = msg.sender;
    }

    function createElection(string memory name) external onlyCommission {
        Election storage newElection = elections[nextElectionId];
        newElection.id = nextElectionId;
        newElection.name = name;
        newElection.isActive = true;

        emit ElectionCreated(nextElectionId, name, msg.sender);

        nextElectionId++;
    }

    function getElectionId(string memory name) external view returns (uint256) {
        for (uint256 i = 0; i < nextElectionId; i++) {
            if (keccak256(abi.encodePacked(elections[i].name)) == keccak256(abi.encodePacked(name))) {
                return i;
            }
        }
        revert("Election not found");
    }

    function addCandidate(uint256 electionId, address candidate) external onlyCommission onlyActiveElection(electionId) {
        require(!elections[electionId].isCandidate[candidate], "Candidate already added");
        
        elections[electionId].isCandidate[candidate] = true;
        elections[electionId].candidates.push(candidate);

        emit CandidateAdded(electionId, candidate);
    }

    function addVoter(uint256 electionId, address voter) external onlyCommission onlyActiveElection(electionId) {
        require(!elections[electionId].hasVoted[voter], "Voter already added");

        elections[electionId].hasVoted[voter] = false;

        emit VoterAdded(electionId, voter);
    }

    function vote(uint256 electionId, address candidate) external onlyActiveElection(electionId) {
        require(elections[electionId].isCandidate[candidate], "Candidate not found");
        require(!elections[electionId].hasVoted[msg.sender], "Voter has already voted");

        elections[electionId].votesReceived[candidate]++;
        elections[electionId].hasVoted[msg.sender] = true;

        emit Voted(electionId, msg.sender, candidate);
    }

    function endElection(uint256 electionId) external onlyCommission onlyActiveElection(electionId) {
        address winner = getWinner(electionId);
        elections[electionId].isActive = false;

        emit ElectionEnded(electionId, winner);
    }

    function getWinner(uint256 electionId) public view onlyActiveElection(electionId) returns (address) {
        require(elections[electionId].candidates.length > 0, "No candidates in the election");

        address winner = elections[electionId].candidates[0];
        uint256 maxVotes = elections[electionId].votesReceived[winner];

        for (uint256 i = 1; i < elections[electionId].candidates.length; i++) {
            address candidate = elections[electionId].candidates[i];
            uint256 votes = elections[electionId].votesReceived[candidate];

            if (votes > maxVotes) {
                maxVotes = votes;
                winner = candidate;
            }
        }

        return winner;
    }

    function getVotes(uint256 electionId) external view returns (address[] memory, uint256[] memory) {
        address[] memory candidates = elections[electionId].candidates;
        uint256[] memory votes = new uint256[](candidates.length);

        for (uint256 i = 0; i < candidates.length; i++) {
            votes[i] = elections[electionId].votesReceived[candidates[i]];
        }

        return (candidates, votes);
    }
}
