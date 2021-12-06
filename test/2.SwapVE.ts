import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { SwapVE } from "../typechain/SwapVE";
import { Vcc } from "../typechain/Vcc";
import { IUniswapV2Router01 } from "../typechain/IUniswapV2Router01";
import { IUniswapV2Factory } from "../typechain/IUniswapV2Factory";
import { ERC20 } from "../typechain/ERC20";
import { IUniswapV2Pair } from "../typechain/IUniswapV2Pair";

chai.use(solidity);
const { expect } = chai;

const hre = require("hardhat");
const fs = require("fs");

describe("SwapVE", () => {
  let signers: any;

  let vcc: Vcc;
  let swapVE: SwapVE;
  let uniswapRouter01: IUniswapV2Router01;
  let uniswapFactory: IUniswapV2Factory;
  let WETH: ERC20;
  let ourTokenToETHPair: IUniswapV2Pair;

  let uniswapRouterAddr: string = "0xf164fC0Ec4E93095b804a4795bBe1e041497b92a";
  let uniswapFactoryAddr: string = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
  let wethAddress: string = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

  let population = 7000000;

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

    // instanciramo uniswap router kao kontrakt u test skripti
    uniswapRouter01 = new ethers.Contract(
      uniswapRouterAddr,
      JSON.parse(
        fs.readFileSync(
          "./artifacts/@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router01.sol/IUniswapV2Router01.json"
        )
      )["abi"],
      signers[0]
    ) as IUniswapV2Router01;

    // uradimo provere za dovoljan balans za dodabanje likvidnosti
    expect(await vcc.balanceOf(signers[0].address)).to.eq(
      ethers.constants.WeiPerEther.mul(100)
    );

    // kreiramo par izmedju vcc tokena i eth-a

    await vcc.approve(
      uniswapRouter01.address,
      ethers.constants.WeiPerEther.mul(100)
    );

    await uniswapRouter01.addLiquidityETH(
      vcc.address,
      ethers.constants.WeiPerEther.mul(100),
      ethers.constants.WeiPerEther.mul(100),
      ethers.constants.WeiPerEther.mul(10),
      signers[0].address,
      7000000000,
      {
        value: ethers.constants.WeiPerEther.mul(10),
      }
    );

    // isntanciramo factory
    uniswapFactory = new ethers.Contract(
      uniswapFactoryAddr,
      JSON.parse(
        fs.readFileSync(
          "./artifacts/@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol/IUniswapV2Factory.json"
        )
      )["abi"],
      signers[0]
    ) as IUniswapV2Factory;

    // instaciramo WETH
    WETH = new ethers.Contract(
      wethAddress,
      JSON.parse(
        fs.readFileSync(
          "./artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json"
        )
      )["abi"],
      signers[0]
    ) as ERC20;

    // dobijamo adresu naseg para od fektorija
    let adresaPara: string = await uniswapFactory.getPair(
      wethAddress,
      vcc.address
    );

    // instanciramo par
    ourTokenToETHPair = new ethers.Contract(
      adresaPara,
      JSON.parse(
        fs.readFileSync(
          "./artifacts/@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol/IUniswapV2Pair.json"
        )
      )["abi"],
      signers[0]
    ) as IUniswapV2Pair;

    expect((await ourTokenToETHPair.balanceOf(signers[0].address)).gt(0)).to.be
      .true;
    expect(await WETH.balanceOf(adresaPara)).to.be.eq(
      ethers.constants.WeiPerEther.mul(10)
    );
    expect(await vcc.balanceOf(adresaPara)).to.be.eq(
      ethers.constants.WeiPerEther.mul(100)
    );
  });

  it.only("Should check for my new pair address", async () => {
    expect(1).to.eq(1);
  });
  // it("Should swapp vcc to eth", async()=>{

  // })
});
