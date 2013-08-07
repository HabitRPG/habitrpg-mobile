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

    //localStorage.clear()

    document.addEventListener('deviceready', function() {

        FB.init({
            appId: '374812825970494',
            nativeInterface: CDV.FB,
            useCachedDialogs: false
        });

        //Facebook.authUser();
        //updateAuthElements();
    }, false);

    $scope.auth = function() {
        var data = {
            username: $scope.loginUsername,
            password: $scope.loginPassword
        }

        $http.post(API_URL + '/api/v1/user/auth/local', data).success(function(data, status, headers, config) {
            User.authenticate(data.id, data.token, function(err) {
              alert('Login succesfull!');
              $location.path("/habit");
            });

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