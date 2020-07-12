const FlightSuretyData = artifacts.require("FlightSuretyData");
const FlightSuretyApp = artifacts.require("FlightSuretyApp");
const fs = require('fs');
module.exports = async function(deployer, network, accounts) {
  const firstAirline = accounts[1];
  await deployer.deploy(FlightSuretyData);
  const data_contract = await FlightSuretyData.deployed();
  await deployer.deploy(FlightSuretyApp, data_contract.address);
  const app_contract = await FlightSuretyApp.deployed();
  let url = 'http://localhost:9545';
  if (network == 'ganachegui')
    url = 'http://localhost:8545';
  let config = {
    localhost: {
      url: url,
      dataAddress: data_contract.address,
      appAddress: app_contract.address
    }
  }
  
  
  fs.writeFileSync(__dirname + '/../src/dapp/config.json',JSON.stringify(config, null, '\t'), 'utf-8');
  fs.writeFileSync(__dirname + '/../src/server/config.json',JSON.stringify(config, null, '\t'), 'utf-8');
}


// const FlightSuretyApp = artifacts.require("FlightSuretyApp");
// const FlightSuretyData = artifacts.require("FlightSuretyData");
// const fs = require('fs');

// module.exports = function(deployer) {

//     let firstAirline = '0xf17f52151EbEF6C7334FAD080c5704D77216b732';
//     deployer.deploy(FlightSuretyData)
//     .then(() => {
//         return deployer.deploy(FlightSuretyApp)
//                 .then(() => {
//                     let config = {
//                         localhost: {
//                             url: 'http://localhost:8545',
//                             dataAddress: FlightSuretyData.address,
//                             appAddress: FlightSuretyApp.address
//                         }
//                     }
//                     fs.writeFileSync(__dirname + '/../src/dapp/config.json',JSON.stringify(config, null, '\t'), 'utf-8');
//                     fs.writeFileSync(__dirname + '/../src/server/config.json',JSON.stringify(config, null, '\t'), 'utf-8');
//                 });
//     });
// }