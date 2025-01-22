// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract VotingSystem {
    address public admin;

    struct Candidate {
        string name;
        uint voteCount;
    }

    Candidate[] public candidates;
    mapping(address => bool) public hasVoted;
    uint public votingDeadline;

    event CandidateAdded(string name);
    event Voted(address indexed voter, string candidate);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    constructor(uint _votingDuration) {
        admin = msg.sender;
        votingDeadline = block.timestamp + _votingDuration;
    }

    function addCandidate(string memory name) external onlyAdmin {
        candidates.push(Candidate(name, 0));
        emit CandidateAdded(name);
    }

    function getCandidate(uint index) external view returns (string memory name, uint voteCount) {
        require(index < candidates.length, "Index out of bounds");
        Candidate storage candidate = candidates[index];
        return (candidate.name, candidate.voteCount);
    }

    function vote(uint candidateIndex) external {
        require(block.timestamp < votingDeadline, "Voting has ended");
        require(!hasVoted[msg.sender], "You have already voted");
        require(candidateIndex < candidates.length, "Invalid candidate index");

        hasVoted[msg.sender] = true;
        candidates[candidateIndex].voteCount++;
        emit Voted(msg.sender, candidates[candidateIndex].name);
    }

    function depositFunds() external payable onlyAdmin {
        // logic for depositing funds
    }

    function withdrawFunds(uint amount) external onlyAdmin {
        require(address(this).balance >= amount, "Insufficient funds");
        payable(admin).transfer(amount);
    }

    function getContractBalance() external view returns (uint) {
        return address(this).balance;
    }
}
