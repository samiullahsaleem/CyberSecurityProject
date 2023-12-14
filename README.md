# CyberSecurityProject
# Voting System README

## Overview

This repository contains a simple implementation of a voting system using the Ethereum blockchain and the Solidity programming language. The system allows the creation of elections, addition of candidates and voters, casting votes, and determining the winner of an election. Additionally, a basic web interface is provided to interact with the smart contract.

## Smart Contract (Solidity)

### `VotingSystem.sol`

#### Contract Structure
- **`VotingSystem`**: Main contract managing the voting system.
  - `electionCommission`: Address of the election commission.
  - `Election` struct: Represents an election with attributes like ID, name, candidates, votes, and activity status.
  - `elections`: Mapping to store election details.
  - `nextElectionId`: Counter for the next election ID.

#### Main Functions
- `createElection(string memory name)`: Creates a new election.
- `getElectionId(string memory name)`: Retrieves the ID of an election by name.
- `addCandidate(uint256 electionId, address candidate)`: Adds a candidate to a specific election.
- `addVoter(uint256 electionId, address voter)`: Adds a voter to a specific election.
- `vote(uint256 electionId, address candidate)`: Allows a voter to cast a vote for a candidate in a specific election.
- `endElection(uint256 electionId)`: Ends an election and determines the winner.
- `getWinner(uint256 electionId)`: Retrieves the winner of a specific election.
- `getVotes(uint256 electionId)`: Retrieves the votes received by each candidate in a specific election.

#### Modifiers
- `onlyCommission`: Restricts functions to be callable only by the election commission.
- `onlyActiveElection(uint256 electionId)`: Restricts functions to be callable only if the election is active.

### Smart Contract Deployment
- The contract is deployed on the Ethereum blockchain with the address: `0xc1E389465c74b1bA49e3095A7b03b181388B3a51`.
- The contract is compiled with Solidity version `^0.8.0`.

## Web Interface

### `index.html`

- The HTML file provides a simple user interface for interacting with the smart contract.

#### Functionality
1. **Create Election:** Allows the user to create a new election by providing a name.
2. **Add Candidate:** Adds a candidate to an existing election by specifying the election ID and candidate's address.
3. **Add Voter:** Adds a voter to an existing election by specifying the election ID and voter's address.
4. **Vote:** Allows a voter to cast a vote in a specific election by providing the election ID, voter's address, and candidate's address.
5. **End Election:** Ends an existing election by specifying the election ID.
6. **Get Winner:** Retrieves the winner of an election by specifying the election ID.
7. **Get Votes:** Retrieves the votes received by each candidate in an election by specifying the election ID.

### `app.js`

- The JavaScript file (`app.js`) facilitates the interaction between the HTML interface and the deployed smart contract using the Web3 library.

#### Functions
- `connectToWeb3()`: Connects to the user's Ethereum wallet using Web3.
- Functions corresponding to HTML buttons:
  - `createElection()`
  - `addCandidate()`
  - `addVoter()`
  - `vote()`
  - `endElection()`
  - `getWinner()`
  - `getVotes()`

## Dependencies

- The smart contract relies on the Solidity programming language and is deployed on the Ethereum blockchain.
- The web interface uses the Web3 library (`v1.5.3`) to interact with the Ethereum blockchain.

## Usage

1. Access the HTML interface (`index.html`) in a web browser.
2. Ensure that a Web3-enabled browser or MetaMask is installed.
3. Interact with the voting system by using the provided buttons for each functionality.

Note: Before using the system, ensure that you are connected to the Ethereum blockchain and have sufficient funds in your account for transaction fees.

## License

This code is licensed under the MIT License (`SPDX-License-Identifier: MIT`).

---
For questions or issues, please contact the developer: [Sami Ullah Saleem and Shahzada Tayyab Tanveer] ([bitf20m012@pucit.edu.pk,bitf20m041@pucit.edu.pk]).

