pragma solidity >=0.5.0;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;
    
    uint8 private constant MULTI_PARTY_MIN_COUNT = 5;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private appContract;
    address private contractOwner;                                      // Account used to deploy contract
    bool private operational = true;                                    // Blocks all state changes throughout the contract if false


    struct Airline {
        bool isRegistered;
        bool hasProvidedFunds;
    }

    struct Insurance {
        string flight;
        address passenger;
        uint256 amount;
    }


    Insurance[] insurances;

    uint256 private airlineCounter;
    mapping(address => Airline) private airlines;
    mapping(address => uint256) private credits;
    mapping(address => bool) private authorizedCallers;

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/


    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor() public {
        contractOwner = msg.sender;
        // First airline is registered when contract is deployed.
        registerAirline(contractOwner, contractOwner);
        authorizedCallers[contractOwner] = true;
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in 
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational() 
    {
        require(operational, "Contract is currently not operational");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    modifier requireAuthorizedCaller() {
        require(authorizedCallers[msg.sender], "Not authorized");
        _;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
    * @dev Get operating status of contract
    *
    * @return A bool that is the current operating status
    */      
    function isOperational() 
                            public 
                            view 
                            returns(bool) 
    {
        return operational;
    }

    function isRegisteredAirline(address airlineID) public view returns (bool) {
        return airlines[airlineID].isRegistered;
    }

    function isAirlineWithFunds(address airlineID) public view returns (bool) {
        return airlines[airlineID].hasProvidedFunds;
    }

    function isMultiPartyConsenusRequired() public view returns (bool) {
        return (airlineCounter >= MULTI_PARTY_MIN_COUNT - 1);
    }

    function getRegisteredAirlinesCount() public view returns (uint256) {
        return airlineCounter;
    }

    function compareStringsbyBytes(string memory s1, string memory s2)
        public
        pure
        returns (bool)
    {
        return
            keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
    }

    function authorizeCaller(address caller) public requireContractOwner {
        authorizedCallers[caller] = true;
    }

    function test() public {}


    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */    
    function setOperatingStatus(bool status) public requireContractOwner {
        operational = status;
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

   /**
    * @dev Add an airline to the registration queue
    *      Can only be called from FlightSuretyApp contract
    *
    */   
    function registerAirline(address airlineID, address caller)
        public
        requireIsOperational
    {
        if (airlineCounter > 0) {
            require(
                isRegisteredAirline(caller),
                "Caller is not a registered airline"
            );
            require(
                isAirlineWithFunds(caller),
                "Caller is not a registered airline with funds"
            );
        }

        require(
            !airlines[airlineID].isRegistered,
            "Airline is already registered."
        );

        bool hasProvidedFunds = false;
        if (airlineCounter < MULTI_PARTY_MIN_COUNT - 1) {
            hasProvidedFunds = true;
        }

        airlines[airlineID] = Airline({
            isRegistered: true,
            hasProvidedFunds: hasProvidedFunds
        });
        airlineCounter = airlineCounter.add(1);
    }

   /**
    * @dev Buy insurance for a flight
    *
    */   
    function addInsurance(
        string calldata flight,
        address passenger,
        uint256 amount
    ) external requireIsOperational requireAuthorizedCaller {
        insurances.push(Insurance({
            flight: flight,
            passenger: passenger,
            amount: amount
        }));
    }

    /**
     *  @dev Credits payouts to insurees
    */
    function creditInsurees(string calldata flight, uint256 multiplier)
        external
        requireIsOperational
        requireAuthorizedCaller
    {
        for (uint256 i = 0; i < insurances.length; i++) {
            if (compareStringsbyBytes(insurances[i].flight, flight)) {
                address passenger = insurances[i].passenger;
                uint256 insuranceAmount = insurances[i].amount;
                uint256 creditsBefore = credits[passenger];
                uint256 newCredits = insuranceAmount.mul(multiplier).div(10);
                insurances[i].amount = 0;
                credits[passenger] = creditsBefore.add(newCredits);
            }
        }
    }
    

    /**
     *  @dev Transfers eligible payout funds to insuree
     *
    */
    function widthdraw(address payable insuree) external requireIsOperational {
        uint256 creditsInsuree = credits[insuree];
        require(creditsInsuree > 0, "You have no credits");
        credits[insuree] = 0;
        insuree.transfer(creditsInsuree);
    }


   /**
    * @dev Initial funding for the insurance. Unless there are too many delayed flights
    *      resulting in insurance payouts, the contract should be self-sustaining
    *
    */   
    function fund(address airlineID)
        public
        requireIsOperational
        requireAuthorizedCaller
    {
        require(isRegisteredAirline(airlineID), "Not registered airline");
        require(
            !airlines[airlineID].hasProvidedFunds,
            "You have alredy provided funds"
        );
        airlines[airlineID].hasProvidedFunds = true;
    }

    function getFlightKey
                        (
                            address airline,
                            string memory flight,
                            uint256 timestamp
                        )
                        pure
                        internal
                        returns(bytes32) 
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    // /**
    // * @dev Fallback function for funding smart contract.
    // *
    // */
    // fallback() external payable {
    //     revert("fallback");
    // }

    // receive() external payable {
    // }


}

