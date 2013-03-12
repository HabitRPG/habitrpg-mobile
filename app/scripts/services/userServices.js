'use strict';

/**
 * Services that persists and retrieves user from localStorage.
 */

angular.module('userServices', ['ngResource']).
    factory('User', function($resource, $http, $rootScope){
        var STORAGE_ID = 'habitrpg-user',
            URL = 'http://localhost:3000/api/v1/user',
            schema = {
                stats : { gp:0, exp:0, lvl:1, hp:50          },
                party : { current:null, invitation:null      },
                items : { weapon:0, armor:0, head:0, shield:0, pets: [], eggs: []},
                preferences: { gender: 'm', skin: 'white', hair: 'blond', armorSet: 'v1' },
                tasks: [], // note task-types are differentiated / filtered by type {habit, daily, todo, reward}
                apiToken : null,
                lastCron: 'new',
                balance  : 1,
                flags: { partyEnabled:false, itemsEnabled:false},
                lastSync: +new Date
            },
            user; // this is stored as a reference accessible to all controllers, that way updates propagate

        // tmp vars, will be replaced once api-auth done
        var uuid = 'ad71feef-056f-40d9-b1fb-144ce156cd4d',
            token = '285dec52-d032-4860-acf4-b589dc64d857';

        $http.defaults.headers.get = {'Content-Type':"application/json;charset=utf-8"};
        $http.defaults.headers.common['x-api-user'] = uuid;
        $http.defaults.headers.common['x-api-key'] = token;


        return {

            fetch: function(cb) {
                if (!!user) return cb(user);
                var self = this;

                // see http://docs.angularjs.org/api/ng.$q for promise return

                // If we have auth variables, get the user form the server
                if (!!uuid && !!token) {
                    $http.get(URL)
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
                        this.save(user);
                    }
                    cb(user);
                }
            },

            save: function(data, cb) {
                if (!data) return; //todo !data means send to server

                var self = this;
                user = data;
                localStorage.setItem(STORAGE_ID, JSON.stringify(user));
                if (!!cb) return cb(user);
                /*if (!!uuid && !!token) {
                    $http.put(URL).success(function(data) {
                        cb(data);
                    });
                }*/
            },

            remove: function(cb) {
                /*return User.update({id: this._id.$oid},
                    angular.extend({}, this, {_id:undefined}), cb);
                    */
            }
        }

    });

