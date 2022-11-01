const { ethers, run, network } = require("hardhat")

// async main
async function main() {
  const SimpleAutomationFactory = await ethers.getContractFactory("SimpleAutomation")
  console.log("Deploying contract...")
  const interval = process.env.INTERVAL || 120
  const waitBlockConfirmations = process.env.VERIFICATION_BLOCK_CONFIRMATIONS || 1
  console.log(`interval=${interval}`)
  const simpleAutomation = await SimpleAutomationFactory.deploy(interval)
  await simpleAutomation.deployed()
  console.log(`Deployed contract to: ${simpleAutomation.address}`)
  // what happens when we deploy to our hardhat network?
  if (network.config.chainId === 43113 && process.env.SNOWTRACE_API_KEY) {
    console.log("Waiting for block confirmations...")
    await simpleAutomation.deployTransaction.wait(waitBlockConfirmations)
    await verify(simpleAutomation.address, [interval])
  }
}

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

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
