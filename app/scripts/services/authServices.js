'use strict';

/**
 * Services that persists and retrieves user from localStorage.
 */

angular.module('authServices', ['userServices']).
    factory('Facebook', function($http, User){
        //TODO FB.init({appId: '${section.parameters['facebook.app.id']}', status: true, cookie: true, xfbml: true});
        var auth,
            user;

        User.get(function(data){
            user = data;
        })

        return {

            getAuth: function() {
                return auth;
            },

            login: function() {
                user.id = '';
                user.apiToken = '';
                User.authenticate();
                return;

                FB.login(function(response) {
                    if (response.authResponse) {
                        // 1. get userid & accesstoken
                        // 2. store in user
                        // 3. authenticate()
                        debugger;
                    } else {
                        console.log('Facebook login failed', response);
                    }
                })
            },

            logout: function() {
                FB.logout(function(response) {
                    if(response) {
                        // todo what to do here?
                        debugger;
                    } else {
                        console.log('Facebook logout failed.', response);
                    }
                })
            }
        }

    })

   .factory('LocalAuth', function($http, User){

        var auth,
            user;

        User.get(function(data){
            user = data;
        })

        return {

            getAuth: function() {
                return auth;
            },

            login: function() {
                user.id = '';
                user.apiToken = '';
                User.authenticate();
                return;

            },

            logout: function() {
            }
        }

    });
