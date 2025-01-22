import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { votingSystem } from "../utils/ethereum"; // Importa ABI-ul contractului si adresa acestuia
import './VotingApp.css'; // Importa fisierul CSS pentru stilizarea aplicatiei

const VotingApp = () => {
  const [signer, setSigner] = useState(null);
  const [candidateName, setCandidateName] = useState("");
  const [voteCount, setVoteCount] = useState(0);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [contractBalance, setContractBalance] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [candidateInfo, setCandidateInfo] = useState({ name: "", votes: 0 });
  const [feedback, setFeedback] = useState("");
  const [txStatus, setTxStatus] = useState("");
  const [userAddress, setUserAddress] = useState("");

  // Initializeaza semnatura utilizatorului si seteaza adresa acestuia
  const initSigner = async () => {
    const provider = new ethers.JsonRpcProvider("http://localhost:8545");
    const signer = await provider.getSigner();
    setSigner(signer);

    const address = await signer.getAddress();
    setUserAddress(address);
  };

  // Verifica daca utilizatorul a votat deja
  const checkIfVoted = async () => {
    if (!signer) {
      console.log("Signer not available.");
      return;
    }

    try {
      const provider = new ethers.JsonRpcProvider("http://localhost:8545");
      const votingSystemWithProvider = votingSystem.connect(provider);

      const hasVotedStatus = await votingSystemWithProvider.hasVoted(signer.address);
      setHasVoted(hasVotedStatus);
    } catch (error) {
      console.error("Error checking vote status:", error);
    }
  };

  // Functia pentru adaugarea unui candidat
  const addCandidate = async () => {
    if (!signer) {
      setFeedback("Signer not available.");
      return;
    }

    try {
      const tx = await votingSystem.connect(signer).addCandidate(candidateName);
      setTxStatus("Transaction sent, awaiting confirmation...");
      await tx.wait();
      setTxStatus("Candidate added successfully!");
      setFeedback("");
    } catch (error) {
      setTxStatus("Error adding candidate: " + error.message);
    }
  };

  // Functia pentru votarea unui candidat
  const voteForCandidate = async () => {
    if (!signer) {
      setFeedback("Signer not available.");
      return;
    }

    if (hasVoted) {
      setFeedback("You have already voted.");
      return;
    }

    try {
      const tx = await votingSystem.connect(signer).vote(0);
      setTxStatus("Transaction sent, awaiting confirmation...");
      await tx.wait();
      setTxStatus("Vote casted successfully!");
      setHasVoted(true);
      setFeedback("");
    } catch (error) {
      setTxStatus("Error voting: " + error.message);
    }
  };

  // Functia pentru a obtine informatiile unui candidat
  const getCandidateInfo = async () => {
    try {
      const provider = new ethers.JsonRpcProvider("http://localhost:8545");
      const votingSystemWithProvider = votingSystem.connect(provider);
      const [name, votes] = await votingSystemWithProvider.getCandidate(0);

      setCandidateInfo({ name, votes: votes.toString() });
      console.log(`Candidate: ${name}, Vote Count: ${votes.toString()}`);
    } catch (error) {
      console.error("Error getting candidate info:", error);
    }
  };

  // Functia pentru obtinerea voturilor unui candidat
  const getVotes = async () => {
    try {
      const provider = new ethers.JsonRpcProvider("http://localhost:8545");
      const votingSystemWithProvider = votingSystem.connect(provider);
      const [name, votes] = await votingSystemWithProvider.getCandidate(0);

      setVoteCount(parseInt(votes.toString()));
      console.log(`Candidate: ${name}, Vote Count: ${votes.toString()}`);
    } catch (error) {
      console.error("Error getting votes:", error);
    }
  };

  // Functia pentru a depune fonduri
  const depositFunds = async () => {
    if (!signer) {
      setFeedback("Signer not available.");
      return;
    }

    try {
      const tx = await votingSystem.connect(signer).depositFunds({ value: ethers.parseEther(depositAmount) });
      setTxStatus("Transaction sent, awaiting confirmation...");
      await tx.wait();
      setTxStatus(`${depositAmount} ETH deposited successfully!`);
    } catch (error) {
      setTxStatus("Error depositing funds: " + error.message);
    }
  };

  // Functia pentru a retrage fonduri
  const withdrawFunds = async () => {
    if (!signer) {
      setFeedback("Signer not available.");
      return;
    }

    try {
      const tx = await votingSystem.connect(signer).withdrawFunds(ethers.parseEther(withdrawAmount));
      setTxStatus("Transaction sent, awaiting confirmation...");
      await tx.wait();
      setTxStatus(`${withdrawAmount} ETH withdrawn successfully!`);
    } catch (error) {
      setTxStatus("Error withdrawing funds: " + error.message);
    }
  };

  // Functia pentru a obtine balanta contractului
  const getContractBalance = async () => {
    try {
      const provider = new ethers.JsonRpcProvider("http://localhost:8545");
      const contractBalance = await votingSystem.connect(provider).getContractBalance();
      setContractBalance(ethers.formatEther(contractBalance));
      console.log(`Contract balance: ${ethers.formatEther(contractBalance)} ETH`);
    } catch (error) {
      console.error("Error getting contract balance:", error);
    }
  };

  useEffect(() => {
    initSigner();
    checkIfVoted();
  }, [signer]);

  return (
    <div className="container">
      <h1>Voting System</h1>
      <div><strong>Address:</strong> {userAddress}</div> {/* Afiseaza adresa utilizatorului */}
      <input
        type="text"
        value={candidateName}
        onChange={(e) => setCandidateName(e.target.value)}
        placeholder="Candidate Name"
      />
      <button onClick={addCandidate}>Add Candidate</button>
      <button onClick={voteForCandidate} disabled={hasVoted}>Vote for Candidate </button>
      <button onClick={getVotes}>Get Votes for Candidate </button>
      <div>Votes: {voteCount}</div>
      {hasVoted && <p>You have already voted.</p>}
      <button onClick={getCandidateInfo}>Get Candidate Info</button>
      <div>Candidate Info: {candidateInfo.name} - {candidateInfo.votes} Votes</div>
      <input
        type="number"
        value={depositAmount}
        onChange={(e) => setDepositAmount(e.target.value)}
        placeholder="Amount to deposit (ETH)"
      />
      <button onClick={depositFunds}>Deposit Funds</button>

      <input
        type="number"
        value={withdrawAmount}
        onChange={(e) => setWithdrawAmount(e.target.value)}
        placeholder="Amount to withdraw (ETH)"
      />
      <button onClick={withdrawFunds}>Withdraw Funds</button>

      <button onClick={getContractBalance}>Get Contract Balance</button>
      <div>Contract Balance: {contractBalance} ETH</div>

      <div>{feedback}</div>
      <div>{txStatus}</div>
    </div>
  );
};

export default VotingApp;
