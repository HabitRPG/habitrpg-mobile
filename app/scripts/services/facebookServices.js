'use strict';

/**
 * Services that persists and retrieves user from localStorage.
 */
angular.module('facebookServices', ['userServices']).
    factory('Facebook', function($http, User){
        //TODO FB.init({appId: '${section.parameters['facebook.app.id']}', status: true, cookie: true, xfbml: true});

        var auth,
            user;

        User.get(function(data){
            user = data;
        })

        function authenticate() {
            $http.defaults.headers.common['x-api-user'] = user.id;
            $http.defaults.headers.common['x-api-key'] = user.apiToken;
        }

        return {

            getAuth: function() {
                return auth;
            },

            login: function() {
                // fixme temporary hard-coded
                user.id = '91dae4a1-895f-4698-a768-67ec0c8293bb';
                user.apiToken = 'e984549d-6364-42eb-beec-1f075d80381d';
                return authenticate();

                FB.login(function(response) {
                    if (response.authResponse) {
                        //user.auth =response.authResponse;
                        // 1. Get user id & apiToken from server using facebook id
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

    });