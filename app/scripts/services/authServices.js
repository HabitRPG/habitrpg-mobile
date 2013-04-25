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

            init: function() {

                FB.init({ appId: "374812825970494", nativeInterface: CDV.FB, useCachedDialogs: false });

            },
            getAuth: function() {
                return auth;
            },

            login: function() {
                // fixme temporary hard-coded
                user.id = '91dae4a1-895f-4698-a768-67ec0c8293bb';
                user.apiToken = 'e984549d-6364-42eb-beec-1f075d80381d';
                User.authenticate();

                FB.login(function(response) {
                           if (response.session) {
                                alert('logged in');
                            } else {
                                alert('not logged in');
                            }
                        },
                            { scope: "email" }
                    );
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