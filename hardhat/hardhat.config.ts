require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const { SEPOLIA_API_KEY, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.18",
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${SEPOLIA_API_KEY}`,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
}
