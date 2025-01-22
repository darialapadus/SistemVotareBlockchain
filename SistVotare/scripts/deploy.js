const { ethers } = require("hardhat");

async function main() {
    const VotingSystem = await hre.ethers.getContractFactory("VotingSystem");
    console.log("Deploying VotingSystem...");

    // Deploy contract
    const votingSystem = await VotingSystem.deploy(3600); // Durata votarii: 1 ora
    await votingSystem.waitForDeployment(); 

    // Obtine adresa contractului
    const votingSystemAddress = await votingSystem.getAddress();
    console.log("VotingSystem deployed to:", votingSystemAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });