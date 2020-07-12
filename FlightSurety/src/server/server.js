import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';
import "regenerator-runtime/runtime.js";


let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
web3.eth.defaultAccount = web3.eth.accounts[0];
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);

let ORACLES_NUM = 20;
let accounts = [];
let oracles = [];

// *** ORACLE REGISTRATION **

// Upon startup, 20+ oracles are registered and their assigned indexes are persisted in memory
const addOracle = async (account) => {
  try {
    let oracle = await flightSuretyApp.methods.registerOracle().send({
      from: account,
      value: web3.utils.toWei("1", 'ether'),
      gas: 2500000
    });
    if (oracle) {
      let indexes = await flightSuretyApp.methods.getMyIndexes().call({ from: account, gas: 2500000 });
      oracles.push({ address: account, indexes: indexes });
      console.log("New oracle added: " + oracle.transactionHash);
    }

  } catch (error) {
    console.log(error.message);
  }
}

const start = async () => {
  accounts = await web3.eth.getAccounts();
  web3.eth.defaultAccount = accounts[0];
  accounts = accounts.slice(0, ORACLES_NUM);
  accounts.forEach(account => addOracle(account));
}

// *** EVENTS **

// Update flight status requests from client Dapp result in OracleRequest event emitted by Smart Contract that is captured by server (displays on console and handled in code)

// Server will loop through all registered oracles, identify those oracles for which the OracleRequest event applies, and respond by calling into FlightSuretyApp contract with random status code of Unknown (0), On Time (10) or Late Airline (20), Late Weather (30), Late Technical (40), or Late Other (50)


const submitResponse = async (oracle, index, airline, flight, timestamp, statusCode) => {
  if (oracle.indexes.includes(index)) {
    try {
      await flightSuretyApp.methods.submitOracleResponse(index, airline, flight, timestamp, statusCode)
        .send({ from: oracle.address, gas: 2500000 });
      console.log(`Submit: StatusCode: ${statusCode}, Index ${index}, Airline: ${airline}, Flight ${flight}, Timestamp ${timestamp}`)
    } catch (e) {
    }
  }
}

const getRandomNumber = (max) => {
  return Math.floor(Math.random() * (max + 1));
}

flightSuretyApp.events.OracleRequest({
  fromBlock: 0
}, function (error, event) {
  if (error) console.log(error)
  let { index, airline, flight, timestamp } = event.returnValues;
  // random status code of Unknown (0), On Time (10) or Late Airline (20), Late Weather (30), Late Technical (40), or Late Other (50)
  const statusCode = getRandomNumber(5) * 10

  oracles.forEach(oracle => submitResponse(oracle, index, airline, flight, timestamp, statusCode));

});



// *** START SERVER ***

start();


const app = express();
app.get('/api', (req, res) => {
  res.send({
    message: 'An API for use with your Dapp!'
  })
})

app.get('/api/registered-oracles', (req, res) => {
  res.json({
    oracles: oracles.length
  })
})

export default app;

// flightSuretyApp.events.OracleRequest({
//     fromBlock: 0
//   }, function (error, event) {
//     if (error) console.log(error)
//     console.log(event)
// });

// const app = express();
// app.get('/api', (req, res) => {
//     res.send({
//       message: 'An API for use with your Dapp!'
//     })
// })

// export default app;


