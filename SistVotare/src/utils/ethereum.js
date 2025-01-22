import { ethers } from "ethers";
import VotingSystemABI from "./VotingSystemABI.json"; 

// Crearea unui provider pentru a interactiona cu reteaua locala
const provider = new ethers.JsonRpcProvider("http://localhost:8545"); 

// Obtine semnatura (signer) de la primul cont
const signer = provider.getSigner(); 

// Adresa contractului implementat pe reteaua locala
const votingSystemAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

// Creeaza instanta contractului
const votingSystem = new ethers.Contract(votingSystemAddress, VotingSystemABI, signer);

// Exporta contractul pentru a fi utilizat in aplicatia ta
export { votingSystem };
