let votingContract;

async function connectToWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.enable();
            console.log("Connected to Web3");
        } catch (error) {
            console.error("User denied account access");
        }
    } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        console.log("Connected to Web3");
    } else {
        console.error("No Web3 detected. Please install MetaMask or use a Web3-enabled browser.");
    }

    // Wait for the accounts to be loaded
    const accounts = await web3.eth.getAccounts();

    if (accounts.length > 0) {
        // Set the default account
        web3.eth.defaultAccount = accounts[0];
        console.log("Default account set:", web3.eth.defaultAccount);
    } else {
        console.error("No accounts available.");
    }

    const contractAbi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "electionId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "candidate",
				"type": "address"
			}
		],
		"name": "CandidateAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "commission",
				"type": "address"
			}
		],
		"name": "ElectionCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "electionId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "winner",
				"type": "address"
			}
		],
		"name": "ElectionEnded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "electionId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "voter",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "candidate",
				"type": "address"
			}
		],
		"name": "Voted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "electionId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "voter",
				"type": "address"
			}
		],
		"name": "VoterAdded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "electionId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "candidate",
				"type": "address"
			}
		],
		"name": "addCandidate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "electionId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "voter",
				"type": "address"
			}
		],
		"name": "addVoter",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "createElection",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "electionId",
				"type": "uint256"
			}
		],
		"name": "endElection",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "electionId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "candidate",
				"type": "address"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "electionCommission",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "elections",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "getElectionId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "electionId",
				"type": "uint256"
			}
		],
		"name": "getVotes",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "electionId",
				"type": "uint256"
			}
		],
		"name": "getWinner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nextElectionId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
    const contractAddress = "0xc1E389465c74b1bA49e3095A7b03b181388B3a51";

    votingContract = new web3.eth.Contract(contractAbi, contractAddress);
}

async function createElection() {
    await connectToWeb3();

    const electionName = document.getElementById("electionName").value;
    await votingContract.methods.createElection(electionName).send({ from: web3.eth.defaultAccount });
    alert("Election created successfully!");
}

async function addCandidate() {
    await connectToWeb3();

    const electionId = document.getElementById("electionIdAddCandidate").value;
    const candidateAddress = document.getElementById("candidateAddress").value;
    await votingContract.methods.addCandidate(electionId, candidateAddress).send({ from: web3.eth.defaultAccount });
    alert("Candidate added successfully!");
}

async function addVoter() {
    await connectToWeb3();

    const electionId = document.getElementById("electionIdAddVoter").value;
    const voterAddress = document.getElementById("voterAddress").value;
    await votingContract.methods.addVoter(electionId, voterAddress).send({ from: web3.eth.defaultAccount });
    alert("Voter added successfully!");
}

async function vote() {
    await connectToWeb3();

    const electionId = document.getElementById("electionIdVote").value;
    const voterAddress = document.getElementById("voterAddressVote").value;
    const candidateAddress = document.getElementById("candidateAddressVote").value;
    await votingContract.methods.vote(electionId, candidateAddress).send({ from: voterAddress });
    alert("Vote cast successfully!");
}

async function endElection() {
    await connectToWeb3();

    const electionId = document.getElementById("electionIdEnd").value;
    await votingContract.methods.endElection(electionId).send({ from: web3.eth.defaultAccount });
    alert("Election ended successfully!");
}

async function getWinner() {
    await connectToWeb3();

    const electionId = document.getElementById("electionIdWinner").value;
    const winner = await votingContract.methods.getWinner(electionId).call();
    alert("Winner: " + winner);
}

async function getVotes() {
    await connectToWeb3();

    const electionId = document.getElementById("electionIdVotes").value;
    const result = await votingContract.methods.getVotes(electionId).call();
    const candidates = result[0];
    const votes = result[1];

    let resultHtml = "<ul>";
    for (let i = 0; i < candidates.length; i++) {
        resultHtml += `<li>${candidates[i]}: ${votes[i]} votes</li>`;
    }
    resultHtml += "</ul>";

    document.getElementById("votesResult").innerHTML = resultHtml;
}
