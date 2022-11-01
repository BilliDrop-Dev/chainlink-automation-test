require("@nomiclabs/hardhat-waffle")
require("hardhat-deploy")
require("hardhat-gas-reporter")
require("./tasks/block-number")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("solidity-coverage")
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const INTERVAL = process.env.INTERVAL || 60
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""
const AVALANCHE_FUJI_RPC_URL = process.env.AVALANCHE_FUJI_RPC_URL || "https://api.avax-test.network/ext/bc/C/rpc"
const PRIVATE_KEY =
  process.env.PRIVATE_KEY ||
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
const SNOWTRACE_API_KEY = process.env.SNOWTRACE_API_KEY || ""

module.exports = {
  defaultNetwork: "hardhat",
  interval: INTERVAL,
  networks: {
    hardhat: {},
    fuji: {
      url: AVALANCHE_FUJI_RPC_URL,
      accounts: [PRIVATE_KEY],
      saveDeployments: true,
      chainId: 43113
    },
    localhost: {
      url: "http://localhost:8545",
      saveDeployments: true,
      chainId: 31337
    }
  },
  solidity: "0.8.7",
  etherscan: {
    apiKey: SNOWTRACE_API_KEY
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: COINMARKETCAP_API_KEY
  }
}
