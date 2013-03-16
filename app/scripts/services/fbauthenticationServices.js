'use strict';

/**
 * Services that persists and retrieves user from localStorage.
 */
angular.module('facebookServices', []).
    factory('Facebook', function($http){

        var self = this;
        this.auth = null;

        return {
            getAuth: function() {
                return self.auth;
            },

            login: function() {
                debugger;
                FB.login(function(response) {
                    debugger;
                    if (response.authResponse) {
                        self.auth =response.authResponse;
                    } else {
                        console.log('Facebook login failed', response);
                    }
                })
            },

            logout: function() {
                FB.logout(function(response) {
                    if(response) {
                        self.auth = null;
                    } else {
                        console.log('Facebook logout failed.', response);
                    }
                })
            }
	    }
    });