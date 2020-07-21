// migrating the appropriate contracts
var ManufacturerRole = artifacts.require("./ManufacturerRole.sol");
var DealerRole = artifacts.require("./DealerRole.sol");
var SupplierRole = artifacts.require("./SupplierRole.sol");
var CustomerRole = artifacts.require("./CustomerRole.sol");
var SupplyChain = artifacts.require("./SupplyChain.sol");

module.exports = function(deployer) {
  deployer.deploy(ManufacturerRole);
  deployer.deploy(DealerRole);
  deployer.deploy(SupplierRole);
  deployer.deploy(CustomerRole);
  deployer.deploy(SupplyChain);
};
