'use strict';

/**
 * The character controller:
 *
 */

habitrpg.controller( 'CharacterCtrl', function CharacterCtrl( $scope, $location, User ) {

        $scope.user = User.user;

        $scope.equipped = function(user, type) {
            var tier = (user.backer && user.backer.tier)
            return window.habitrpgShared.helpers.equipped(type, user.items[type], user.preferences, tier);
        }

        $scope.$watch('user.tasks', function(){
            $scope.hpPercent = function(hp) {
                return (hp / 50) * 100;
            }

            $scope.expPercent = function(exp, level) {
                return (exp / window.habitrpgShared.algos.tnl(level)) * 100;
            }
        })

        $scope.floor = Math.floor;
        $scope.count = function(arr) {
            return _.size(arr);
        }
        $scope.tnl = habitrpgShared.algos.tnl;
//        $scope.userStr = habitrpgShared.helpers.userStr;
//        $scope.userDef = habitrpgShared.helpers.userDef;
//        $scope.totalStr = habitrpgShared.helpers.totalStr;
//        $scope.totalDef = habitrpgShared.helpers.totalDef;
//        $scope.itemText = habitrpgShared.helpers.itemText;
//        $scope.itemStat = habitrpgShared.helpers.itemStat;

        $scope.showUserAvatar = function() {
            $('.userAvatar').show()
        }

});
