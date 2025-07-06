require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.28",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545", // Ganache RPC URL
      accounts: [
        "0x333874018dca257b1f693029b70b3f24f9f45ab4138a7a7d1640392003bbf1ee"
      ]
    }
  }
};
