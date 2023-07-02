const { ethers } = require("hardhat")
const axios = require('axios')
const abiDecoder = require('abi-decoder')
const fs = require("fs")
const path = require('path')

const DELIMITER = ','
const eventName = 'RaffleEnter'
const currentPath = path.dirname(require.main.filename)
const abiPath = path.join(currentPath, '../../', 'alternatefrontend/constants/contracts/0.6.1/Raffle.abi.json')
console.log(`abiPath=${abiPath}`)
const abi = JSON.parse(fs.readFileSync(abiPath))
const iface = new ethers.utils.Interface(abi)
const eventKey = Object.keys(iface.events).find((event) => event.includes(eventName))
const eventAbi = Object.values(iface.events[eventKey])
abiDecoder.addABI(eventAbi)

if (!process.env.BSCSCAN_API_KEY) throw new Error('BSCSCAN_API_KEY not set')
const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY
const ADDRESS = '0x09463EA90f096D7c58f524A0Eaf7A142FFa6B830'
const START_BLOCK = 27842260
const TMP_BLK = 29589119
const FROM_BLK = START_BLOCK
const TO_BLK = 	29589263
const TOPIC0 = '0x03d7debd74f350095fd7ca1a31f0b4f434b53d116e8f3ef7098650c67cd3f30a'

const baseUrl = 'https://api.bscscan.com/api?module=logs&action=getLogs'
const urlParams = `&fromBlock=${FROM_BLK}&toBlock=${TO_BLK}&address=${ADDRESS}&topic0=${TOPIC0}&apikey=${BSCSCAN_API_KEY}`
const url = baseUrl + urlParams
axios.get(url).then((response) => {
    const logs = response.data.result
    const data = []
    logs.map((item) => {
        const parsedLogItem = iface.parseLog(item)
        const dataItem = {
            timeISO: new Date(item.timeStamp * 1000).toISOString().slice(0,-5),
            partner: parsedLogItem.args.partnerID,
            playerAddress: parsedLogItem.args.player,
            paidTickets: parsedLogItem.args.ticketsSold,
            bonusTickets: parsedLogItem.args.bonusTickets,
            blockNumber: item.blockNumber,
            transactionHash: item.transactionHash
        }
        data.push(dataItem)
    })

    const csv = []
    let headers = ''
    Object.keys(data[0]).map((keyName, index) => {
        headers += (index > 0 ? DELIMITER : '') + keyName
    })
    csv.push(headers)

    data.forEach((dataItem) => {
        let valueStr = ''
        Object.values(dataItem).map((value, index) => {
            valueStr += (index > 0 ? DELIMITER : '') + value.toString()
        })
        csv.push(valueStr)
    })

    const file = fs.createWriteStream('data/out/data.csv')
    file.on('error', (err) => console.log(err))
    csv.forEach(str => file.write(`${str}\n`))
    file.end()
    console.log(`csv file written`)

}).catch((reason) => console.log('Unable to get API request. Error=', reason))
