const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const ether = tokens;

describe("TokenSale", () => {
  let token, tokenSale, deployer, receiver, exchange, totalSupply;

  beforeEach(async () => {
    const Token = await ethers.getContractFactory("Panda");
    const TokenSale = await ethers.getContractFactory("TokenSale");
    const accounts = await ethers.getSigners();
    deployer = accounts[0];
    receiver = accounts[1];
    exchange = accounts[2];

    // Deploy MyToken
    token = await Token.deploy();

    // Deploy TokenSale
    tokenSale = await TokenSale.deploy(token.address);

    // Transfer the total supply from MyToken to TokenSale
    totalSupply = await token.totalSupply();
    await token.transfer(tokenSale.address, totalSupply);

    // Wait for the deployments to complete
    await token.deployed();
    await tokenSale.deployed();
  });

  it("Should not have any tokens in the TokenSale contract", async () => {
    expect(await token.balanceOf(deployer.address)).to.equal(tokens("0"));
  });

  it("All tokens should be in the TokenSale Smart Contract", async () => {
    expect(await token.balanceOf(tokenSale.address)).to.equal(totalSupply);
  });

  it("Should be possible to buy tokens", async () => {
    let tokenInstance = await token.deployed();
    let tokenSaleInstance = await tokenSale.deployed();
    let balanceBefore = await tokenInstance.balanceOf(deployer.address);

    await expect(
      tokenSaleInstance.connect(deployer).purchase({ value: tokens(1) })
    ).to.be.fulfilled;

    expect(await tokenInstance.balanceOf(deployer.address)).to.equal(
      balanceBefore.add(tokens(1))
    );
  });
  // Additional test cases for TokenSale functionality can be added here
});
