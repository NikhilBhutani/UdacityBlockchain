// migrating the appropriate contracts
var HouseToken = artifacts.require("HouseToken.sol");
var Verifier = artifacts.require("Verifier.sol");
var SolnSquareVerifier = artifacts.require("SolnSquareVerifier.sol");

module.exports = async function(deployer) {
  await deployer.deploy(HouseToken);
  await deployer.deploy(Verifier);
  await deployer.deploy(SolnSquareVerifier, Verifier.address);
};
