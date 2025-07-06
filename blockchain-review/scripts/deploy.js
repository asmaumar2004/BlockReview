const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const ReviewSystem = await hre.ethers.getContractFactory("ReviewSystem");

  // Deploy the contract
  const reviewSystem = await ReviewSystem.deploy();

  // Wait for the deployment to complete
  await reviewSystem.waitForDeployment(); // ✅ use this instead of deployed()

  // Print the contract address
  console.log(`Contract deployed to: ${reviewSystem.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
