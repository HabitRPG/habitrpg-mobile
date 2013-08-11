'use strict';

/**
 * The authentication controller (login & facebook)
 *
 */

habitrpg.controller('AuthCtrl',
  ['$scope', '$rootScope', 'Facebook', 'LocalAuth', 'User', '$http', '$location', 'API_URL',
  function($scope, $rootScope, Facebook, LocalAuth, User, $http, $location, API_URL) {
    $scope.Facebook = Facebook;
    $scope.Local = LocalAuth;

    $scope.useUUID = false;
    $scope.toggleUUID = function() {
      $scope.useUUID = !$scope.useUUID;
    }

    document.addEventListener('deviceready', function() {

      FB.init({
        appId: '374812825970494',
        nativeInterface: CDV.FB,
        useCachedDialogs: false
      });

    }, false);

    $scope.auth = function() {
      var data = {
        username: $scope.loginUsername,
        password: $scope.loginPassword
      }

      var runAuth = function(id, token){
        User.authenticate(id, token, function(err) {
          alert('Login succesfull!');
          $location.path("/habit");
        });
      }

      if ($scope.useUUID) {
        debugger
        return runAuth($scope.loginUsername, $scope.loginPassword);
      }

      $http.post(API_URL + '/api/v1/user/auth/local', data).success(function(data, status, headers, config) {
        runAuth(data.id, data.token);

        // Angular 1.1.4 bug, see https://github.com/angular/angular.js/issues/2431#issuecomment-18160256
        // Strange, it only crops up on initial login attempt
        // if(!$rootScope.$$phase) {
        //    $rootScope.$apply();
        // }
      }).error(function(data, status, headers, config) {
        alert(status)
      })

    }
  }
]);