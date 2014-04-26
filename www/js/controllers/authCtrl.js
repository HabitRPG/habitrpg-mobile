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

    var showedFacebookMessage = false;

    $scope.initLoginForm = function(useUUID) {
      $scope.useUUID = useUUID;
      $scope.login = {username:'',password:''};
    }

    document.addEventListener('deviceready', function() {

      FB.init({
        appId: '374812825970494',
        nativeInterface: CDV.FB,
        useCachedDialogs: false
      });

    }, false);

    $scope.register = function() {
      if ($scope.registrationForm.$invalid) {
        //TODO highlight invalid inputs
        // we have this as a workaround for https://github.com/HabitRPG/habitrpg-mobile/issues/64
        return;
      }
      $http.post(API_URL + '/api/v2/register', $scope.registerVals)
        .success(function(data, status, headers, config) {
          User.authenticate(data.id, data.apiToken, function(err) {
            $location.path("/habit");
          });
        })
        .error(function(data, status, headers, config) {
          if (status === 0) {
            alert("Server not currently reachable, try again later");
          } else if (!!data && !!data.err) {
            alert(data.err);
          } else {
            alert('ERROR: ' + status);
          }
        });
    }

    $scope.auth = function() {
      var data = {
        username: $scope.login.username,
        password: $scope.login.password
      }

      var runAuth = function(id, token){
        User.authenticate(id, token, function(err) {
          $location.path("/habit");
        });
      }

      if ($scope.useUUID) {
        runAuth($scope.login.username, $scope.login.password);
      } else {
        $http.post(API_URL + '/api/v2/user/auth/local', data)
          .success(function(data, status, headers, config) {
            runAuth(data.id, data.token);
          }).error(function(data, status, headers, config) {
            if (status === 0) {
              alert("Server not currently reachable, try again later");
            } else if (!!data && !!data.err) {
              alert(data.err);
            } else {
              alert('ERROR: ' + status);
            }
          });
      }
    }
  }
]);
