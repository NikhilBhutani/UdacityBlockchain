pragma solidity ^0.4.26;
//pragma solidity >=0.4.24 <0.7.0;
//pragma solidity ^0.4.24;
// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'SupplierRole' to manage this role - add, remove, check
contract SupplierRole {
  using Roles for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing
  event SupplierAdded(address indexed account);
  event SupplierRemoved(address indexed account);
  
  // Define a struct 'Suppliers' by inheriting from 'Roles' library, struct Role
  Roles.Role private Supplier;

  // In the constructor make the address that deploys this contract the 1st Supplier
  constructor() public {
    _addSupplier(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlySupplier() {
    require(isSupplier(msg.sender), "");
    _;
  }

  // Define a function 'isSupplier' to check this role
  function isSupplier(address account) public view returns (bool) {
    Supplier.has(account);
  }

  // Define a function 'addSupplier' that adds this role
  function addSupplier(address account) public onlySupplier {
    _addSupplier(account);
  }

  // Define a function 'renounceSupplier' to renounce this role
  function renounceSupplier() public {
    _removeSupplier(msg.sender);
  }

  // Define an internal function '_addSupplier' to add this role, called by 'addSupplier'
  function _addSupplier(address account) internal {
    Supplier.add(account);
    emit SupplierAdded(account);
  }

  // Define an internal function '_removeSupplier' to remove this role, called by 'removeSupplier'
  function _removeSupplier(address account) internal {
    Supplier.remove(account);
    emit SupplierRemoved(account);
  }
}