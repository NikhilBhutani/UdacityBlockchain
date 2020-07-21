# Udacity Blockchain Capstone

## Introduction

The capstone will build upon the knowledge you have gained in the course in order to build a decentralized housing product. You will use zk-SNARKs to create a verification system which can prove you have title to the property without revealing that specific information on the property

## Versions
* Truffle v5.1.35 
* Solidity - 0.5.2 (solc-js)
* Node v12.18.1

## Setup
* Install node packages: `npm install`
* Start Ganache

## Tests
* Go to contracts folder: `cd eth-contracts`
* Run tests: `truffle test`

## Contract Addresses on Rinkeby
* HouseToken: [0xb9ce8C805850Cc295e3A2Cf9412C28a0f08bE236](https://rinkeby.etherscan.io/address/0xb9ce8C805850Cc295e3A2Cf9412C28a0f08bE236)
* SolnSquareVerifier: [0xa5780bf9017E250F12cC667511d87e18c1d5FFfc](https://rinkeby.etherscan.io/address/0xa5780bf9017E250F12cC667511d87e18c1d5FFfc)
* Verifier: [0x3a3Cde4B5eAc8e79E959a0241B5c8e32cD8E274A](https://rinkeby.etherscan.io/address/0x3a3Cde4B5eAc8e79E959a0241B5c8e32cD8E274A)


## Contract ABIs
* [HouseToken.json](./eth-contracts/build/contracts/HouseToken.json)
* [SolnSquareVerifier.json](./eth-contracts/build/contracts/SolnSquareVerifier.json)
* [Verifier.json](./eth-contracts/build/contracts/Verifier.json)


## HouseToken
* [0xa5780bf9017E250F12cC667511d87e18c1d5FFfc](https://rinkeby.etherscan.io/token/0xa5780bf9017E250F12cC667511d87e18c1d5FFfc)
* Total Supply: 10 HT

## OpenSea MarketPlace Storefront 
* [HouseToken V3](https://rinkeby.opensea.io/assets/housetoken-v3)



## Stack
* [ERC721](http://erc721.org/), [Open Zeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol)
* [Zokrates](https://github.com/Zokrates/ZoKrates), [Docker](https://docs.docker.com/get-docker/)
* [OpenSea](https://docs.opensea.io/docs)

## Zokrates

### Setup

1. Install docker
2. Run ZoKrates docker container:

`docker run -v PATH_TO_PROJECT/zokrates/code:/home/zokrates/code -ti zokrates/zokrates /bin/bash`

### Implement zkSnarks

1. Compile Program
Compile the program written in ZoKrates DSL
* `cd code/square`
* `~/zokrates compile -i square.cod`

2. Trusted Setup
Now take the 'flattened' code, which is a circuit and go through a 'trusted setup' Repeat this process, every-time the program.code changes Two keys are generated - 'proving.key' and 'verification.key

`~/zokrates setup`


3. Compute-Witness
Having gone through the 'trusted setup' let's compute our 'witness' who knows the answer and it generates a witness file with computation steps

`~/zokrates compute-witness -a 3 9`

4. Generate-Proof
Next step is to 'generate our proof' based on the above 'witness' A proof.json file is generated in this step

`~/zokrates generate-proof`

5. Export-Verifier

Last but never the least, let's generate our 'verifier' smart contract

`~/zokrates export-verifier`



  

## Project Resources

* [Remix - Solidity IDE](https://remix.ethereum.org/)
* [Visual Studio Code](https://code.visualstudio.com/)
* [Truffle Framework](https://truffleframework.com/)
* [Ganache - One Click Blockchain](https://truffleframework.com/ganache)
* [Open Zeppelin ](https://openzeppelin.org/)
* [Interactive zero knowledge 3-colorability demonstration](http://web.mit.edu/~ezyang/Public/graph/svg.html)
* [Docker](https://docs.docker.com/install/)
* [ZoKrates](https://github.com/Zokrates/ZoKrates)
