var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "air mercy solution saddle assault tired nasty live release amateur drink ensure";

module.exports = {
  networks: {
    development: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "http://127.0.0.1:8545/", 0, 50);
      },
      network_id: '*',
      gas: 5555555
    }
  },
  compilers: {
    solc: {
      version: "^0.5.0"
    }
  }
};