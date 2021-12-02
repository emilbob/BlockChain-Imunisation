import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { SwapVE } from "../typechain/SwapVE";
import { Vcc } from "../typechain/Vcc";

chai.use(solidity);
const { expect } = chai;

describe("SwapVE", () => {
  let vcc: Vcc;
  let swapVE: SwapVE;
  let signers: any;
  let uniswapRouterAddr: string = "0xf164fC0Ec4E93095b804a4795bBe1e041497b92a";
  let uniswapFactoryAddr: string = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
  let population = 7000000;

  let pairAddress: string = "0x21baa4b957c3e060f2908aa28ff2f3a885e1a128";

  beforeEach(async () => {
    signers = await ethers.getSigners();

    const vccFactory = await ethers.getContractFactory("Vcc", signers[0]);

    vcc = (await vccFactory.deploy(population)) as Vcc;
    await vcc.deployed();

    const swapVEFactory = await ethers.getContractFactory("SwapVE", signers[0]);

    swapVE = (await swapVEFactory.deploy(
      vcc.address,
      uniswapRouterAddr,
      uniswapFactoryAddr
    )) as SwapVE;
    await swapVE.deployed();

    expect(await swapVE.vcc()).to.eq(vcc.address);
    expect(await swapVE.router()).to.eq(uniswapRouterAddr);
    expect(await swapVE.factory()).to.eq(uniswapFactoryAddr);

    expect(swapVE.address).to.properAddress;
  });

  it.only("Should check for my new pair address", async () => {
    await swapVE.myPair();
  });
});
