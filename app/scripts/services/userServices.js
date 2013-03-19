'use strict';

/**
 * Services that persists and retrieves user from localStorage.
 */

angular.module('userServices', []).
    factory('User', function($http){
        var STORAGE_ID = 'habitrpg-user',
            URL = 'https://habitrpg.com/api/v1',
            schema = {
                stats : { gp:0, exp:0, lvl:1, hp:50 },
                party : { current:null, invitation:null },
                items : { weapon:0, armor:0, head:0, shield:0, pets: [], eggs: []},
                preferences: { gender: 'm', skin: 'white', hair: 'blond', armorSet: 'v1' },
                auth: { timestamps: {savedAt: +new Date} },
                tasks: [], // note task-types are differentiated / filtered by type {habit, daily, todo, reward}
                lastCron: 'new',
                balance  : 1,
                flags: {}
            },
            user, // this is stored as a reference accessible to all controllers, that way updates propagate
            authenticated = false;

        $http.defaults.headers.get = {'Content-Type':"application/json;charset=utf-8"};

        return {

            authenticate: function() {
                if (!!user.id && !!user.apiToken) {
                    $http.defaults.headers.common['x-api-user'] = user.id;
                    $http.defaults.headers.common['x-api-key'] = user.apiToken;
                    authenticated = true;
                    this.fetch(); // now they've authenticated, get that user instead
                }

            },

            fetch: function(cb) {
                var self = this;

                // see http://docs.angularjs.org/api/ng.$q for promise return

                // If we have auth variables, get the user form the server
                if (authenticated) {
                    $http.get(URL + '/user')
                        .success(function(data, status, headers, config) {
                            data.tasks = _.toArray(data.tasks);
                            self.save(data, function(user){
                                cb(user);
                            });
                        })
                        .error(function(data, status, headers, config) {
                            debugger;
                        });

                // else just work with localStorage user
                } else {
                    user = JSON.parse(localStorage.getItem(STORAGE_ID));
                    if (!user) {
                        user = schema;
                        self.save(user);
                    }
                    cb(user);
                }
            },

            get: function(cb) {
                if(!!user) return cb(user);
                return this.fetch(cb)
            },

            /**
             * Save the user object. Will sync with the server
             *
             * Current thought process: send only the things you want to change. Eg on a Algos.score() operation, we'd queue
             * PUT /api/v1/user data: {stats:{exp,hp,gp,lvl}, tasks.scored-task:{value,history,etc}
             * The server will run sent objects through _.defaults, so it's non-destructive. If you want to delete properties
             * (eg, removing tasks), set that as a flag on the task: {text, notes, value, delete:true}
             * Send POST /api/v1/user for creating new user objects, decide in this function whether PUT or POST based on
             * if user.id && user.apiToken exist
             *
             * @param paths: if we want to apply a partial update to the server (save some resources), send an array
             *  of paths (or single path string) like 'stats.hp' or ['stats', 'tasks.productivity']. Passing in null means
             *  save the whole user object to the server
             * @returns {*}
             */
            save: function(paths) {
                var self = this;
                user.auth.timestamps.savedAt = +new Date; //TODO handle this with timezones
                localStorage.setItem(STORAGE_ID, JSON.stringify(user));

                /**
                 * If not authenticated, just save locally
                 * If authenticating and only saved locally, create new user on the server
                 * If authenticating and exists on the server, do some crazy merge magic
                 */
                if (authenticated) {
                    var partialUserObj = user; //TODO apply partial

                    $http.put({url: URL + '/user', data: {user:partialUserObj}}).success(function(data) {
                        cb(data);
                    });
                }
            },

            remove: function(cb) {
                /*return User.update({id: this._id.$oid},
                    angular.extend({}, this, {_id:undefined}), cb);
                    */
            }
        }

    })

