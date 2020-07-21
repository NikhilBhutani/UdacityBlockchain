pragma solidity ^0.4.26;
//pragma solidity >=0.4.24 <0.7.0;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'DealerRole' to manage this role - add, remove, check
contract DealerRole {
  using Roles for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing
  event DealerAdded(address indexed account);
  event DealerRemoved(address indexed account);
  
  // Define a struct 'Dealers' by inheriting from 'Roles' library, struct Role
  Roles.Role private Dealer;

  // In the constructor make the address that deploys this contract the 1st Dealer
  constructor() public {
    _addDealer(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyDealer() {
    require(isDealer(msg.sender), "");
    _;
  }

  // Define a function 'isDealer' to check this role
  function isDealer(address account) public view returns (bool) {
   return Dealer.has(account);
  }

  // Define a function 'addDealer' that adds this role
  function addDealer(address account) public onlyDealer {
    _addDealer(account);
  }

  // Define a function 'renounceDealer' to renounce this role
  function renounceDealer() public {
    _removeDealer(msg.sender);
  }

  // Define an internal function '_addDealer' to add this role, called by 'addDealer'
  function _addDealer(address account) internal {
    Dealer.add(account);
    emit DealerAdded(account);
  }

  // Define an internal function '_removeDealer' to remove this role, called by 'removeDealer'
  function _removeDealer(address account) internal {
    Dealer.remove(account);
    emit DealerRemoved(account);
  }
}