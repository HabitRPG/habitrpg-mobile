/*
 * Copyright (C) 2012-2013 by Guillaume Charhon
 */
var inappbilling = { 

	// Initialize the plugin
    init: function (success, fail) { 
      return cordova.exec( success, fail, 
                           "InAppBillingPlugin", 
                           "init", ["null"]); 
    },
    // get already own items
    restoreTransactions: function (success, fail) {
        return cordova.exec( success, fail,
            "InAppBillingPlugin",
            "restoreTransactions", ["null"]);
    },
    // purchase an item
    purchase: function (success, fail, productId) { 
      return cordova.exec( success, fail, 
                           "InAppBillingPlugin", 
                           "purchase", [productId]); 
    },
    // get already own items
    getOwnItems: function (success, fail) {
        return cordova.exec( success, fail,
            "InAppBillingPlugin",
            "ownItems", ["null"]);
    },
    checkSubscriptionSupported: function (success, fail) {
        return cordova.exec( success, fail,
            "InAppBillingPlugin",
            "checkSubscriptionSupported", ["null"]);
    },
    subscribe: function (success, fail, productId) {
        return cordova.exec( success, fail,
            "InAppBillingPlugin",
            "subscribe", [productId]);
    }
};