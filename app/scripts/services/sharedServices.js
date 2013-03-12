'use strict';

/**
 * Services that persists and retrieves user from localStorage.
 */

angular.module('sharedServices', [] ).
    factory("Items", function($rootScope){
        return window.habitrpgShared.items;
    }).
    factory("Algos", function($rootScope){
        return window.habitrpgShared.algos;
    }).
    factory('Scoring', function($rootScope, User, Algos, Items){

        //TODO implement with promises

        var MODIFIER = Algos.modifier
            , user
            , cron
            , score
            , updateStats
            , helpers = window.habitrpgShared.helpers;


        User.fetch(function(data) {
            user = data;
        })

        function score(taskId, direction, times, cron) {
            debugger
            var task = _.findWhere(user.tasks, {id: taskId})
                , type = task.type
                , value = task.value
                , priority = task.priority || '!'
                , delta = 0
                , times = times? times: 1;


            if (task.value > user.stats.gp && task.type === 'reward') {
                r = confirm("Not enough GP to purchase this reward, buy anyway and lose HP? (Punishment for taking a reward you didn't earn).");
                if (!r) return;
            }

            function calculateDelta(adjustvalue) {
                adjustvalue = adjustvalue? adjustvalue: true;
                _.times(times, function(n) {
                    var nextDelta;
                    nextDelta = Algos.taskDeltaFormula(value, direction);
                    if (adjustvalue) {
                        value += nextDelta;
                    }
                    delta += nextDelta;
                });
            };

            function addPoints(user, delta ,Items) {
                var level, weaponStrength;
                level = user.stats.lvl;
                weaponStrength = Items.items.weapon[user.items.weapon].strength;
                user.stats.exp += Algos.expModifier(delta, weaponStrength, level, priority);
                user.stats.gp += Algos.gpModifier(delta, 1, priority);
            };

            function subtractPoints() {
                var armorDefense, helmDefense, level, shieldDefense;
                level = user.stats.lvl;
                armorDefense = Items.items.armor[user.items.armor].defense;
                helmDefense = Items.items.head[user.items.head].defense;
                shieldDefense = Items.items.shield[user.items.shield].defense;
                user.stats.hp += Algos.hpModifier(delta, armorDefense, helmDefense, shieldDefense, level, priority);
            };
            switch (type) {
                case 'habit':
                    calculateDelta();
                    if (delta > 0) {
                        addPoints();
                    } else {
                        subtractPoints();
                    }
                    task.history = task.history? task.history: [];
                    if (task.value !== value) {
                        task.history.push({
                            date: +(new Date),
                            value: value
                        });
                    }
                    break;
                case 'daily':
                    if (cron != null) {
                        calculateDelta();
                        subtractPoints();
                    } else {
                        calculateDelta(false);
                        if (delta !== 0) {
                            addPoints();
                        }
                    }
                    break;
                case 'todo':
                    if (cron != null) {
                        calculateDelta();
                    } else {
                        calculateDelta();
                        addPoints();
                    }
                    break;
                case 'reward':
                    calculateDelta(false);
                    user.stats.gp -= Math.abs(task.value);
                    var num = parseFloat(task.value).toFixed(2);
                    if (user.stats.gp < 0) {
                        user.stats.hp += user.stats.gp;
                        user.stats.gp = 0;
                    }
            }
            task.value = value;
            updateStats();
            return delta;
        };

        /*
         Updates user stats with new stats. Handles death, leveling up, etc
         {stats} new stats
         {update} if aggregated changes, pass in userObj as update. otherwise commits will be made immediately
         */


        function updateStats() {
            if (user.stats.lvl === 0) return;
            if (user.stats.hp <= 0) {
                user.stats.lvl = 0; // signifies dead
                user.stats.hp = 0;
                return;
            }
            if (user.stats.lvl >= 100) {
                user.stats.gp += user.stats.exp / 15;
                user.stats.exp = 0;
                user.stats.lvl = 100;
            } else {
                var tnl = user.stats.tnl = Algos.tnl(user.stats.lvl);
                if (user.stats.exp >= tnl) {
                    while (user.stats.exp >= tnl && user.stats.lvl < 100) {
                        user.stats.exp -= tnl;
                        user.stats.lvl++;
                        user.stats.tnl = Algos.tnl(user.stats.lvl);
                    }
                    if (user.stats.lvl === 100) {
                        user.stats.exp = 0;
                    }
                    user.stats.hp = 50;
                }
            }
            if (!user.flags.customizationsNotification && (user.stats.exp > 10 || user.stats.lvl > 1)) {
                user.flags.customizationsNotification = true;
                user.flags.customizationsNotification = true;
            }
            if (!user.flags.itemsEnabled && user.stats.lvl >= 2) {
                user.flags.itemsEnabled = true;
                user.flags.itemsEnabled = true;
            }
            if (!user.flags.partyEnabled && user.stats.lvl >= 3) {
                user.flags.partyEnabled = true;
                user.flags.partyEnabled = true;
            }
            if (!user.flags.petsEnabled && user.stats.lvl >= 4) {
                user.flags.petsEnabled = true;
                user.flags.petsEnabled = true;
            }

            if (user.stats.gp < 0) user.stats.gp = 0.0;
        };

        return {
            score: score
        };
    })