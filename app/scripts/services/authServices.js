'use strict';

/**
 * Services that persists and retrieves user from localStorage.
 */

angular.module('authServices', ['userServices']).
    factory('Facebook', function($http, User){
        window.fbAsyncInit = function () {
            FB.init({
                appId: 149438691882945, // App ID
                status: true, // check login status
                cookie: true, // enable cookies to allow the server to access the session
                xfbml: true,  // parse XFBML
                oauth: true
            });
        };
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
                        user.auth =response.authResponse;
                        //1. Get user id & apiToken from server using facebook id
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
                // fixme temporary hard-coded
                user.id = '91dae4a1-895f-4698-a768-67ec0c8293bb';
                user.apiToken = 'e984549d-6364-42eb-beec-1f075d80381d';
                User.authenticate();
                return;

            },

            logout: function() {
            }
        }

    });
