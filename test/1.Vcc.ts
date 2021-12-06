import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { Vcc } from "../typechain/Vcc";
import { timeStamp } from "console";

chai.use(solidity);
const { expect } = chai;

const hre = require("hardhat");

describe.skip("Vcc", () => {
  let vcc: Vcc;
  let signers: any;

  let population = 7000000;

  let person;

  enum personState {
    antivaxer,
    vaccinated,
    booster,
  }

  beforeEach(async () => {
    signers = await ethers.getSigners();

    const vccFactory = await ethers.getContractFactory("Vcc", signers[0]);

    vcc = (await vccFactory.deploy(population)) as Vcc;
    await vcc.deployed();

    expect(vcc.address).to.properAddress;
  });

  it.only("Should add person to registry, increment person index, and fire event", async () => {
    await expect(
      vcc.register(signers[1].address, "osoba 1", personState.antivaxer)
    )
      .to.emit(vcc, "vaccinationMsg")
      .withArgs(signers[1].address, "Take vaccine to collect VCC tokens");

    person = await vcc.getPerson(1);

    let [personAddress, name, state, vaccineTime, payOut] = person;

    expect(personAddress).to.eq(signers[1].address);
    expect(name).to.eq("osoba 1");
    expect(state).to.eq(personState.antivaxer);
    expect(vaccineTime).to.eq(0);
    expect(payOut).to.eq(0);

    console.log(person.toString());

    await expect(await vcc.getIndex()).to.eq(2);
  });

  it("Should  vaccinate and mint 2 tokens on persons balance and fire event", async () => {
    person = await vcc.getPerson(1);

    let [personAddress, name, state, vaccineTime, payOut] = person;

    expect(await vcc.vaccinate(1))
      .to.emit(vcc, "vaccinationMsg")
      .withArgs(
        signers[1].address,
        "Congrats, you have earned 2 vcc toknes by taking vaccine"
      );

    expect(state).to.eq(personState.vaccinated);

    expect(await vcc.balanceOf(signers[1].address)).to.equal(2000000);
  });
  it("Should boost person, mint 1 token on persons account, fire event and start recursive payment", async () => {
    let person = await vcc.getPerson(1);

    let [personAddress, name, state, vaccineTime, payOut] = person;

    expect(await vcc.boost(1))
      .to.emit(vcc, "vaccinationMsg")
      .withArgs(
        signers[1],
        "Congrats, you have earned 1 vcc token, you can expect your daily tokens every 24h"
      );

    expect(state).to.eq(personState.booster);
    expect(vaccineTime).to.eq(timeStamp);

    expect(await vcc.balanceOf(signers[1].address)).to.eq(3000000);
  });

  it("Should increment payout time and mind 1 token on persons account", async () => {
    let person = await vcc.getPerson(1);

    const timeStamp = (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;

    let [personAddress, name, state, vaccineTime, payOut] = person;

    expect(await vcc.boost(1));

    expect(vaccineTime).to.eq(timeStamp);
    expect(payOut).to.be.equal(timeStamp + 24 * 60 * 60);
  });
});
