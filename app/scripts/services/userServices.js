'use strict';

/**
 * Services that persists and retrieves user from localStorage.
 */

angular.module('userServices', []).
    factory('User', function ($http) {
        $http.defaults.headers.get = {'Content-Type': "application/json;charset=utf-8"};
        var STORAGE_ID = 'habitrpg-user',
            HABIT_MOBILE_SETTINGS = 'habit-mobile-settings',
            defaultSettings = {
                auth: {in: false, apiId: '', apiKey: '' },
                sync: {
                    queue: [], //here OT will be queued up, this is NOT call-back queue!
                    sent: [] //here will be OT which have been sent, but we have not got reply from server yet.
                }
            },
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
            fetching = false; // whether fetch() was called or no. this is to avoid race conditions

        var syncQueue = function () {
            var queue =settings.sync.queue;
            var sent = settings.sync.sent;

            if (queue&&!fetching) {
                fetching=true;
//                move all actions from queue array to sent array
                _.times(queue.length,function (){sent.push(queue.shift())});

                $http.post(URL + '/APIv2/')
                    .success(function (data, status, heacreatingders, config) {
                        data.tasks = _.toArray(data.tasks);
                        user = data;
                        self.save();
                        sent=[];
                        fetching = false;
                        syncQueue(); // call syncQueue to check if anyone pushed more actions to the queue while we were talking to server.
                    })
                    .error(function (data, status, headers, config) {
                        //move sent actions back to queue
                        _.times(sent.length,function (){queue.push(sent.shift())});
                        fetching = false;
                        alert('Sync error')
                    });
            }
        };

        var userServices = {
            user: user,

            authenticate: function (apiId, apiToken) {
                if (!!apiId && !!apiToken) {
                    $http.defaults.headers.common['x-api-user'] = apiId;
                    $http.defaults.headers.common['x-api-key'] = apiToken;
                    settings.auth.in = true;
                    settings.auth.apiId = apiId;
                    settings.auth.apiToken = apiToken;
                    this.fetch();
                }
            },

            fetch: function () {
                var self = this;

                //do not do anything if already fetching.
                if (fetching) {
                    console.log('already fetching');
                    return;
                }


                // see http://docs.angularjs.org/api/ng.$q for promise return

                // If we have auth variables, get the user form the server
                if (settings.auth.in) {
                    fetching = true;
                    $http.get(URL + '/user')
                        .success(function (data, status, heacreatingders, config) {
                            data.tasks = _.toArray(data.tasks);
                            _.extend(user, data);
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
                settings.sync.queue.push(action);
                this.save();
                syncQueue();
            },

            save: function () {
                user.auth.timestamps.savedAt = +new Date; //TODO handle this with timezones
                localStorage.setItem(STORAGE_ID, JSON.stringify(user));
                localStorage.setItem(HABIT_MOBILE_SETTINGS, JSON.stringify(settings));
            }
        }


        //load settings if we have them
        if (localStorage.getItem(HABIT_MOBILE_SETTINGS)) {
            settings = JSON.parse(localStorage.getItem(HABIT_MOBILE_SETTINGS));

            //create and load if not
        } else {
            localStorage.setItem(HABIT_MOBILE_SETTINGS, JSON.stringify(defaultSettings));
            settings = defaultSettings;
        }


        //first we populate user with schema
        _.extend(user, schema);

        //than we try to load localStorage
        if (localStorage.getItem(STORAGE_ID)) {
            _.extend(user, JSON.parse(localStorage.getItem(STORAGE_ID)));
        }

        //try to fetch user from remote
        userServices.fetch();

        return userServices;

    });
