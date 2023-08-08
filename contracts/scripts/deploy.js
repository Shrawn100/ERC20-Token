const { ethers } = require("hardhat");

async function main() {
  // Deploy MyToken
  const MyToken = await ethers.getContractFactory("Panda");
  const myToken = await MyToken.deploy();

  // Deploy TokenSale with MyToken's address
  const TokenSale = await ethers.getContractFactory("TokenSale");
  console.log(myToken.target);
  const tokenSale = await TokenSale.deploy(myToken.target);

  // Transfer the total supply from MyToken to TokenSale
  const totalSupply = await myToken.totalSupply();
  await myToken.transfer(tokenSale.target, totalSupply);

  // Wait for the deployments to complete
  await myToken.waitForDeployment();
  await tokenSale.waitForDeployment();

  console.log(`MyToken deployed to: ${myToken.target}`);
  console.log(`TokenSale deployed to: ${tokenSale.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
