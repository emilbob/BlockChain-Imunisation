import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { Vcc } from "../typechain/Vcc";

chai.use(solidity);
const { expect } = chai;

const hre = require("hardhat");

describe("Vcc", () => {
  let vcc: Vcc;
  let signers: any;

  let population = 7000000;

  beforeEach(async () => {
    signers = await ethers.getSigners();

    const vccFactory = await ethers.getContractFactory("Vcc", signers[0]);

    vcc = (await vccFactory.deploy(population)) as Vcc;
    await vcc.deployed();

    expect(vcc.address).to.properAddress;
  });
  it.skip("Should add person to registry and increment person index", async () => {
    await vcc.register(signers[1].address, "persona 1", 1);
    await vcc.register(signers[2].address, "persona 2", 1);

    await expect(await vcc.getIndex()).to.eq(2);
  });

  it.skip("Should  vaccinate and mint on persons   balance", async () => {
    let person = await vcc.getPerson(1);

    await vcc.vaccinate(1);
    //expect(await vcc.balanceOf(signers[1].address)).to.equal(2000000);
  });
});
