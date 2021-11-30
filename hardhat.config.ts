import { HardhatUserConfig } from "hardhat/types";

import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-docgen";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.2", settings: {} }],
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  networks: {
    hardhat: {
      forking: {
        url: "https://api.archivenode.io/70qv2ve2ii2sxemysiks0670qv2vp6oh",
      },
    },
  },
  docgen: {
    path: "docs/",
    clear: true,
    runOnCompile: false,
    only: ["^contracts/"],
  },
};

export default config;
