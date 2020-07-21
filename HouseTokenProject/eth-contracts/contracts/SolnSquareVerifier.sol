pragma solidity ^0.5.0;

import "./ERC721Mintable.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract VerifierInterface{
   function verifyTx(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[2] memory input
        ) public returns (bool r);
}


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is HouseToken{
VerifierInterface verifier;

// TODO define a solutions struct that can hold an index & an address
   struct Solution{
       uint256 index;
       address senderAddress;
   }

// TODO define an array of the above struct
  Solution[] solutions;

// TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution)  submittedSolutions;


// TODO Create an event to emit when a solution is added
  event SolutionAdded();

 constructor(address verifierAddress) public {
        verifier = VerifierInterface(verifierAddress);
    }

// TODO Create a function to add the solutions to the array and emit the event
  function addSolution(uint256 tokenId, address senderAddress, bytes32 hash) public{
      Solution memory solution = Solution(tokenId, senderAddress);
      solutions.push(solution);
      submittedSolutions[hash] = solution;
      emit SolutionAdded();
  }

     function getSolutionsCount() public view returns (uint256) {
        return solutions.length;
    }

    function getHashForSolution(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(a, b, c, input));
    }


// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly
    function mintToken(
        address to,
        uint256 tokenId,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public returns (bool) {
        bool verification = verifier.verifyTx(a, b, c, input);
        bytes32 hash = getHashForSolution(a, b, c, input);
        require(verification, "Solution was not verified");
        require(
            submittedSolutions[hash].senderAddress == address(0),
            "Solution has been used before"
        );
        addSolution(tokenId, to, hash);
        return super.mint(to, tokenId);
    }
  
}

























