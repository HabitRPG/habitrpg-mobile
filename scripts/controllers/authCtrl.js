'use strict';

/**
 * The authentication controller (login & facebook)
 *
 */

habitrpg.controller('AuthCtrl',
  ['$scope', '$rootScope', 'User', '$http', '$location', 'ApiUrl',
  function($scope, $rootScope, User, $http, $location, ApiUrl) {

    $scope.initLoginForm = function() {
      $scope.login = {username:'',password:'',endpoint:ApiUrl.get()};
      $scope.registerVals = { endpoint: ApiUrl.get()};
    };

    $scope.setApiEndpoint = function (newEndpoint) {
      habitrpg.value('API_URL', newEndpoint);
      localStorage.setItem('habitrpg-endpoint', newEndpoint);
      $rootScope.settings.auth.apiEndpoint = newEndpoint;
      ApiUrl.setApiUrl(newEndpoint);

      return newEndpoint;
    };

    $scope.register = function(form, registerVals) {
      if (form.$invalid) {
        //TODO highlight invalid inputs
        // we have this as a workaround for https://github.com/HabitRPG/habitrpg-mobile/issues/64
        return;
      }

      $scope.setApiEndpoint(registerVals.endpoint);

      $http.post(ApiUrl.get() + '/api/v2/register', registerVals)
        .success(function(data, status, headers, config) {
          User.authenticate(data.id, data.apiToken, function(err) {
            executePushRegistration();

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

    var runAuth = function(id, token){
      User.authenticate(id, token, function(err) {
        executePushRegistration();
        $location.path("/habit");
      });
    }

    $scope.auth = function() {
      var data = {
        username: $scope.login.username,
        password: $scope.login.password
      }

      $scope.setApiEndpoint($scope.login.endpoint);

      if ($scope.useUUID) {
        runAuth($scope.login.username, $scope.login.password);
      } else {
        $http.post(ApiUrl.get() + '/api/v2/user/auth/local', data)
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

    // ------ Social ----------

    hello.init({
      facebook : '128307497299777'
    }, {redirect_uri : 'https://habitrpg.com'});

    $scope.socialLogin = function(network){
      hello(network).login({scope:'email'}).then(function(auth){
        $http.post(ApiUrl.get() + "/api/v2/user/auth/social", auth)
          .success(function(data, status, headers, config) {
            runAuth(data.id, data.token);
          }).error(errorAlert);
      }, function( e ){
        alert("Signin error: " + e.error.message );
      });
    }
  }
]);
