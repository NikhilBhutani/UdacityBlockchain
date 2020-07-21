var HouseToken = artifacts.require('HouseToken');

contract('HouseToken', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    const tokenIds = [...Array(5).keys()];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await HouseToken.new({from: account_one});

            // TODO: mint multiple tokens
            tokenIds.forEach(async (token) => {
              await this.contract.mint(accounts[token], token)
            });
        })

        it('should return total supply', async function () { 
            let totalSupply = await this.contract.totalSupply();
            assert.equal(totalSupply, tokenIds.length, "This functions doesn't return total supply");
        })

        it('should get token balance', async function () { 
            let balance = await this.contract.balanceOf(accounts[0]);
            assert.equal(balance, 1, "Does not return token balance of account #0");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let tokenId = tokenIds[1];
            let tokenURI = await this.contract.tokenURI(tokenId);
            let baseTokenURI = await this.contract.baseTokenURI();
            assert.equal(baseTokenURI, 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/', 'Base token URI is not correct');
            assert.equal(tokenURI, baseTokenURI + tokenId, 'Base token URI is not correct');
        })

        it('should transfer token from one owner to another', async function () { 
            let tokenId = tokenIds[0];
            await this.contract.transferFrom(accounts[0], accounts[1], tokenId, {from: accounts[0]});
            let balanceAcc0 = await this.contract.balanceOf(accounts[0]);
            let balanceAcc1 = await this.contract.balanceOf(accounts[1]);

            let newOwner = await this.contract.ownerOf(tokenId);
            assert.equal(newOwner, accounts[1], "Account1 is still not owner");
            assert.equal(balanceAcc0, 0, "Account0 has wrong balance");
            assert.equal(balanceAcc1, 2, "Account1 has wrong balance");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await HouseToken.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let failed = false;
            try {
                await this.contract.mint(accounts[1], tokenIds[0], {from: accounts[1]});
            } catch (e) {
                failed = true;
            }                    

            assert.isTrue(failed, "Illegal minting does not fail");
        })

        it('should return contract owner', async function () { 
            let contractOwner = await this.contract.getOwner();
            assert.equal(account_one, contractOwner, "Does not return contract owner");
        })

    });
})