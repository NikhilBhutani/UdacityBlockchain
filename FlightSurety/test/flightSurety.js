var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');

contract('Flight Surety Tests', async (accounts) => {

    var config;
    before('setup contract', async () => {
        config = await Test.Config(accounts);
        await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);
    });

    /****************************************************************************************/
    /* Operations and Settings                                                              */
    /****************************************************************************************/

    it(`has correct initial isOperational() value`, async function () {

        // Get operating status
        let status = await config.flightSuretyData.isOperational.call();
        assert.equal(status, true, "Incorrect initial operating status value");

    });

    it(`can block access to setOperatingStatus() for non-Contract Owner account`, async function () {

        // Ensure that access is denied for non-Contract Owner account
        let accessDenied = false;
        try {
            await config.flightSuretyData.setOperatingStatus(false, { from: config.testAddresses[2] });
        }
        catch (e) {
            accessDenied = true;
        }
        assert.equal(accessDenied, true, "Access not restricted to Contract Owner");

    });

    it(`can allow access to setOperatingStatus() for Contract Owner account`, async function () {

        // Ensure that access is allowed for Contract Owner account
        let accessDenied = false;
        try {
            await config.flightSuretyData.setOperatingStatus(false);
        }
        catch (e) {
            accessDenied = true;
        }
        assert.equal(accessDenied, false, "Access not restricted to Contract Owner");

    });

    it(`can block access to functions using requireIsOperational when operating status is false`, async function () {

        await config.flightSuretyData.setOperatingStatus(false);

        let reverted = false;
        try {
            await config.flightSurety.setTestingMode(true);
        }
        catch (e) {
            reverted = true;
        }
        assert.equal(reverted, true, "Access not blocked for requireIsOperational");

        // Set it back for other tests to work
        await config.flightSuretyData.setOperatingStatus(true);

    });


    it('first airline is registered when contract is deployed.', async () => {

        // ARRANGE
        let result = await config.flightSuretyData.isRegisteredAirline.call(accounts[0]);

        // ASSERT
        assert.equal(result, true, "First airline not registered");

    });


    it('only existing airline may register a new airline', async () => {

        // ARRANGE
        let newAirline = accounts[1];
        let notAirline = accounts[10];

        // ACT
        try {
            await config.flightSuretyApp.registerAirline(newAirline, { from: notAirline });
        }
        catch (e) {

        }
        let result = await config.flightSuretyData.isRegisteredAirline.call(newAirline);

        // ASSERT
        assert.equal(result, false, "Only existing airline may register a new airline");

    });


    it('Registration of fifth and subsequent airlines requires multi-party consensus of 50% of registered airlines', async () => {

        // ARRANGE
        let newAirline2 = accounts[1];
        let newAirline3 = accounts[2];
        let newAirline4 = accounts[3];
        let newAirline5 = accounts[4];

        // ACT
        // STEP1 - Register airlines #1-4
        try {
            await config.flightSuretyApp.registerAirline(newAirline2, { from: accounts[0] });
            await config.flightSuretyApp.registerAirline(newAirline3, { from: accounts[0] });
            await config.flightSuretyApp.registerAirline(newAirline4, { from: accounts[0] });
        }
        catch (e) {

        }
        let result1 = await config.flightSuretyData.isRegisteredAirline.call(newAirline4);
        // STEP2 - Try to register airline #5 without consensus
        try {
            await config.flightSuretyApp.registerAirline(newAirline5, { from: accounts[0] });
        }
        catch (e) {
        }
        let result2 = await config.flightSuretyData.isRegisteredAirline.call(newAirline5);

        // STEP3 - Register airline #5 with consensus
        try {
            await config.flightSuretyApp.registerAirline(newAirline5, { from: accounts[1] });
        }
        catch (e) {
            console.log(e);
        }
        let result3 = await config.flightSuretyData.isRegisteredAirline.call(newAirline5);

        assert.equal(result1, true, "Cannot register airlines #2-4");
        assert.equal(result2, false, "Can register airline #5 without consensus");
        assert.equal(result3, true, "Cannot register airline #5 with consensus");

    });

    it('airline cannot register an Airline using registerAirline() if it is not funded', async () => {

        // ARRANGE
        let newAirline = accounts[10];
        let registeredAirlineWithoutFunds = accounts[1];

        // ACT
        try {
            await config.flightSuretyApp.registerAirline(newAirline, { from: registeredAirlineWithoutFunds });
        }
        catch (e) {

        }
        let result = await config.flightSuretyData.isRegisteredAirline.call(newAirline);

        // ASSERT
        assert.equal(result, false, "Airline should not be able to register another airline if it hasn't provided funding");

    });


    it('airline can be registered, but does not participate in contract until it submits funding of 10 ether', async () => {

        // ARRANGE
        let airlineWithoutFunds = accounts[4];
        result1 = await config.flightSuretyData.isAirlineWithFunds.call(airlineWithoutFunds);

        // Fund and try again
        try {
            await config.flightSuretyApp.fund({from: accounts[4], value: web3.utils.toWei('10', 'ether')});
        }
        catch (e) {
            console.log(e);
        }
        result2 = await config.flightSuretyData.isAirlineWithFunds.call(airlineWithoutFunds);

        // ASSERT
        assert.equal(result1, false, "Airline can participate without funds");
        assert.equal(result2, true, "Airline cannot participate with funds");

    });

});