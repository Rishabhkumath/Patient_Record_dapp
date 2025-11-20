import "@nomiclabs/hardhat-waffle";

export default {
  solidity: "0.8.19",
  networks: {
    localhost: {
      url: "http://localhost:8545",
      chainId: 31337,
    }
  }
};