const { ethers } = require("hardhat")
const { expect, assert } = require("chai")

describe("SimpleAutomation", function () {
  const interval = process.env.INTERVAL
  let deployer, simpleAutomationFactory, contract

  beforeEach(async function () {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    simpleAutomationFactory = await ethers.getContractFactory("SimpleAutomation")
    contract = await simpleAutomationFactory.deploy(interval)
    await contract.deployed();
  })

  it("Check interval", async function () {
    const contractInterval = await contract.getInterval()
    assert.equal(contractInterval, interval)
  })
  it("Check counter at start", async function () {
    const counter = await contract.getCounter()
    assert.equal(counter, 0)
  })
  it("emits CheckUpkeepCall event", async () => {
    await expect(contract.checkUpkeep("0x")).to.emit(contract, "CheckUpkeepCall")
  })
  it("CheckUpkeep returns fail at start", async () => {
    const { upkeepNeeded } = await contract.checkUpkeep("0x")
    assert(!upkeepNeeded)
  })
  // it("Check insertion of 3 x 1000 tickets", async () => {
  //   await contract.addBulkOfTickets(1000)
  //   const nTickets = (await contract.getNumberOfTickets()).toString()
  //   console.log(`nTickets=${nTickets}`)
  //   assert.equal(nTickets, "1000")
  // })
  it("3000 Tickets array cleanup", async () => {
    let nTickets = (await contract.getNumberOfTickets()).toString()
    console.log(`     nTickets at start: ${nTickets}`)
    await contract.addBulkOfTickets(1000)
    console.log('     nTickets at start: +1000')
    await contract.addBulkOfTickets(1000)
    console.log('     nTickets at start: +1000')
    await contract.addBulkOfTickets(1000)
    console.log('     nTickets at start: +1000')
    nTickets = (await contract.getNumberOfTickets()).toString()
    console.log(`     nTickets  filling: ${nTickets}`)
    assert.equal(nTickets, "3000")
    await contract.resetTickets()
    nTickets = (await contract.getNumberOfTickets()).toString()
    console.log(`     nTickets    final: ${nTickets}`)
    assert.equal(nTickets, "0")
  })
})
