const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.parseEther(n.toString());
};

const ether = tokens;

describe("TokenSale", () => {
  let token, tokenSaleI, deployer, receiver, exchange, totalSupply;

  beforeEach(async () => {
    const MyToken = await ethers.getContractFactory("Panda");
    const myToken = await MyToken.deploy();
    const accounts = await ethers.getSigners();
    deployer = accounts[0];
    receiver = accounts[1];
    exchange = accounts[2];

    // Deploy TokenSale with MyToken's address
    const TokenSale = await ethers.getContractFactory("TokenSale");

    const tokenSale = await TokenSale.deploy(myToken.target);

    // Transfer the total supply from MyToken to TokenSale
    totalSupply = await myToken.totalSupply();
    await myToken.transfer(tokenSale.target, totalSupply);

    // Wait for the deployments to complete
    token = await myToken.waitForDeployment();
    tokenSaleI = await tokenSale.waitForDeployment();
  });

  it("Should not have any tokens in the TokenSale contract", async () => {
    expect(await token.balanceOf(deployer.address)).to.equal(tokens("0"));
  });

  it("All tokens should be in the TokenSale Smart Contract", async () => {
    console.log(await token.balanceOf(tokenSaleI.target));
    console.log(totalSupply);
    expect(await token.balanceOf(tokenSaleI.target)).to.equal(totalSupply);
  });

  it("Should be possible to buy tokens", async () => {
    let balanceBefore = await token.balanceOf(deployer.address);

    //One token cost 0.01 ether, so here we are using ether.parseEther to convert 0.01 into wei format
    await expect(
      tokenSaleI
        .connect(deployer)
        .purchase({ value: ethers.parseEther("0.01") })
    ).to.be.fulfilled;

    // Note here that the balanceOf method, doesnt return how much money/eth is inside. It returns the balance/the qty of tokens they have.
    //So 0.01 ether, buys us 1 token.
    expect(await token.balanceOf(deployer.address)).to.equal(
      balanceBefore + tokens(1)
    );
  });
  // Additional test cases for TokenSale functionality can be added here
});
