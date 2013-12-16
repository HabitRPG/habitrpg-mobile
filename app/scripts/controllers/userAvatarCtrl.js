'use strict';

habitrpg.controller('userAvatarCtrl',
  ['$scope', '$location', 'filterFilter', 'User',
  function($scope, $location, filterFilter, User) {

//      $scope.changeHair = function(color) {
//          User.user.preferences.hair = color;
//          User.log({op:"set",data:{"preferences.hair":color}})
//      }
//
//      $scope.changeSkin = function(color) {
//          User.user.preferences.skin = color
//          User.log({op:"set",data:{"preferences.skin":color}})
//      }
//
//      $scope.changeSex = function(gender) {
//          User.user.preferences.gender = gender
//          User.log({op:"set",data:{"preferences.gender":gender}})
//
//      }
//
//      $scope.changeArmor = function(armor) {
//          User.user.preferences.armorSet = armor
//          User.log({op:"set",data:{"preferences.armorSet":armor}})
//      }
//
//      $scope.showHelm = function() {
//          User.log({op:"set",data:{"preferences.showHelm":User.user.preferences.showHelm}})
//          console.log(User.user.preferences)
//      }
//
//       $scope.hideUserAvatar = function() {
//          $('.userAvatar').hide()
//      }
  }
]);
