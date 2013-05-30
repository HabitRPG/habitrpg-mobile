'use strict';

/**
 * Services that persists and retrieves user from localStorage.
 */

angular.module('userServices', []).
    factory('User', function ($http) {
        var STORAGE_ID = 'habitrpg-user',
            LOG_STORAGE_ID = 'habitrpg-user-log',
            HABIT_MOBILE_SETTINGS = 'habit-mobile-settings',
            settings = {}, //habit mobile settings (like auth etc.) to be stored here
            URL = 'http://127.0.0.1:3000/api/v1',
            schema = {
                stats: { gp: 0, exp: 0, lvl: 1, hp: 50 },
                party: { current: null, invitation: null },
                items: { weapon: 0, armor: 0, head: 0, shield: 0, pets: [], eggs: []},
                preferences: { gender: 'm', skin: 'white', hair: 'blond', armorSet: 'v1' },
                auth: { timestamps: {savedAt: +new Date} },
                tasks: [], // note task-types are differentiated / filtered by type {habit, daily, todo, reward}
                lastCron: 'new',
                balance: 1,
                flags: {}
            },
            user = {}, // this is stored as a reference accessible to all controllers, that way updates propagate
            actions = [], // A list of all actions done locally that are not yet saved to the server
            fetching = false; // whether fetch() was called or no. this is to avoid race conditions
        var userServices = {
            user:function () {return user;},
            authenticate: function (apiId, apiToken) {
                if (!!apiId && !!apiToken) {
                    $http.defaults.headers.common['x-api-user'] = apiId;
                    $http.defaults.headers.common['x-api-key'] = apiToken;
                    settings.auth.in = true;
                    settings.auth.apiId = apiId;
                    settings.auth.apiToken=apiToken;
                    this.fetch(); // now they've authenticated, get that user instead
                }
            },

            fetch: function () {
                var self = this;

                //do not do anything if already fetching.
                if (fetching) {
                    console.log('already fetching');
                    return;
                }
                fetching = true;

                // see http://docs.angularjs.org/api/ng.$q for promise return

                // If we have auth variables, get the user form the server
                if (settings.auth.in) {
                    $http.get(URL + '/user')
                        .success(function (data, status, heacreatingders, config) {
                            data.tasks = _.toArray(data.tasks);
                            user = data;
                            self.save();
                            fetching = false;
                        })
                        .error(function (data, status, headers, config) {
                            settings.auth.in = false;
                            fetching = false;
                        });
                }

            },

            log: function (action) {
                actions.push(action);
                localStorage.setItem(LOG_STORAGE_ID, JSON.stringify(actions));
            },

            save: function () {
                user.auth.timestamps.savedAt = +new Date; //TODO handle this with timezones
                localStorage.setItem(STORAGE_ID, JSON.stringify(user));
            }
        }


        //load settings if we have them
        if (localStorage.getItem(HABIT_MOBILE_SETTINGS)) {
            settings = JSON.parse(localStorage.getItem(HABIT_MOBILE_SETTINGS));

            //create if not
        } else {
            var defaultSettings = {
                auth: {in: false, apiId: '', apiKey:'' }
            };
            localStorage.setItem(HABIT_MOBILE_SETTINGS, JSON.stringify(defaultSettings));
        }

        //authenticate user
        userServices.authenticate('e72f55df-acf3-4cea-b9b5-024260b1a22d', '61080833-87e6-461e-afd1-2ef2dde48148');



        //first we populate user with schema
//        _.defaults(user, schema);

        //than we try to load localStorage
        if (localStorage.getItem(STORAGE_ID)) {
            user = JSON.parse(localStorage.getItem(STORAGE_ID));
        }

        //try to fetch user from remote
        userServices.fetch();


        $http.defaults.headers.get = {'Content-Type': "application/json;charset=utf-8"};

        /**
         * Synchronizes the current state to the response from the server
         * Will be called in the success and error callbacks in save().
         */
//        var sync = function(newUser){
//            //apply remote user only if there are no pending actions to be synced.
//            if(actions.length == 0) {
//                _.defaults(user, newUser);
//                // save returned user to localstorage
//
//                localStorage.setItem(STORAGE_ID, JSON.stringify(user));
//                // clear actions since they are now updated. client and server are synced
//                localStorage.setItem(LOG_STORAGE_ID, JSON.stringify(actions));
//                // apply call
//                if(cb) cb(user);
//            }
//        }

        return userServices;

    });
