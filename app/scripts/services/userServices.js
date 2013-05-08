'use strict';

/**
 * Services that persists and retrieves user from localStorage.
 */

angular.module('userServices', []).
    factory('User', function($http){
        var STORAGE_ID = 'habitrpg-user',
            LOG_STORAGE_ID = 'habitrpg-user-log',
            URL = 'http://localhost:3000/api/v1',
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
            authenticated = false,
            actions = [], // A list of all actions done locally that are not yet saved to the server
            fetched = false, // whether fetch() was called or no. this is to avoid race conditions
            callbackQue = [], // a queue of callbacks to be called once user is fetched
            waiting = false; //Indicates if an update was sent to the server and we are waiting for a response

        $http.defaults.headers.get = {'Content-Type':"application/json;charset=utf-8"};
        function setAuthHeaders(uid, apiToken){
            $http.defaults.headers.common['x-api-user'] = uid;
            $http.defaults.headers.common['x-api-key'] = apiToken;
            authenticated = true;
        }

        /**
        * Synchronizes the current state to the response from the server
        * Will be called in the success and error callbacks in save().
        */
        var sync = function(newUser, cb){
            if(actions.length == 0){
                for(var key in newUser){
                    user[key] = newUser[key];
                }
                // save returned user to localstorage
                localStorage.setItem(STORAGE_ID, JSON.stringify(user));
                // clear actions since they are now updated. client and server are synced
                localStorage.setItem(LOG_STORAGE_ID, JSON.stringify(actions));
                // apply call
                if(cb) cb(user);
            }else{
                save({callback: cb});
            }
        }

        var save = function(options) {
            var self = this;
            options = options || {};
            user.auth.timestamps.savedAt = +new Date; //TODO handle this with timezones
            localStorage.setItem(STORAGE_ID, JSON.stringify(user));

            /**
             * If not authenticated, just save locally)
             * If authenticating and only saved locally, create new user on the server
             * If authenticating and exists on the server, do some crazy merge magic
             */

            if (authenticated && ! options.skipServer) {
                if(! waiting){ // Don't perform an action if we are already waiting for a response from the server
                    var action = actions.shift();
                    var url = "",method = "", params = {}, validAction = true;
                    if(action.op == "create_task"){
                        url = "/tasks";
                        method = "post"
                        params = action.task
                    }else if(action.op == "score"){
                        url = "/tasks/" + action.task + "/score";
                        method = "put";
                        params = {task: action.task, dir: action.dir};
                    }else if(action.op == "edit_task"){
                        url = "/tasks/" + action.task ;
                        method = "put";
                        params = action.task;
                    }else if(action.op == "delete_task"){
                        url = "/tasks/" + action.task ;
                        method = "delete";
                    }else if(action.op == "buy_reward"){
                    }else{
                        validAction = false;
                    }

                    if(validAction){
                        //we are going to send a request to server. so we should set waiting to true
                        waiting = true;
                        // TODO only update if actions is empty, otherwise, call save again
                        $http[method](URL + url, params).success(function(data) {
                            console.log(data);
                            waiting = false;
                            sync(data, options.callback);
                        }).error(function(data){
                            console.log(data.message);
                            console.log(data.state);
                            waiting = false;
                            if(data.state){
                                sync(data.state, options.callback );
                            }else{
                                // Failed to connect to server. add the action back to actions
                                actions.unshift(action);
                            }
                        });
                    }
                }
            }
        }

        //TODO change this once we have auth built
        setAuthHeaders('ec1d6529-248c-4b42-85b6-b993daeef3f9', '4e5e73be-35f8-4cb6-b75d-aabc32ffd74a');

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
                        .success(function(data, status, heacreatingders, config) {
                            data.tasks = _.toArray(data.tasks);
                            user = data;
                            self.save({skipServer:true});
                            cb(user);
                            // loop on all callbacks in the callbackQue and call them with user as argument
                            _.each(callbackQue, function(callback){
                                callback(user);
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
                        self.save();
                    }
                    user.lastUpdated = user.lastUpdated ? new Date(user.lastUpdated) : undefined ;
                    cb(user);
                    // loop on all callbacks in the callbackQue and call them with user as argument
                    _.each(callbackQue, function(callback){
                        callback(user);
                    });
                }
                actions = JSON.parse( localStorage.getItem(LOG_STORAGE_ID) || "[]" );
            },

            log: function(action) {
                actions.push(action);
                localStorage.setItem(LOG_STORAGE_ID, JSON.stringify(actions));
            },

            get: function(cb) {
                if(!!user) return cb(user);
                if(fetched){
                    // fetch was called but the user is not set yet.
                    callbackQue.push(cb);
                }else{
                    // first call to fetch
                    fetched = true;
                    return this.fetch(cb);
                }
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
            save:  save,

            remove: function(cb) {
                /*return User.update({id: this._id.$oid},
                    angular.extend({}, this, {_id:undefined}), cb);
                    */
            }
        }

    })

