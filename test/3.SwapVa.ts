import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { SwapVA } from "../typechain/SwapVA";
import { Vcc } from "../typechain/Vcc";

chai.use(solidity);
const { expect } = chai;

describe("SwapVA", () => {
  let vcc: Vcc;
  let swapVA: SwapVA;
  let signers: any;
  let uniswapFactoryAddr: string = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
  let population = 7000000;

  beforeEach(async () => {
    signers = await ethers.getSigners();

    const vccFactory = await ethers.getContractFactory("Vcc", signers[0]);

    vcc = (await vccFactory.deploy(population)) as Vcc;
    await vcc.deployed();

    const swapVaFactory = await ethers.getContractFactory("SwapVa", signers[0]);

    swapVA = (await swapVaFactory.deploy(
      vcc.address,
      uniswapFactoryAddr
    )) as SwapVA;
    await swapVA.deployed();

    expect(await swapVA.vcc()).to.eq(vcc.address);
    expect(await swapVA.factory()).to.eq(uniswapFactoryAddr);

    expect(swapVA.address).to.properAddress;
  });
});
