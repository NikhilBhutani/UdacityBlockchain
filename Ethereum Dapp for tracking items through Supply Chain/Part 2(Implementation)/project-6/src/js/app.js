App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originManufacturerID: "0x0000000000000000000000000000000000000000",
    originManufacturerName: null,
    originManufacturerInformation: null,
    originManufacturerLatitude: null,
    originManufacturerLongitude: null,
    productNotes: null,
    productPrice: 0,
    dealerID: "0x0000000000000000000000000000000000000000",
    supplierID: "0x0000000000000000000000000000000000000000",
    customerID: "0x0000000000000000000000000000000000000000",

    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        App.sku = $("#sku").val();
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.originManufacturerID = $("#originManufacturerID").val();
        App.originManufacturerName = $("#originManufacturerName").val();
        App.originManufacturerInformation = $("#originManufacturerInformation").val();
        App.originManufacturerLatitude = $("#originManufacturerLatitude").val();
        App.originManufacturerLongitude = $("#originManufacturerLongitude").val();
        App.productNotes = $("#productNotes").val();
        App.productPrice = $("#productPrice").val();
        App.dealerID = $("#dealerID").val();
        App.supplierID = $("#supplierID").val();
        App.customerID = $("#customerID").val();

        console.log(
            App.sku,
            App.upc,
            App.ownerID, 
            App.originManufacturerID, 
            App.originManufacturerName, 
            App.originManufacturerInformation, 
            App.originManufacturerLatitude, 
            App.originManufacturerLongitude, 
            App.productNotes, 
            App.productPrice, 
            App.dealerID, 
            App.supplierID, 
            App.customerID
        );
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",);
            App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
        }

        App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];

        })
    },

    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain='../../build/contracts/SupplyChain.json';
        
        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            console.log('data',data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);
            
            App.fetchItemBufferOne();
            App.fetchItemBufferTwo();
            App.fetchEvents();

        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case 1:
                return await App.orderSuppliesForItem(event);
                break;
            case 2:
                return await App.receiveSuppliesForItem(event);
                break;
            case 3:
                return await App.assembleAndManufacturedItem(event);
                break;
            case 4:
                return await App.sellItemToDealer(event);
                break;
            case 5:
                return await App.buyItembyDealer(event);
                break;
            case 6:
                return await App.shipAutomobileItemToDealer(event);
                break;
            case 7:
                return await App.receiveItemByDealer(event);
                break;
            case 8:
                return await App.purchaseItemByCustomer(event);
                break;
            case 9:
                return await App.fetchItemBufferOne(event);
                break;
            case 10:
                return await App.fetchItemBufferTwo(event);
                break;
            }
    },

    orderSuppliesForItem: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        console.log('upc', App.upc)
        console.log('supplierID', App.supplierID)
        console.log('metamaskAccountID', App.metamaskAccountID)
        console.log('originManufacturerName', App.originManufacturerName)
        console.log('App.originManufacturerInformation', App.originManufacturerInformation)
        console.log('App.originManufacturerLatitude', App.originManufacturerLatitude)
        console.log('App.originManufacturerLongitude', App.originManufacturerLongitude)
        console.log("App.productNotes", App.productNotes)

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.orderSuppliesForItem(
                App.upc,
                App.supplierID, 
                App.metamaskAccountID, 
                App.originManufacturerName, 
                App.originManufacturerInformation, 
                App.originManufacturerLatitude, 
                App.originManufacturerLongitude, 
                App.productNotes
            );
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('orderSuppliesForItem',result);
        }).catch(function(err) {
            console.log('orderSuppliesForItem error ',err);
        });
    },

    receiveSuppliesForItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.receiveSuppliesForItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('receiveSuppliesForItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },
    
    assembleAndManufacturedItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.assembleAndManufacturedItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('assembleAndManufacturedItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    sellItemToDealer: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const productPrice = web3.toWei(1, "ether");
            console.log('productPrice',productPrice);
            return instance.sellItemToDealer(App.upc, App.productPrice, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('sellItemToDealer',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    buyItembyDealer: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const walletValue = web3.toWei(1, "ether");
            return instance.buyItembyDealer(App.upc, App.dealerID, {from: App.metamaskAccountID, value: walletValue});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('buyItembyDealer',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    shipAutomobileItemToDealer: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.shipAutomobileItemToDealer(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('shipAutomobileItemToDealer',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    receiveItemByDealer: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.receiveItemByDealer(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('receiveItemByDealer',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    purchaseItemByCustomer: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.purchaseItemByCustomer(App.upc, App.customerID, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('purchaseItemByCustomer',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    fetchItemBufferOne: function () {
    ///   event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
        App.upc = $('#upc').val();
        console.log('upc',App.upc);

        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferOne(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchItemBufferOne', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchItemBufferTwo: function () {
    ///    event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
                        
        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferTwo.call(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchItemBufferTwo', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                App.contracts.SupplyChain.currentProvider,
                    arguments
              );
            };
        }

        App.contracts.SupplyChain.deployed().then(function(instance) {
        var events = instance.allEvents(function(err, log){
          if (!err)
            $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
        }).catch(function(err) {
          console.log(err.message);
        });
        
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
