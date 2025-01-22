#  Sistem de Votare

# Voting System Contract

## Introducere

Acest proiect constă într-un sistem de votare implementat pe blockchain utilizând Ethereum și Solidity. Contractul inteligent permite adăugarea de candidați, votarea pentru aceștia, gestionarea fondurilor și interacțiunea cu utilizatorii printr-o aplicație web3. 

## Configurare și Lansare

### 1. Instalarea dependențelor

Începe prin a instala dependențele necesare pentru proiect:

```bash
npm install
```

### 2. Lansați rețeaua locală Hardhat

Lansați un nod local Hardhat pentru a crea un mediu de dezvoltare Ethereum:

```bash
npx hardhat node
```
Această comandă va porni rețeaua locală și va afișa adresele și cheile private ale conturilor generate automat.

### 3. Implementarea contractului

După ce rețeaua locală Hardhat este pornită, deschide un nou terminal și rulează scriptul de implementare a contractului pe rețeaua locală:

```bash
npx hardhat run scripts/deploy.js --network localhost
```
Această comandă va implementa contractul inteligent VotingSystem pe rețeaua locală și va afișa adresa contractului implementat.

### 4. Accesarea Consola Hardhat

Pentru a interacționa cu contractul prin consola Hardhat, folosește următoarea comandă:

```bash
npx hardhat console --network localhost
```
Această comandă deschide consola Hardhat unde poți apela funcții și interacționa direct cu contractul.

### 5. Lansarea aplicației web3

Pentru a porni interfața aplicației web3, rulează următoarea comandă în terminal:

```bash
npm start
```
Această comandă va lansa aplicația React în modul de dezvoltare. După pornire, aplicația poate fi accesată în browser la adresa:
```
http://localhost:3000
```

## Structura Proiectului

1. **Contractul Solidity**: Codul contractului inteligent de votare.
2. **Scriptul de implementare**: Scriptul utilizat pentru a lansa contractul pe rețeaua locală Hardhat.
3. **Aplicația Web3**: Aplicația front-end construită cu React, conectată la contractul Ethereum prin biblioteca `ethers.js`.
4. **Fișierul ABI**: ABI-ul contractului pentru interacțiunea front-end cu blockchain-ul.

### Fișierele proiectului

- **VotingSystem.sol**: Codul sursă al contractului inteligent.
- **deploy.js**: Scriptul pentru implementarea contractului pe rețeaua locală Hardhat.
- **VotingApp.js**: Componenta React care permite interacțiunea cu contractul printr-o aplicație Web3.
- **VotingSystemABI.json**: ABI-ul contractului pentru integrarea cu aplicația Web3.

## Exemple de Implementare a Cerințelor

### Partea 1: Implementarea Smart Contractului

**Utilizarea tipurilor de date specifice Solidity (mappings, address)**

1. **Mapping:** Folosim un mapping(address => bool) pentru a urmări dacă un votant a votat deja.
1. **Address:** address public admin; definește un administrator al contractului.

```solidity
mapping(address => bool) public hasVoted;
address public admin;
```

**Înregistrarea de events**

Contractul înregistrează două evenimente: CandidateAdded și Voted. Acestea sunt emise atunci când un candidat este adăugat și când un utilizator votează.

```solidity
event CandidateAdded(string name);
event Voted(address indexed voter, string candidate);
```

**Utilizarea de modifiers**

Un modifier onlyAdmin este utilizat pentru a restricționa funcțiile doar la admin.

```solidity
modifier onlyAdmin() {
    require(msg.sender == admin, "Not authorized");
    \_;
}
```

**Exemple pentru toate tipurile de funcții (external, pure, view)**

1. **External:** addCandidate este o funcție externă care poate fi apelată de la exterior.
1. **Pure:** Funcțiile care nu citesc sau nu modifică starea contractului (de exemplu, calcule) sunt marcate cu pure.
1. **View:** Funcțiile care doar citesc starea contractului sunt marcate cu view.

```solidity
function addCandidate(string memory name) external onlyAdmin {
  candidates.push(Candidate(name, 0));
  emit CandidateAdded(name);
}
function getCandidate(uint index) external view returns (string memory name, uint voteCount) {
  Candidate storage candidate = candidates[index];
  return (candidate.name, candidate.voteCount);
}
```

**Exemplu de transfer de ETH**

Funcțiile depositFunds și withdrawFunds permit transferul de ETH în și din contract.

```solidity
function depositFunds() external payable onlyAdmin {
  // logic pentru depunerea de fonduri
}

function withdrawFunds(uint amount) external onlyAdmin {
  require(address(this).balance >= amount, "Insufficient funds");
  payable(admin).transfer(amount);
}
```

**Interacțiunea între contracte**

În aplicația front-end, contractul este apelat pentru a adăuga candidați, a vota și a vizualiza numărul de voturi.

```javascript
const tx = await votingSystem.connect(signer).addCandidate(candidateName);
await tx.wait();
```

**Deploy pe o rețea locală sau pe o rețea de test Ethereum**

În scriptul de deploy, contractul este implementat pe rețeaua locală Hardhat:

```javascript
const VotingSystem = await hre.ethers.getContractFactory("VotingSystem");
console.log("Deploying VotingSystem...");

const votingSystem = await VotingSystem.deploy(3600); // Durata votării: 1 oră
await votingSystem.waitForDeployment();
```

**Utilizare librării**

Utilizarea ethers.js pentru a interacționa cu blockchain-ul Ethereum:

```javascript
import { ethers } from "ethers";
```

### Partea 2: Interacțiunea cu blockchain printr-o aplicație web3

**Utilizarea unei librării web3 (ethers.js) și conectarea cu un Web3 Provider pentru accesarea unor informații generale despre conturi (adresă, balance)**

Aplicația front-end utilizează ethers.js pentru a interacționa cu rețeaua Ethereum locală, obținând semnătura utilizatorilor și gestionând tranzacțiile de vot și depunere de fonduri.

```javascript
const initSigner = async () => {
    const provider = new ethers.JsonRpcProvider("http://localhost:8545");
    const signer = await provider.getSigner();
    setSigner(signer);

    const address = await signer.getAddress();
    setUserAddress(address);
};
```

**Inițierea tranzacțiilor**

Aplicația trimite tranzacții pentru adăugarea de candidați, votarea pentru aceștia și gestionarea fondurilor. Pentru a vota, apelăm funcția vote din contractul VotingSystem:

```javascript
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
    } catch (error) {
        setTxStatus("Error voting: " + error.message);
    }
};
```

**Tratarea evenimentelor (Observer Pattern)**

Evenimentele generate de contract sunt gestionate în aplicația front-end pentru a informa utilizatorii despre modificările de stare.

```javascript
const tx = await votingSystem.connect(signer).vote(0);
setTxStatus("Vote casted successfully!");
```

**Controlul stării tranzacțiilor (tratarea excepțiilor)**

În aplicația web, gestionăm erorile de tranzacție, cum ar fi atunci când utilizatorul încearcă să voteze din nou sau când depune o sumă incorectă.

```javascript
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
```
