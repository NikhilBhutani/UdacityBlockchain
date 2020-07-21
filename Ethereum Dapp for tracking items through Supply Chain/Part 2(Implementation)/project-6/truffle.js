const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraKey = "0334e88931064e49b8e4dc097a237c4d";

const fs = require('fs');
const mnemonic = 'pepper toy only science relax entire midnight broccoli faith exhaust render jeans'
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
        network_id: 4,       // rinkeby's id
        gas: 4500000,        // rinkeby has a lower block limit than mainnet
        gasPrice: 10000000000
    }
  },
  compilers: {
    solc: {
      version: "^0.4.24"
    }
  }

};