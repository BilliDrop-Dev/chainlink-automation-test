const { run, network } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  const interval = process.env.INTERVAL || 120
  const waitBlockConfirmations = process.env.VERIFICATION_BLOCK_CONFIRMATIONS || 1

  log("----------------------------------------------------")
  const contract = await deploy("Raffle", {
    from: deployer,
    args: [interval],
    log: true,
    waitConfirmations: waitBlockConfirmations,
  })

  // Verify the deployment
  if (network.name !== "31337" && process.env.SNOWTRACE_API_KEY) {
    log("Verifying...")
    await verify(contract.address, arguments)
  }
  log("----------------------------------------------------")
}
module.exports.tags = ["all", "contract"]

// async function verify(contractAddress, args) {
const verify = async (contractAddress, args) => {
  console.log("Verifying contract...")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!")
    } else {
      console.log(e)
    }
  }
}
